import mongoose from "mongoose";

const collection = 'messages';

const messagesSchema = new mongoose.Schema({
    user_name: {
        type: String,
        required: true
    },
    user_email: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    text: {
        type: String,
        required: true
    }
});

const messagesModel = mongoose.model(collection, messagesSchema);

export default messagesModel;