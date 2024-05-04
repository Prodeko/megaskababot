import express from "express";
import { saveEntriesAsCSV } from "../entries";
import statisticsRouter from "./statistics/routes";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const port = Number.parseInt(process.env.PORT!);

const app = express();

// Necessary because of Azure App Service health check on startup
app.get("/", (_req, res) => {
	res.status(200).send("Kovaa tulee");
});

app.get("/health", (_req, res) => {
	res.status(200).send("OK");
});

app.get("/entries", async (req, res) => {
	if (req.query.pass !== process.env.ADMIN_PASSWORD) {
		console.log("Wrong password");
		return res.status(401).send("Wrong password!");
	}
	console.log("here");
	await saveEntriesAsCSV();
	res.attachment("./entries.csv");
	res.header("Content-Type", "text/csv");
	res.status(200).send(fs.readFileSync("./entries.csv"));
});

app.use("/statistics", statisticsRouter);

export const launchServer = async () => {
  app.listen(port, () => console.log("Running on port ", port));
}

export default app;