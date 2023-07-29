import express from "express";
import controller from "../controllers/RealEstate";
// import { Schemas, ValidateJoi } from '../middleware/Joi';
import { upload } from "../middlewares/wasabi";

const router = express.Router();

router.post('/upload-multiple', upload.array("images", 3), controller.uploadImages);

router.post('/create', controller.createRealEstate);
router.get('/get/:estateID', controller.readRealEstate);
router.get('/get', controller.realAllRealEstate);
router.get('/search', controller.searchRealEstate);
// router.patch('/update/:realestateID', controller.updateRealEstate);
// router.delete('/delete/:realestateID', controller.deleteRealEstate);

export default router;
