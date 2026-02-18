import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { validationResult } from "express-validator";
import { findUserByNickname, createUser } from "../models/user.js";

dotenv.config();
const secretKey = process.env.SECRET_KEY;

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { nickname, password } = req.body;

    const existingUser = await findUserByNickname(nickname);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser(nickname, hashedPassword);

    res.status(201).json({
      success: true,
    });
  } catch (err) {
    console.error("Error inserting user: ", err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { nickname, password } = req.body;

  try {
    const user = await findUserByNickname(nickname);

    if (!user) {
      return res.status(401).send("Invalid nickname or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid nickname or password");
    }

    const token = jwt.sign({ userId: user.user_id }, secretKey, {
      expiresIn: "80h",
    });
    res.status(200).json({ token });
  } catch (err) {
    console.error("Error fetching user: ", err);
    res.status(500).send("Internal server error");
  }
};
