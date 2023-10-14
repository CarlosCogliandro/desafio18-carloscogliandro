import { Router } from "express";
import passport from "passport";
import { createHash, validatePassword } from "../services/auth.js";
import jwt from "jsonwebtoken";
import { usersService } from "../dao/index.js";
import config from '../config/config.js';
import uploader from "../services/upload.js";
import userModel from "../models/User.js";

const router = Router();

router.post('/register', uploader.single('avatar'), async (req, res) => {
    const file = req.file;
    if (!file) return res.status(500).send({ status: 'error', error: 'Error al cargar el archivo' })
    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password) return res.status(400).send({ status: "error", error: "Valores incompletos" });
    const exists = await userModel.findOne({ email });
    if (exists) return res.status(400).send({ status: "error", error: "El usuario ya existe" });
    const hashedPassword = await createHash(password);
    const user = /*await usersService.save */ ({
        first_name,
        last_name,
        // age,
        email,
        // phone,
        // address,
        password: hashedPassword,
        avatar: `${req.protocol}://${req.hostname}:${process.env.PORT}/img/${file.filename}`
    })
    const result = await userModel.create(user);
    res.send({ status: "success", message: "Registrado" });
});

router.post('/login', passport.authenticate('login', { failureRedirect: '/sessions/loginFail', failureMessage: true }), async (req, res) => {
    const user = req.user;
    req.session.user = {
        id: user._id,
        email: user.email,
        role: user.role
    }
    res.send({ status: "success", message: "Logueado!" })
});

router.get('/loginFail', (req, res) => {
    console.log(req.session.messages);
    if (req.session.messages.length > 4) return res.status(400).send({ message: "BLOQUEA LOS INTENTOS AHORA!!!!!" })
    res.status(400).send({ status: "error", error: "Error de autenticación" })
});

router.get('/github', passport.authenticate('github'), (req, res) => { })

router.get('/githubcallback', passport.authenticate('github'), (req, res) => {
    const user = req.user;
    req.session.user = {
        id: user._id,
        email: user.email,
        role: user.role
    }
    res.send({ status: "success", message: "Logueado con github!" })
})

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }), async (req, res) => { });

router.get('/googlecallback', passport.authenticate('google'), (req, res) => {
    const user = req.user;
    req.session.user = {
        id: user._id,
        email: user.email,
        role: user.role
    }
    res.send({ status: "success", message: "Logueado con Google!" })
})


router.post('/logintoken', async (req, res) => {
    const { email, password } = req.body;
    const user = await usersService.getBy({ email });
    if (!user) return res.status(400).send({ status: "error", error: "Email inválido" });
    const isValidPassword = await validatePassword(password, user.password);
    if (!isValidPassword) return res.status(400).send({ status: "error", error: "Contraseña incorrecta" })
    const tokenizedUser = {
        name: `${user.first_name} ${user.last_name}`,
        role: user.role,
        id: user._id
    }
    const token = jwt.sign(tokenizedUser, config.jwt.SECRET, { expiresIn: "1d" });
    res.cookie(config.jwt.COOKIE, token).send({ status: "success", message: "logged in" })
});

router.get('/current', (req, res) => {
    const { token } = req.query;
    const user = jwt.verify(token, config.jwt.SECRET);
    console.log(user);
    res.send({ status: "success", payload: user });
});

export default router;


