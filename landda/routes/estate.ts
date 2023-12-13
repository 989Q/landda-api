import express from "express";
import * as createEstate from "../controllers/estate/create";
import * as searchEstate from "../controllers/estate/search";
import { upload } from "../middlewares/wasabi";
import { validateToken } from "../middlewares/accessToken";
import { limitParams } from "../middlewares/checkRequest";

const router = express.Router();

// post, push
router.post("/upload-multiple", upload.array("images", 3), createEstate.uploadImages);
router.post("/create", validateToken, createEstate.createEstate);
router.patch("/update/:estateId", validateToken, limitParams("estateId", 20), createEstate.updateEstate);
// delete
router.delete("/delete/:estateId", limitParams("estateId", 20), validateToken, createEstate.deleteEstate);
// get, search
router.get("/popular-categories-th", searchEstate.getPopularCategoriesTH);
router.get("/popular-provinces-th", searchEstate.getPopularProvincesTH);
router.get("/search", searchEstate.searchEstate);
router.get("/get/:estateId", limitParams("estateId", 20), searchEstate.getEstateById);

export default router;
