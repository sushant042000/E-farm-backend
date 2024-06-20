import { Router } from "express";
import { loginUser, logoutUser, registerUser, updateProfile } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { veriefyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);

router.route("/login").post(loginUser);

router.route("/logout").get(veriefyJWT,logoutUser);

router.route("/profile/update").post( veriefyJWT , upload.single("avatar") , updateProfile);


export default router;
