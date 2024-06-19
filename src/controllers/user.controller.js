import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens=async(userId)=>{
try {
  const user = await User.findById(userId);
  const access_token = await user.generateAccessToken();
  const refresh_token = await user.generateRefreshToken();

  user.refreshToken = refresh_token;
  await user.save({ validateBeforeSave: false });
  return { access_token, refresh_token };
} catch (error) {
  throw new ApiError(
    500,
    "Something went wrong while generating access and refresh tokens"
  );
}
}
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

const loginUser=asyncHandler(async (req, res)=>{
  const {userName,password}=req.body;

  if(!userName || !password){
    throw new ApiError(400,"Please provide username and password");
  }
  
  const user = await User.findOne({
    $or: [{ email: userName }, { phone_number: userName }],
  });

  if (!user) {
    throw new ApiError( 400, "User does not exitst");
  }

  const isPasswordCorrect=await user.isPasswordCorrect(password);
  if(!isPasswordCorrect){
    throw new ApiError( 401, "Invalid user credentials");
  }

  const { access_token, refresh_token }=await generateAccessAndRefreshTokens(user._id);
  const loggedInUser=await User.findById(user._id).select("-password -refreshToken");
  const options={
    httpOnly:true,
    secure:true
  }
  return res.status(200)
  .cookie("accessToken",access_token,options)
  .cookie("refreshToken",refresh_token,options)
  .json(
    new ApiResponse(200,"success",{
      loggedInUser,
      access_token,
      refresh_token
    })
  )
})


export { registerUser , loginUser };
