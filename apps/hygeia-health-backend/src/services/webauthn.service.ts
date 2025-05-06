import { isoBase64URL } from '@simplewebauthn/server/helpers';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { verifyAuthenticationResponse } from '../../node_modules/@simplewebauthn/server/script/authentication/verifyAuthenticationResponse';
import type { AuthenticatorTransport } from '@simplewebauthn/types';
import { getDB } from '../db';
import { users, authenticators } from '../db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { sign } from 'hono/jwt';
import { COOKIE_OPTIONS, JWT_EXPIRY, KV_EXPIRY, WEB_AUTHN_CONFIG } from '../config/constants';

export class WebAuthnService {
  constructor(private env: any) {}

  async generateRegistrationOptions(name: string, email: string) {
    const userId = uuidv4();
    const challenge = isoBase64URL.fromBuffer(crypto.getRandomValues(new Uint8Array(32)));

    const options = {
      challenge,
      rp: {
        name: WEB_AUTHN_CONFIG.rpName,
        id: new URL(this.env.env.TEST_BASE_URL).hostname,
      },
      user: {
        id: userId,
        name,
        displayName: name,
      },
      pubKeyCredParams: WEB_AUTHN_CONFIG.pubKeyCredParams,
      timeout: WEB_AUTHN_CONFIG.timeout,
      authenticatorSelection: WEB_AUTHN_CONFIG.authenticatorSelection,
      attestation: WEB_AUTHN_CONFIG.attestation,
    };

    await this.env.env.webauthn_kv.put(`register:${userId}`, JSON.stringify({
      id: userId,
      name,
      email,
      loginType: 'passkey',
      currentChallenge: challenge
    }), { expirationTtl: KV_EXPIRY });

    return options;
  }

  async verifyRegistration(userId: string, credential: any) {
    const db = getDB(this.env);
    const userData = await this.env.env.webauthn_kv.get(`register:${userId}`);
    if (!userData) {
      throw new Error('Registration data not found');
    }

    const user = JSON.parse(userData);
    if (!user.currentChallenge) {
      throw new Error('No registration challenge found');
    }

    const verification = await verifyRegistrationResponse({
      response: credential,
      expectedChallenge: user.currentChallenge,
      expectedOrigin: this.env.env.TEST_BASE_URL,
      expectedRPID: new URL(this.env.env.TEST_BASE_URL).hostname,
      requireUserVerification: true,
    });

    if (!verification.verified || !verification.registrationInfo) {
      throw new Error('Verification failed');
    }

    const safeCounter = typeof verification.registrationInfo.credential?.counter === 'number' 
      ? verification.registrationInfo.credential.counter 
      : 0;

    await db.insert(users).values({
      id: user.id,
      name: user.name,
      email: user.email,
      loginType: user.loginType
    });

    if (!verification.registrationInfo.credential) {
      throw new Error('Verify credential failed');
    }

    await db.insert(authenticators).values({
      id: uuidv4(),
      credentialID: String(verification.registrationInfo.credential.id),
      credentialPublicKey: isoBase64URL.fromBuffer(verification.registrationInfo.credential.publicKey),
      counter: safeCounter,
      userId: user.id
    });

    await this.env.env.webauthn_kv.delete(`register:${user.id}`);

    return this.generateAuthToken(user);
  }

  async generateLoginOptions(email: string) {
    const db = getDB(this.env);
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1).then(rows => rows[0]);
    if (!user) {
      throw new Error('User not found');
    }

    const authenticator = await db.select()
      .from(authenticators)
      .where(eq(authenticators.userId, user.id))
      .limit(1)
      .then(rows => rows[0]);

    if (!authenticator) {
      throw new Error('Authenticator not found');
    }

    const challenge = isoBase64URL.fromBuffer(crypto.getRandomValues(new Uint8Array(32)));

    const options = {
      challenge,
      rpId: new URL(this.env.env.TEST_BASE_URL).hostname,
      userId: user.id,
      allowCredentials: [
        {
          type: 'public-key',
          id: authenticator.credentialID,
        },
      ],
      timeout: WEB_AUTHN_CONFIG.timeout,
      userVerification: WEB_AUTHN_CONFIG.authenticatorSelection.userVerification,
    };

    await this.env.env.webauthn_kv.put(`login:${user.id}`, JSON.stringify({ challenge }), { expirationTtl: KV_EXPIRY });

    return options;
  }

  async verifyLogin(userId: string, credential: any) {
    const db = getDB(this.env);
    const storedChallengeData = await this.env.env.webauthn_kv.get(`login:${userId}`);
    if (!storedChallengeData) {
      throw new Error('Login challenge not found');
    }

    const storedChallenge = JSON.parse(storedChallengeData).challenge;
    const authenticator = await db.select()
      .from(authenticators)
      .where(eq(authenticators.userId, userId))
      .limit(1)
      .then(rows => rows[0]);

    if (!authenticator) {
      throw new Error('Authenticator not found');
    }

    const verification = await verifyAuthenticationResponse({
      response: credential,
      expectedChallenge: storedChallenge,
      expectedOrigin: this.env.env.TEST_BASE_URL,
      expectedRPID: new URL(this.env.env.TEST_BASE_URL).hostname,
      credential: {
        id: credential.id,
        publicKey: isoBase64URL.toBuffer(authenticator.credentialPublicKey),
        counter: authenticator.counter,
        transports: (authenticator.transports || []) as AuthenticatorTransport[]
      },
      requireUserVerification: true,
    });

    if (!verification.verified || !verification.authenticationInfo) {
      throw new Error('Login verification failed');
    }

    await db.update(authenticators)
      .set({ counter: verification.authenticationInfo.newCounter })
      .where(eq(authenticators.credentialID, String(verification.authenticationInfo.credentialID)));

    await this.env.env.webauthn_kv.delete(`login:${userId}`);

    return this.generateAuthToken({ id: userId });
  }

  private async generateAuthToken(user: { id: string; email?: string; name?: string }) {
    const jwt = await sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        exp: Math.floor(Date.now() / 1000) + JWT_EXPIRY,
      },
      this.env.env.JWT_SECRET,
      'HS256'
    );

    return jwt;
  }
} 