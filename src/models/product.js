import mongoose from "mongoose";

const collection = 'products';

const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    // description: {
    //     type: String,
    //     required: false,
    //     default: 'Alguna descripcion correcta del producto!'
    // },
    // code: {
    //     type: Number,
    //     required: true,
    //     unique: true
    // },
    // stock: {
    //     type: Number,
    //     required: true
    // }
});

const productsModel = mongoose.model(collection, productsSchema);

export default productsModel;