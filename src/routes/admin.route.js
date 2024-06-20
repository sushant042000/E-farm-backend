import { Router } from "express";
import { create, deleteCategory, getAllCategories, updateCategory } from "../controllers/category.controller.js";
import { veriefyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router=Router();

router.route("/category/create").post(veriefyJWT,isAdmin,upload.single("image"), create);

router.route("/category/update").put(veriefyJWT,isAdmin,upload.single("image"), updateCategory);

router.route("/category/delete").delete(veriefyJWT,isAdmin, deleteCategory);

router.route("/category/all").get(veriefyJWT, getAllCategories);




export default router;
