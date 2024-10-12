import express from "express"
import {
    login,
    loginFacebook,
    register,
    extendToken,
    loginAsyncKey,
    forgotPass,
    changePassword
}from "../controllers/auth.controller.js"

const authRouter = express.Router()
authRouter.post("/register",register);
authRouter.post("/login",login);
authRouter.post("/login-face",loginFacebook);
authRouter.post("/extend-token",extendToken);
authRouter.post("/login-async-key",loginAsyncKey);// login bang khoa bat doi xung
authRouter.post("/forgot-password",forgotPass);//APi quên mật khẩu; GỬi code qua mail
authRouter.post("/change-password",changePassword) // API change password
export default authRouter