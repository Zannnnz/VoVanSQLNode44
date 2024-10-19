import multer,{diskStorage} from "multer";
//process.cwd():tra ve duong dan root cua project
export const upload= multer({
    storage: diskStorage({
        destination:process.cwd()+"/public/imgs",
        filename:(req,file,callback)=>{
            //timestamp_img_name
            let newName = new Date().getTime()+ '_' + file.originalname;
            callback(null, newName);
        }
    })
})