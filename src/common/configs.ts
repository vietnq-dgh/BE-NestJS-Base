require('dotenv').config()
export const emailsConfig = {
  domain: process.env.SMTP_EMAIL_DOMAIN,
  user: process.env.SMTP_EMAIL_USER,
  password: process.env.SMTP_EMAIL_PASSWORD,
  port: process.env.SMTP_EMAIL_PORT,
}

export const ENVs = {
  FEE_PER_DAY: 0.001,
}

export const SOCKET_EVENTs = {
  UPDATE_TODAY_EARN: 'SOC:_UPDATE_TODAY_EARN',
}
