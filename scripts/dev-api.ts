import "dotenv/config";
import express from "express";
import siteDetailsHandler from "../api/site-details";

const app = express();
app.use(express.json({ limit: "2mb" }));

app.all("/api/site-details", (req, res) => siteDetailsHandler(req, res));

const port = Number(process.env.API_PORT || 3001);
app.listen(port, () => {
  console.log(`[dev-api] listening on http://localhost:${port}`);
});

