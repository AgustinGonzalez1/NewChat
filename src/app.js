import express from "express";
import { __dirname, PORT } from "./utils.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import chatRouter from "./routes/chatRouter.js";

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

const mensajes = [];

const generarId = () => {
	return mensajes.length + 1;
};

socketServer.on("connection", (socket) => {
	socket.on("newUser", (data) => {
		mensajes.push({
			id: generarId(),
			mensaje: `${data} se ha conectado`,
			nombre: "Servidor",
		});

		socket.on("message", (data1) => {
			mensajes.push({
				id: generarId(),
				mensaje: data1,
				nombre: data,
			});
			socketServer.emit("messageEmit", mensajes);
		});

		socketServer.emit("messageEmit", mensajes);
	});

	socketServer.emit("messageEmit", mensajes);
});
