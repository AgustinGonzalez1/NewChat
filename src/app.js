import express from "express";
import { __dirname, PORT } from "./utils.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import chatRouter from "./routes/chatRouter.js";
import mongoose from "mongoose";
import { messageModel } from "./models/messages.model.js";

const app = express();

const httpServer = app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});

const socketServer = new Server(httpServer);

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/", chatRouter);

mongoose.connect("mongodb+srv://Agusdev:*****@cluster0.7utl1xo.mongodb.net/databaseprueba?retryWrites=true&w=majority");

socketServer.on("connection", async (socket) => {
	socket.on("newUser", async (data) => {
		const newMessage = new messageModel({ mensaje: `${data} se ha conectado`, nombre: `servidor` });

		await messageModel.create(newMessage);

		const mensajes = await messageModel.find();

		socketServer.emit("messageEmit", mensajes);

		socket.on("message", async (data1) => {
			const newMessage = new messageModel({
				mensaje: data1,
				nombre: data,
			});

			await messageModel.create(newMessage);

			const mensajes = await messageModel.find();

			socketServer.emit("messageEmit", mensajes);
		});
	});

	const mensajes = await messageModel.find();

	socketServer.emit("messageEmit", mensajes);
});
