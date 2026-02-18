import express from "express";
import { login, register } from "../controllers/authController.js";
import { userLoginValidation, userRegistrationValidation } from "../validators/authValidators.js";

const router = express.Router();

router.post("/register", userRegistrationValidation, register);
router.post("/login", userLoginValidation, login);

export default router;
