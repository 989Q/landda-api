import express from "express";
import controller from "../controllers/estate";
import localStorage from "../controllers/localStorage";
import { upload } from "../middlewares/wasabi";
import { validateToken } from "../middlewares/validate";
// import { Schemas, ValidateJoi } from '../middleware/Joi';

const router = express.Router();

// post push delete
router.post("/upload-multiple", upload.array("images", 3), controller.uploadImages);
router.post("/create", validateToken, controller.createEstate);
router.patch("/update/:estateID", validateToken, controller.updateEstate);
router.delete("/delete/:estateID", validateToken, controller.deleteEstate);
// get
router.get("/search", controller.searchEstate);
router.get("/get/:estateID", controller.getEstateByID);
router.get("/limit-estates", localStorage.limitEstate);

export default router;
