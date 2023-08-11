import express from "express";
import controller from "../controllers/estate";
// import { Schemas, ValidateJoi } from '../middleware/Joi';
import { upload } from "../middlewares/wasabi";

const router = express.Router();

router.post('/upload-multiple', upload.array("images", 3), controller.uploadImages);

router.post('/create', controller.createEstate);
router.get('/get', controller.getAllEstate);
router.get('/get/:estateID', controller.getEstateByID);
router.get('/search', controller.searchEstate);
// router.patch('/update/:realestateID', controller.updateRealEstate);
// router.delete('/delete/:realestateID', controller.deleteRealEstate);

export default router;
