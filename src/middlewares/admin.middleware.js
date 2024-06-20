import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const isAdmin = asyncHandler(async (req, res, next) => {
  const isRoleAdmin = req?.user?.role === "ADMIN";
  if (!isRoleAdmin) {
    throw new ApiError(401, "You dont have access to this route.");
  }
  next();
});

export {isAdmin}