
import Router from 'express';
// import path from 'path';
// import Container from '../dao/filesystem/container.js';
import __dirname from '../utils.js';
import { productsService } from '../dao/index.js';

const router = new Router();

// const productos = new Container(path.join(__dirname, "../data/productos.json"));
// const productos = new Container("../data/productos.json");

router.get('/productos', async (req, res) => {
    const prod = await productsService.getAll();
    res.render('productos', { prod })
});

router.post('/productos', async (req, res) => {
    let prod = req.body
    await productsService.save(prod)
    res.redirect('/home')
});

export default router;
