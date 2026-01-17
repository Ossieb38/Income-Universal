import express from "express";
import { registerChatRoutes } from "./server/replit_integrations/chat/index.js";
import { registerImageRoutes } from "./server/replit_integrations/image/index.js";
import { registerAudioRoutes } from "./server/replit_integrations/audio/index.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: "50mb" }));

// Register integration routes
registerChatRoutes(app);
registerImageRoutes(app);
registerAudioRoutes(app);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
