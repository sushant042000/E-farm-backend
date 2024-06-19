import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, surname, password, email, role, phone_number } = req.body;

  //validation
  if (!name || !surname || !password || !email || !role || !phone_number) {
    throw new ApiError(400, "All fields are required.{ name, surname, password, email, role, phone_number }");
  }

  //check for existing user
  const existingUser = await User.findOne({ $or: [{ email }, { name }] });
  if (existingUser) {
    throw new ApiError(400, `user already exist with email ${email}`);
  }

  //upload image on cloudinary
  const avatarlocalPath = req?.file?.path;
  let avatarUrl = "";

  if (avatarlocalPath) {
    const avatar = await uploadOnCloudinary(avatarlocalPath);
    if (!avatar) {
      throw new ApiError(500, "failed to upload profile image");
    }
    avatarUrl = avatar.url;
  }

  const user = await User.create({
    name,
    surname,
    password,
    email,
    role,
    phone_number,
    avatar: avatarUrl,
    address: req.body?.address,
  });

  //check user creation is success or not
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  ); //here select is used to remove field

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating new user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, "User registered successfully", createdUser));
});


export { registerUser };
