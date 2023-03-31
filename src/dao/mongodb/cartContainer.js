import mongoose from "mongoose";
import ContenedorMongo from "./container.js";

const cartSchema = new mongoose.Schema({
    products: [{type: Object, required: true}]
});

export default class ContenedorCartsMongo extends ContenedorMongo {
    constructor() {
        super('carts', cartSchema);
    };

    async saveCart(cart) {
        let newCart = await this.collection.create(cart);
        return newCart;
    };

    async updateCart(id, newCart) {
        let updatedCart = await this.collection.updateOne({ _id: id}, newCart);
        return updatedCart;
    };

    async addToCart(cartId, product) {
        let cart = await this.collection.find({ _id: cartId });
        let addedProd = await this.collection.find({ _id: cartId }, { cart: cart.products.push(product) });
        return addedProd;
    };

    async deleteCartProduct(cart, product) {
        let prodIndex = cart.products.map(elem => elem.id).indexOf(product.id);
        cart.products.splice(prodIndex, 1);
        let updatedCart = await this.updateCart(cart.id, cart);
        return updatedCart;
    };

};