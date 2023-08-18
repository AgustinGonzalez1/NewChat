const socket = io();
const $inputMessage = document.querySelector("#message");
const $listaMensajes = document.querySelector("#listMessages");
const $btnEnviar = document.querySelector("#btnEnviar");

Swal.fire({
	title: "Bienvenido al chat",
	input: "text",
	inputLabel: "Ingrese su nombre",
	inputPlaceholder: "Ingrese su nombre",
	confirmButtonText: "Ingresar",
	allowOutsideClick: false,
	allowEscapeKey: false,
	stopKeydownPropagation: false,
}).then((result) => {
	if (result.isConfirmed) {
		socket.emit("newUser", result.value);
	}
});

const enviarMensaje = (e) => {
	e.preventDefault();
	const mensaje = $inputMessage.value;

	mensaje.trim();
	$inputMessage.value = "";

	if (!mensaje) return;

	socket.emit("message", mensaje);
};

$btnEnviar.addEventListener("click", enviarMensaje);

socket.on("messageEmit", async (data) => {
	$listaMensajes.innerHTML = "";

	const mensajes = await data.slice(-10);

	await mensajes.forEach((element) => {
		$listaMensajes.innerHTML += `<p>${element.nombre}: ${element.mensaje}</p>`;
	});
});
