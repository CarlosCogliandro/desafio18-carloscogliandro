import dotenv from 'dotenv';

dotenv.config();

// const mode = process.argv.slice(2)[0]

// dotenv.config({
//     path: mode === "PRODUCTION" ? './.env.production' : './.env.development'
// });

// console.log(process.env);

export default {
    app: {
        PORT: process.env.PORT || 8080
    },
    mongo: {
        URL: process.env.MONGO_URL
    },
    jwt: {
        SECRET: process.env.JWT_SECRET,
        COOKIE: process.env.JWT_COOKIE
    },
    session: {
        SECRET2: process.env.SESSION_SECRET,

    },
    passport: {
        PASSPORT_SECRET: process.env.PASSPORT_SECRET,
        GOOGLE_SECRET: process.env.GOOGLE_SECRET
    },
    email: {
        ADMIN_EMAIL: process.env.ADMIN_EMAIL
    },
    nodemailer: {
        GMAIL_USER: process.env.GMAIL_USER,
        GMAIL_PWD: process.env.GMAIL_PWD
    }
}