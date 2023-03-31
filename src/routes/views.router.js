
import { json, Router } from "express";
import { productsService } from "../dao/index.js";

const router = Router();

// ------------------------------------------------

router.get('/productos', async (req, res) => {
    const prod = productsService.getAll();
    res.render('productos', { prod })
});

router.post('/productos', async (req, res) => {
    let prod = req.body
    await productsService.save(prod)
    res.redirect('/home')
});

// ------------------------------------------------

router.get('/', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/home', async (req, res) => {
    res.render('home', { user: req.session.user });
});

router.get('/chat', async (req, res, next) => {
    res.render('chat', {})
});

router.get('/logout', (req, res) => {
    res.render('logout', { user: req.session.user });
    req.session.destroy();
    console.log('Sesion finalizada');
});



router.get('/info', (req, res) => {
    res.json ({
       server: {
          name: process.title, 
          nodeVersion: process.version,
          pid: process.pid, 
          uptime: process.uptime(), 
          memoryUsage: process.memoryUsage(), 
          platform: process.platform, 
          architecture: process.arch
       }
    })
});

export default router;