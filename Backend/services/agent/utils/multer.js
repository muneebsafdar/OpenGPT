
import fs from "fs"
import path from "path"
import multer from "multer"

const uploadDir = path.resolve("../temp");

if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir,{recursive:true});
}


console.log("hello")

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,uploadDir);
    },
    filename:(req,file,cb)=>{
        const uniqueSuffix = Date.now() + "-" + file.originalname;
       cb(null, uniqueSuffix); 
    },
});


const fileFilter=(req,file,cb)=>{
    if(file.mimetype=="application/pdf" || file.mimetype.startsWith("image/")){
        cb(null,true);
    }else{
        cb(null,false);
    }
}

const limits={
    fileSize:10*1024*1024
}

const upload = multer({ storage,fileFilter,limits:limits });

export default upload