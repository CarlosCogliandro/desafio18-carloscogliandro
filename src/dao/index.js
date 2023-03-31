import mongoose from "mongoose";
import config from '../config/config.js';

const persistence = "MONGO";

export let usersService;
export let productsService;
// export let cartService;
// export let messagesService;

switch (persistence) {
    case 'MONGO':
        mongoose.set('strictQuery', false)
        const connection = mongoose.connect(config.mongo.URL);
        const { default: mongoUser } = await import('./mongodb/UsersContainer.js');
        // const { default: mongoProducts } = await import('./mongodb/productsContainer.js');
        // const { default: mongoCart } = await import('./mongodb/cartContainer.js')
        // const { default: mongoMessages } = await import('./mongodb/MessagesContainer.js');
        usersService = new mongoUser();
        // productsService = new mongoProducts();
        // cartService = new mongoCart();
        // messagesService = new mongoMessages();
        break;

    case 'FILESYSTEM':
        const { default: FSUser } = await import('./filesystem/UsersContainer.js');
        const { default: FSProducts } = await import('./filesystem/productsContainer.js');
        // const { default: FSCart } = await import ('./filesystem/cartContainer.js')
        usersService = new FSUser();
        productsService = new FSProducts();
        // cartService = new FSCart();
        break;
};

