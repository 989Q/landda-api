import express from "express";
import controller from "../controllers/RealEstate";
// import { Schemas, ValidateJoi } from '../middleware/Joi';

const router = express.Router();

router.post('/create', controller.createRealEstate);
router.get('/get/:estateId', controller.readRealEstate);
router.get('/get', controller.realAllRealEstate);
router.get('/search', controller.searchRealEstate);
// router.patch('/update/:realEstateId', controller.updateRealEstate);
// router.delete('/delete/:realEstateId', controller.deleteRealEstate);

export default router;
