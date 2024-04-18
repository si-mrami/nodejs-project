import { Request, Response } from "express";
import Userss from "../db/Users";
import crypto from "crypto";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// signup user
export const SignUp = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // check if user exists
    const user = await Userss.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ status: "ERROR", message: "User already exists!" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = new Userss({
      username,
      email,
      authentication: {
        password: hashPassword,
        slt: crypto.randomBytes(16).toString("hex").slice(0, 16),
        sessionToken: crypto.randomBytes(32).toString("hex").slice(0, 32),
      },
    });
    if (!newUser) {
      res.status(400).json({ status: "ERROR", message: "User not created!" });
    }
    await newUser.save();
    res
      .status(200)
      .json({ status: "OK", message: "User created successfully!" });
  } catch (error) {
    console.error("error in signup", error);
  }
};

// login user
export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await Userss.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ status: "ERROR", message: "User not found!" });
    }
    const checkPass = await bcrypt.compare(
      password,
      user.authentication.password
    );
    if (!checkPass) {
      return res
        .status(400)
        .json({ status: "ERROR", message: "Invalide password!" });
    }
    const token = jwt.sign({ _id: user._id }, "hsjhdjshdjshdsjhd");
    res
      .header("auth-token", token)
      .json({ status: "OK", message: "User Logged successfully!" });
  } catch (error) {
    console.error("error in login", error);
  }
};
