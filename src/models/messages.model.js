import mongoose from "mongoose";

const messagesCollection = "messages";

const messageSchema = new mongoose.Schema({
	nombre: String,
	mensaje: String,
});

export const messageModel = mongoose.model(messagesCollection, messageSchema);
