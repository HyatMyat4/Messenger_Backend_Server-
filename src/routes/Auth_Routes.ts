import express from "express";
const router = express.Router();

import { Register, Log_in, logout } from "../controller/Register_Controller";

import { loginLimiter } from "../middleware/Login_Limiter";

router.post("/", Register);

router.route("/Login").post(loginLimiter, Log_in);

router.route("/Logout").post(logout);

export default router;
