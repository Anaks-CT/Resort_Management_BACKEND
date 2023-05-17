import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from 'multer';

interface Params {
    folder: string;
  }

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret 
});
const cloudstorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "project2",
    } as Params,
  });
  const upload = multer({ storage: cloudstorage,   fileFilter:(req: any,file: any,callback: any)=>{//image validation for files other than required format,can avoid this  field if validain is not required
    if(file.mimetype=='image/jpeg'||file.mimetype=='image/jpg'||file.mimetype=='image/png'||file.mimetype=='image/gif'||file.mimetype=='image/avif'){
        callback(null,true)
      }
      else{
        callback(null,false)
      }
    }});

 
    export default upload;
