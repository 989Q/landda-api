import express from "express";
import * as estate from "../controllers/estate";
import { upload } from "../middlewares/wasabi";
import { validateToken } from "../middlewares/validate";

const router = express.Router();

// post, push
router.post("/upload-multiple", upload.array("images", 3), estate.uploadImages);
router.post("/create", validateToken, estate.createEstate);
router.patch("/update/:estateId", validateToken, estate.updateEstate);
// get, search
router.get("/search", estate.searchEstate);
router.get("/get/:estateId", estate.getEstateById);
// delete
router.delete("/delete/:estateId", validateToken, estate.deleteEstate);

export default router;
