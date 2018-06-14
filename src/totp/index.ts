import authenticator from 'otplib/authenticator'
import crypto from 'crypto'
authenticator.options = { crypto, window: 6 }

export { authenticator }
