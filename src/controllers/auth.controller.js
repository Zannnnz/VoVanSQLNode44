import { createRefToken, createRefTokenAsyncKey, createToken, createTokenAsyncKey } from "../config/jwt.js";
import transporter from "../config/transporter.js";
import sequelize from "../models/connect.js";
import initModels from "../models/init-models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto"; // lib để tạo random code cho flow forgot password
import {PrismaClient} from '@prisma/client';
import speakeasy from 'speakeasy';// lib tạo secret key
import { use } from "chai";
const model = initModels(sequelize);
const prisma = new PrismaClient();
const register= async (req,res,next)=>{
    try{
        //B! : nhan du lieu
        const {fullName,email,pass}=req.body;
        console.log({fullName,email,pass});

        //B2: kiem tra email da ton tai trong db chua
        // neu ton tai: tra loi "tai khoan da ton tai"
        // neu chua ton tai: di tiep

        //email

        // const userExist = await model.users.findOne({
        //     where:{
        //         email:email
        //     }
        // })
        const userExist = await prisma.users.findFirst({
            where:{
                email: email,
            }
        })
        if(userExist){
            return res.status(400).json({message: "Tai khoan da ton tai",data:null,});
        }

        //B3 Them nguoi dung moi vao db

        // const userNew = await model.users.create({
        //     full_name:fullName,
        //     email:email,
        //     pass_word: bcrypt.hashSync(pass,10),
        // });
        // tạo secret cho login 2 lớp
        const secret = speakeasy.generateSecret({length:15})
        const userNew = await prisma.users.create({
            data:{
                full_name:fullName,
                email:email,
                pass_word:bcrypt.hashSync(pass,10),
                secret: secret.base32
            }
        })
        // cấu hình info mail
        const mailOption = {
            from: 'nguyenvovanio55@gmail.com',
            to: email,
            subject: "welcom to Our service",
            text: `Hello ${fullName}. Best Regards.`
        }
        // gửi mail
        transporter.sendMail(mailOption,(err,info)=>{
            if(err){
                return res.status(500).json({message:"Sending email error"});
            }
            return res.status(200).json({message:"Register success",data:userNew});
        })

       
    }catch(error){
        return res.status(500).json({message:"error"})
    }
};

const login = async (req,res) =>{
    try{
        //B1: lấy email và pass_word từ body request

        //B2: Check user thông qua email (get user từ db)

        //B2.1: Nếu không có user => ra error (user not found)

        //B2.2: Nếu có user => check tiếp pass_word

        //B2.2.1: Nếu password không trùng nhau => ra error password is wrong

        //B2.2.2: Nếu passsword trùng nhau => Tạo acces toke

        let {email,pass_word}=req.body;
        let user = await model.users.findOne({
            where:{
                email
            }
            
        })
        if(!user){
            return res.status(400).json({message:"email is worng"});
        }
        let CheckPass = bcrypt.compareSync(pass_word,user.pass_word);
        if(!CheckPass){
            return res.status(400).json({message:"Password is wrong"});
        }
        

        let payload = {
            userId: user.user_id
        }
        // Tạo token
        // Fuction sign cuả jwt
        // param 1: tạo payload và lưu vào token
        // param 2: key để tạo token
        // param 3: setting lifetime của token và thuật toán để tạo token
        let accesToken = createToken({userId: user.user_id})
        let refreshToken = createRefToken({userId: user.user_id})
        await model.users.update({
            refresh_token:refreshToken
        },{
            where:{user_id: user.user_id}
        });
        // luu refresh vao cookie
        res.cookie('refreshToken',refreshToken,{
            httpOnly:true, // Cookie khong the  truy cap tu javascript
            secure:false, // de chay duoi localhost
            sameSite:'Lax', // de dam bao cookie duoc gui trong cac domain khac nhau
            maxAge: 7 * 24 * 60 * 60 *1000
        })
        return res.status(200).json({message:"Login succesfully",data : accesToken});
      
    }catch(error){
        return res.status(500).json({message: "error"})
    }

    
}
const loginAsyncKey = async (req,res) =>{
    try{
        //B1: lấy email và pass_word từ body request

        //B2: Check user thông qua email (get user từ db)

        //B2.1: Nếu không có user => ra error (user not found)

        //B2.2: Nếu có user => check tiếp pass_word

        //B2.2.1: Nếu password không trùng nhau => ra error password is wrong

        //B2.2.2: Nếu passsword trùng nhau => Tạo acces toke

        let {email,pass_word,code}=req.body;
        let user = await model.users.findOne({
            where:{
                email
            }
            
        })
        console.log(user)
        if(!user){
            return res.status(400).json({message:"email is worng"});
        }
        let CheckPass = bcrypt.compareSync(pass_word,user.pass_word);
        if(!CheckPass){
            return res.status(400).json({message:"Password is wrong"});
        }
        // check code duoc nhap tu request
        const verified = speakeasy.totp.verify({
            secret: user.secret,
            encoding: 'base32',
            token:code
        })
        console.log("asdas", user.secret)
        if(!verified){
            return res.status(400).json({message:"Invalid 2FA"});
        }
    
        let payload = {
            userId: user.user_id
        }
        // Tạo token
        // Fuction sign cuả jwt
        // param 1: tạo payload và lưu vào token
        // param 2: key để tạo token
        // param 3: setting lifetime của token và thuật toán để tạo token
        let accesToken = createTokenAsyncKey({userId: user.user_id})
        let refreshToken = createRefTokenAsyncKey({userId: user.user_id})
        await model.users.update({
            refresh_token:refreshToken
        },{
            where:{user_id: user.user_id}
        });
        // luu refresh vao cookie
        res.cookie('refreshToken',refreshToken,{
            httpOnly:true, // Cookie khong the  truy cap tu javascript
            secure:false, // de chay duoi localhost
            sameSite:'Lax', // de dam bao cookie duoc gui trong cac domain khac nhau
            maxAge: 7 * 24 * 60 * 60 *1000
        })
        return res.status(200).json({message:"Login succesfully",data : accesToken});
      
    }catch(error){
        return res.status(500).json({message: "error"})
    }

    
}
const loginFacebook = async (req,res)=>{
    try{
    // B1: lấy id, email và name từ request
    // B2: check id (app_face_id trong db)
    // B2.1: Nếu có app_facd_id => tạo acees token => gửi về FE
    // B2.2: neeus khoong cos app_face_id => tao user moi => tạo acces token => gửi về FE
    let{id,email,name} = req.body;
    let user = await model.users.findOne({
        where: {face_app_id: id}
    })
    if(!user){
        let newUser = {
            full_name: name,
            face_app_id: id,
            email
        }
        user = await model.users.create(newUser);
    }
    let accesToken = createToken({userId: user.user_id});
    return res.status(200).json({message:"Login succesfully",data : accesToken});
    }catch(error){
        return res.status(500).json({message:"error"})
    }
}

const extendToken = async (req,res)=>{
    // Lấy refesh token từ cookie request
    const refreshToken= req.cookies.refreshToken;
    if(!refreshToken){
        return res.status(401)
    }
    const checkRefToken= await model.users.findOne({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!checkRefToken){
        return res.status(401)
    }
    //const newToken = createToken({userId:checkRefToken.user_id})
    const newToken = createTokenAsyncKey({userId: checkRefToken.user_id})
    return res.status(200).json({message:"Success",data:newToken})
}

const forgotPass = async (req,res)=>{
    try {
        //get email from body
        let {email} = req.body;
        // kiểm tra email có tồn tại trong db hay không
        let checkEmail = await model.users.findOne({
            where:{
                email
            }
        });
        if(!checkEmail){
            return res.status(400).json({message:"Email is wrong"});
        }

        // tạo code
        let randomCode = crypto.randomBytes(5).toString("hex");
        // tạo biến lưu expired code
        let expired = new Date(new Date().getTime() + 1 * 60 * 60 * 1000);
        // lưu code vào db
        await model.code.create({
            code: randomCode,
            expired
        })
        // send email
        const mailOption = {
            from: process.env.MAIL_USER,
            to: email,
            subject: "Mã xác thực",
            text: `Hệ thống gửi bạn mã code forgot password`,
            html: `<h1>Your code verify: ${randomCode}</h1>`

        }
        // gửi mail
        transporter.sendMail(mailOption,(err,info)=>{
            if(err){
                return res.status(500).json({message:"Sending email error"});
            }
            return res.status(200).json({message:"Please check your eamil"});
        })
    } catch (error) {
        return res.status(500).json({message:"Error API forgot password"});
    }
}
const changePassword  = async (req,res)=>{
    try {
        let{code,email,newPass} = req.body;
        // Kiểm tra code có tồn tại trong db không
        let checkCode = await model.code.findOne({
            where:{
                code
            }
        })
        if(!checkCode){
            return res.status(400).json({message:"Code is wrong"});
        }
        // check code có còn expire hay không
        // Kiểm tra email có tồn tại trong db hay không
        let checkEmail = await model.users.findOne({
            where:{
                email
            }
        });
        if(!checkEmail){
            return res.status(400).json({message:"Email is wrong"})
        }

        let hashNewPass= bcrypt.hashSync(newPass,10);
        checkEmail.pass_word = hashNewPass;
        checkEmail.save();

        //Remove code sau khi change password thành côn
        await model.code.destroy({
            where:{
                code
            }
        })
        return res.status(200).json({message:"Change password successfully"})
    } catch (error) {
        return res.status(500).json({message:"Error change API password"})
    }
}
export{
    register,
    login,
    loginFacebook,
    extendToken,
    loginAsyncKey,
    forgotPass,
    changePassword
};