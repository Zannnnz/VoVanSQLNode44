import pool from "../../db.js";
import { OK,INTERNAL_SERVER } from '../../const.js';
import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import { Op } from "sequelize";
import { PrismaClient } from "@prisma/client";
const model = initModels(sequelize);
const prisma = new PrismaClient();
const createUser  = async (req,res)=>{
    // let params = req.params;
    // let {id,hoTen} = params;
    // let body = req.body;
    // res.send({
    //     id,
    //     hoTen
    // });
    //lay data tu body cua request
    try{
        const{full_name,email,pass_word}= req.body;
    //     let newUser = await model.users.create(
    //     {
    //         full_name,
    //         email,
    //         pass_word
    //     }
    // )
    let newUser = await prisma.users.create({
        data:{
            full_name,
            email,
            pass_word
        }
    })
    res.status(201).json(newUser);
    }catch(error)
    {
        res.status(INTERNAL_SERVER).json({message:"error"});
    }
    
}

const getUsers =async (req,res) =>{
    try{
        // const[data] = await pool.query("SELECT * FROM users");
        // res.status(OK).json(data)
        let {full_name = ""} = req.query;
        let data = await model.users.findAll({
            where:{
                full_name:{
                [Op.like]: `%${full_name}%`
                }
            },
            // include:[
            //     {
            //         model:model.video,// chon model ma muon ket bang
            //         as: 'videos',
            //         attributes: ['video_name','user_id'],// chi dinh nhung column nao se hien thi
            //         required:true, // default la left join, required la inner join
            //         include:[
            //             {
            //                 model: model.video_comment,
            //                 as: 'video_comments'
            //             }
            //         ]
            //     }
            // ]
        });
        return res.status(OK).json(data);
    }catch(error){
        return res.status(INTERNAL_SERVER).json({message: "error"});
    }
}

const deleteUser = async(req,res) =>{
    try{
        let {user_id} = req.params
        // const [data] = await pool.query(`
        //    DELETE FROM users
        //    WHERE user_id= ${user_id} 
        // `);
        // let user = await model.users.findByPk(user_id);
        let user = await prisma.users.findFirst({
            where:{
                user_id: Number(user_id)
            }
        })
        if (!user){
           return  res.status(404).json({message:"user not found"})
        }
        // user.destroy();
        await prisma.users.delete({
            where:{
                user_id:Number(user_id)
            }
        })
        return res.status(200).json({message: "User deleted succesfully!"});
    }catch (error){
        return res.status(INTERNAL_SERVER).json({message:"error"});
    }
}

const updateUser = async (req,res) =>{
    try{
        const {user_id} = req.params;
        const {full_name,pass_word}= req.body;
        //check user co ton tai trong database khong

        // let user = await model.users.findByPk(user_id);
        let user = await prisma.users.findFirst({
            where:{
                user_id: Number(user_id)
            }
        })
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        // let data = await model.users.update(
        //     {full_name,pass_word},
        //     {
        //         where:{user_id}
        //     }
        // )
        await prisma.users.update({
            data:{full_name,pass_word},
            where:{
                user_id: Number(user_id)
            }
        })
        // cach 2:
        // user.full_name = full_name || user.full_name;
        // user.pass_word= pass_word || user.pass_word;
        // await user.save();
        // *Prisma không support update trực tiếp
        return res.status(OK).json({message: "update user succesfully"});
    }catch (error){
        console.log(error)
        return res.status(INTERNAL_SERVER).json({message: "error"})
    }
}
const uploadAvatar = async (req,res) =>{
    try {
        let file = req.file;
        let userId = req.body.userId;
        let user = await prisma.users.findFirst({
            where:{user_id: Number(userId)}
        })
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        // update column avatar trong table users
        let avatarPath = `/public/imgs/${file.filename}`
        await prisma.users.update({
            data:{
                avatar: avatarPath
            },
            where:{
                user_id: Number(userId)
            }
        })
        return res.status(200).json({
            data:avatarPath,
            message:"Upload avatar successfully"
        });
    } catch (error) {
        return res.status(500).json({message:"error api upload avatar"});
        
    }
    
}
export {
    createUser,
    getUsers,
    deleteUser,
    updateUser,
    uploadAvatar
}