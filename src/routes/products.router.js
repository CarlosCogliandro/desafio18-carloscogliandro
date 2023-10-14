
import Router from 'express';
import __dirname from '../utils.js';
import { productsService } from '../dao/index.js';

const router = new Router();

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
