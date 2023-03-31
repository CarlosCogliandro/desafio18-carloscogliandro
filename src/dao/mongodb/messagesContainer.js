import ContenedorMongo from "./Container.js";
import messagesModel from '../../models/message.js';

export default class ContenedorMessagesMongo extends ContenedorMongo {
    async save(msg) {
        try {
            await messagesModel.create(msg);
            const message = await messagesModel.find(msg);
            return message
        } catch (error) {
            return console.log(error);
        }
    }
    async getAll() {
        try {
            return await messagesModel.find({});
        } catch (error) {
            return error;
        }
    }
};
