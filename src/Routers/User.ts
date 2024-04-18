import express from "express";
import { Login, SignUp } from "../controllers/Users";

const appRouter = express.Router();

// register user
appRouter.post("/signup", SignUp);

// login user
appRouter.post("/signin", Login);

export default appRouter;
