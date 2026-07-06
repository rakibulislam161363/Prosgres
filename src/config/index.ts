import dotenv from "dotenv"
import path from "path"

dotenv.config({path: path.join(process.cwd(),".env")})

export default {
    port: process.env.PORT,
    databaseUrl: process.env.DATABASE_URL,
    appUrl: process.env.APP_URL,
    bycryptSaltRounds: process.env.BCRYPT_SALT_ROUNDS,
    jwtSecret: process.env.JWT_SCRETE!,
    jwtExpiration: process.env.JWT_EXPIRATION!,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
    jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION!,
    stripe_product_price_id : process.env.STRIPE_PRODUCT_PRICE_ID!,
    stripe_secret_key : process.env.STRIPE_SECRET_KEY!,
    stripe_webhook_secret : process.env.STRIPE_WEBHOOK_SECRET!
}