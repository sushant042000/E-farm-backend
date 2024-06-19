import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (localFilePath) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRETE,
    });

    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    return response;

  } catch (error) {
    console.log("Error while upload to cloudinary", error);
    return null;
    
  } finally {
    //remove the tempory saved local file as upload operation is failed.
    fs.unlinkSync(localFilePath);
  }
};

export { uploadOnCloudinary };
