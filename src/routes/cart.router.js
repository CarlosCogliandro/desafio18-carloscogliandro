
import Router from 'express';
import path from 'path';
import CartContainer from '../dao/filesystem/cartContainer.js';
import __dirname from '../utils.js'

const router = new Router();

const productos = new CartContainer(path.join(__dirname, "../data/cart.json"));

router.get('/', async (req, res) => {
    let cartsArr = await APIcarts.getAll();
    (cartsArr) ? res.json({carts: cartsArr}) : res.json({error: "El carrito esta vacio, Crear uno"})
});

router.get('/:id', async (req, res) => {
    let cart = await APIcarts.getById(req.params.id);
    cart ? res.json({cart: cart}) : res.json({error: "No se encuentra el ID"});
});

router.post('/', async (req, res) => {
    try {
        let newCart = await APIcarts.saveCart(req.body);
        res.json({
            new_cart: newCart
        });
    } catch (error) {
        console.log(error);
    }
});

router.delete('/:id', async (req, res) => {
    let cart = await APIcarts.getById(req.params.id);
    try {
        let deleted = await APIcarts.deleteById(Number(req.params.id));
        res.json({
            deleted_cart: cart,
        });
    } catch (error) {
        console.error('Eliminacion fallida');
        console.error(error);
    }
});

router.get('/:id/productos', async (req, res) => {
    let cart = await APIcarts.getById(req.params.id);
    if (cart) res.json({ cart_id: cart.id, cart_products: cart.products })
    else throw new Error("No se encuentra el ID");
});

router.post('/:id/productos', async (req, res) => {
    let cart = await APIcarts.getById(req.params.id);
    try {
        let productToAdd = await APIproducts.getById(req.body.id);
        cart.products.push(productToAdd);
        let response = await APIcarts.updateCart(req.params.id , cart);
        res.json({
            new_cart: cart,
            response
        });
    } catch (error) {
        console.log(error);
    }
});

router.delete('/:id/productos/:id_product', async (req, res) => {
    let cart = await APIcarts.getById(req.params.id);
    let product = await APIproducts.getById(req.params.id_product);
    if (cart && product) {
        let response = await APIcarts.deleteCartProduct(cart, product);
        res.json({
            newCart: cart,
            response
        });
    } else {
        throw new Error('No existe carrito o producto');
    };
});

export default router;
