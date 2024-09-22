import sequelize from "../models/connect.js";
import initModels from "../models/init-models.js";

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
            pass_word:pass
        });
        return res.status(200).json({message:"dang ky thanh cong",data:userNew})
    }catch(error){
        return res.status(500).json({message:"error"})
    }
};

export{register};