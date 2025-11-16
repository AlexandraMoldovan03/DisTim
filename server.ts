import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { checkJwt } from "./middleware/checkJwt.js";
import { checkAdmin } from "./middleware/checkAdmin.js";
import adminRoutes from "./src/routes/admin.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Protect admin routes
app.use("/api/admin", checkJwt, checkAdmin, adminRoutes);

app.listen(8080, () => console.log("Server running on port 8080"));
