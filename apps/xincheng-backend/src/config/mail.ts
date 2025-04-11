import { Resend } from 'resend'

export const getResend = (apiKey: string) => new Resend(apiKey)
