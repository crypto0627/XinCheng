declare module '@simplewebauthn/server' {
  export interface Credential {
    id: string;
    publicKey: Uint8Array;
    counter: number;
    transports: undefined
  }

  export interface RegistrationInfo {
    fmt: string;
    aaguid: string;
    credential?: Credential
  }

  export interface VerifiedRegistrationResponse {
    verified: boolean;
    registrationInfo?: RegistrationInfo;
  }

  export function verifyRegistrationResponse(options: {
    response: any;
    expectedChallenge: string;
    expectedOrigin: string;
    expectedRPID: string;
    requireUserVerification: boolean;
  }): Promise<VerifiedRegistrationResponse>;
}

declare module '@simplewebauthn/server/helpers' {
  export const isoBase64URL: {
    [x: string]: any;
    fromBuffer(buffer: Uint8Array): string;
    toBuffer(base64url: string): Uint8Array;
  };
} 