import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRETE,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("file uploaded on cloudinary", response.url);
    return response;
  } catch (error) {
    //remove the tempory saved local file as upload operation is failed.
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export {uploadOnCloudinary}