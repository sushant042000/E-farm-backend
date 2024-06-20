import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Category } from "../models/category.model.js";

const create = asyncHandler(async (req, res) => {
  if (!req?.body?.categoryName) {
    throw new ApiError(400, "category name and image is required.");
  }

  //upload image on cloudinary
  const imageLocalPath = req?.file?.path;
  let imageUrl = "";

  if (imageLocalPath) {
    const image = await uploadOnCloudinary(imageLocalPath);
    if (!image) {
      throw new ApiError(500, "failed to upload  image");
    }
    imageUrl = image.url;
  }

  const category = await Category.create({
    categoryName: req?.body?.categoryName,
    imageUri: imageUrl,
  });

  res.status(201).json(
    new ApiResponse(200,"Category created successfully",category)
  )
});

const updateCategory=asyncHandler(async(req,res)=>{
    const categoryId = req?.body?.categoryId;
    if (!categoryId) {
      throw new ApiError(400, "category Id is required");
    }
    const categoryName = req.body?.categoryName;

    //upload image on cloudinary
    const imageLocalPath = req?.file?.path;
    let imageUrl = req.body.imageUri;

    if (imageLocalPath) {
      const image = await uploadOnCloudinary(imageLocalPath);
      if (!image) {
        throw new ApiError(500, "failed to upload  image");
      }
      imageUrl = image.url;
    }

    const category = await Category.findByIdAndUpdate(categoryId, {
      categoryName,
      imageUri: imageUrl,
    },{
        new:true
    });

    res.status(200)
      .json(new ApiResponse(200, "Category updated successfully", category));
});

const deleteCategory=asyncHandler(async(req,res)=>{
    const categoryId = req?.body?.categoryId;
    if (!categoryId) {
      throw new ApiError(400, "category Id is required");
    }
    await Category.findByIdAndDelete(categoryId);

    res.status(200)
      .json(new ApiResponse(200, "Category deleted successfully", null));
});

const getAllCategories=asyncHandler(async(req,res)=>{

    const categories=await Category.find();

    res.status(200)
      .json(new ApiResponse(200, "", categories));
})

export { create , updateCategory , deleteCategory ,getAllCategories}
