
import bcrypt from 'bcrypt';

//Comprobar si el usuario YA está loggeado.
export const isLogged = (req, res, next) => {
    req.session.nombre ? next() : res.redirect('/')
};

export const createHash = async (password) => {
    const salts = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salts)
}
export const validatePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
}
