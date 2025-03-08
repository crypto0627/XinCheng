// eslint-disable-next-line import/no-extraneous-dependencies
import { Resend } from 'resend'

export const getResend = (apiKey: string) => new Resend(apiKey)
