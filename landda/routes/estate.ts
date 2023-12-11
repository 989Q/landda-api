import express from "express";
import * as estate from "../controllers/estate";
import { upload } from "../middlewares/wasabi";
import { validateToken } from "../middlewares/accessToken";
import { limitParams } from "../middlewares/checkRequest";

const router = express.Router();

// post, push
router.post("/upload-multiple", upload.array("images", 3), estate.uploadImages);
router.post("/create", validateToken, estate.createEstate);
router.patch("/update/:estateId", validateToken, limitParams("estateId", 20), estate.updateEstate);
// get, search
router.get("/popular-provinces-th", estate.getPopularProvincesTH);
router.get("/search", estate.searchEstate);
router.get("/get/:estateId", limitParams("estateId", 20), estate.getEstateById);
// delete
router.delete("/delete/:estateId", limitParams("estateId", 20), validateToken, estate.deleteEstate);

export default router;
