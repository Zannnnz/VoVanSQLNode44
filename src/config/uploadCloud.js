import multer from "multer";
import {v2 as cloudinary} from "cloudinary";
import {CloudinaryStorage} from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
import { QueryInterface } from "sequelize";

dotenv.config();

// cấu hình cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
    
});

//cấu hình cho multer lưu trữ file vào cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder: "avatar",// define folder trên cloudinary
        format: async(req,file)=>{
            // định nghĩa những file image cho phép
            const validImgFormat = ['png','jpeg','gif','heic','webp'];

            //lấy định dạng file hình từ file
            const fileFormat = file.mimetype.split('/')[1];

            //Kiểm tra định dạng file có hợp lệ không
            if(validImgFormat.includes(fileFormat)){
                return fileFormat
            }
            return '.png'
        },
        transformation:[{
            with:800,//giới hạn chiều rộng ảnh
            quality: 'auto:good',// chất lượng tự động tốt
            fetch_format: 'auto'// tự dộng chọn định dạng tốt nhất (webp,png,..)
        }
    ],
        public_id:(req,file)=>file.originalname.split(".")[0],
    }
})
// khởi tạo multer với cloudinary storage

export const uploadCloud = multer({storage});