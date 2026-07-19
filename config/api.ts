export const AKARI_API_BASE_URL =
  process.env.NEXT_PUBLIC_AKARI_API_BASE_URL ??
  (process.env.NODE_ENV === 'development' ? 'http://localhost:8788' : 'https://akari-api.yuru-yuri.com')

export const CONTACT_CHANNELS_URL = `${AKARI_API_BASE_URL}/website/v1/contact-channels`
