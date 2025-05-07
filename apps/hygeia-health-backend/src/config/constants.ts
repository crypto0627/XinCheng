export const COOKIE_OPTIONS = {
  path: '/',
  httpOnly: true,
  secure: true,
  sameSite: 'None' as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export const JWT_EXPIRY = 60 * 60 * 24 * 7; // 7 days in seconds

export const KV_EXPIRY = 300; // 5 minutes in seconds

export const WEB_AUTHN_CONFIG = {
  rpName: 'hygeia-health',
  timeout: 60000,
  authenticatorSelection: {
    residentKey: 'preferred',
    userVerification: 'preferred',
    authenticatorAttachment: 'platform',
  },
  attestation: 'direct',
  pubKeyCredParams: [
    { alg: -7, type: 'public-key' }, // ES256
    { alg: -257, type: 'public-key' }, // RS256
  ],
}; 