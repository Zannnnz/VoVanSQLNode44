import express from "express"
import {login, loginFacebook, register,extendToken,loginAsyncKey} from "../controllers/auth.controller.js"

const authRouter = express.Router()
authRouter.post("/register",register);
authRouter.post("/login",login);
authRouter.post("/login-face",loginFacebook);
authRouter.post("/extend-token",extendToken);
authRouter.post("/login-async-key",loginAsyncKey);// login bang khoa bat doi xung

export default authRouter