import passport from 'passport';
import local from 'passport-local';
import { usersService } from '../dao/index.js';
import { validatePassword } from '../services/auth.js';
import GitHubStrategy from 'passport-github2';
import GoogleStrategy from 'passport-google-oidc';
import config from './config.js';
import mailing from '../email/mailing.js';

const LocalStrategy = local.Strategy;

const initializeStrategies = () => {
    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        if (!email || !password) return done(null, false, { message: "Valores incompletos" })
        const user = await usersService.getBy({ email });
        if (!user) return done(null, false, { message: "Credenciales inválidas" })
        const isValidPassword = await validatePassword(password, user.password);
        if (!isValidPassword) return done(null, false, { message: "Contraseña inválida" })
        return done(null, user)
    }))

    passport.use('github', new GitHubStrategy({
        clientID: "Iv1.bcc2d73aec10ea6e",
        clientSecret: config.passport.PASSPORT_SECRET,
        callbackURL: "http://localhost:8080/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            const { name, email } = profile._json;
            const user = await usersService.getBy({ email });
            if (!user) {
                const newUser = {
                    first_name: name,
                    email,
                    password: '',
                }
                const result = await usersService.save(newUser);
                return done(null, result);
            }
            done(null, user);
        } catch (error) {
            done(error);
        }
    }));

    passport.use('google', new GoogleStrategy({
        clientID: '483438623181-crhf92lii9if07322tpkd858pk22mo0o.apps.googleusercontent.com',
        clientSecret: config.passport.GOOGLE_SECRET,
        callbackURL: 'http://localhost:8080/sessions/googlecallback',
    }, async (issuer, profile, done) => {
        const firstName = profile.name.givenName;
        const lastName = profile.name.familyName;
        const email = profile.emails[0].value;
        const user = await usersService.getBy({ email });
        if (!user) { // Si no existe, lo registro
            const newUser = {
                first_name: firstName,
                last_name: lastName,
                email,
                password: '',
            }
            let result = await usersService.save(newUser);
            return done(null, result);
        }
        else {
            return done(null, user)
        }
    }));

    passport.use("signup", new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            const User = await usersService.getBy({ email });
            if (User) {
                console.log("User already exists");
                return done(null, false);
            }
            const { name, address, age, phone, avatar } = req.body;
            const newUser = {
                email,
                password: password,
                first_name: name,
                address,
                age,
                phone,
                avatar,
            };

            const result = await usersService.save(newUser);
            console.log(`${email} Registration succesful with ID ${result.id}`);
            mailing.sendEmail(config.email.ADMIN_EMAIL, "Nuevo Registro", mailing.registerTable(newUser));

        } catch (error) {
            console.log(`Error passport.js signup, ${error}`);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done) => {
        const result = await usersService.getBy({ _id: id })
        done(null, result);
    })
};

export default initializeStrategies;