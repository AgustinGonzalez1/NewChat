import { Router } from "express";

const chatRouter = Router();

chatRouter.get("/", async (req, res) => {
	try {
		res.render("chat", { title: "Chat" });
	} catch (error) {
		console.log(error);
	}
});

export default chatRouter;
