import { createToken } from "../config/jwt.js";
import transporter from "../config/transporter.js";
import sequelize from "../models/connect.js";
import initModels from "../models/init-models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const model = initModels(sequelize);

const register= async (req,res,next)=>{
    try{
        //B! : nhan du lieu
        const {fullName,email,pass}=req.body;
        console.log({fullName,email,pass});

        //B2: kiem tra email da ton tai trong db chua
        // neu ton tai: tra loi "tai khoan da ton tai"
        // neu chua ton tai: di tiep

        //email

        const userExist = await model.users.findOne({
            where:{
                email:email
            }
        })
        console.log({userExist});
        if(userExist){
            return res.status(400).json({message: "Tai khoan da ton tai",data:null,});
        }

        //B3 Them nguoi dung moi vao db

        const userNew = await model.users.create({
            full_name:fullName,
            email:email,
            pass_word: bcrypt.hashSync(pass,10),
        });
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
            return res.status(200).json({message:"dang ky thanh cong",data:userNew});
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
        console.log(user)
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
export{register,login,loginFacebook};