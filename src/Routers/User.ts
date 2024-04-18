import express from "express";
import { SignUp } from "../controllers/Users";

const appRouter = express.Router();

appRouter.post("/signup", SignUp);


export default appRouter;
