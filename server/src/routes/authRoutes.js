import express from "express";
import { login, logout, register } from "../controllers/authController.js";

const router = express.Router();

router.post("/auth/login", login);
router.post("/auth/logout", logout);
router.post("/auth/register", register);

export default router;
