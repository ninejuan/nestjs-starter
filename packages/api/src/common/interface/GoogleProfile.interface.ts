export interface GoogleProfile {
  family_name: string
  name: string
  picture: string
  email: string
  given_name: string
  id: string
  verified_email: boolean
  _json: {
    sub: string
    email: string
    email_verified: boolean
    name: string
    given_name: string
    family_name: string
    picture: string
    locale: string
  }
}
