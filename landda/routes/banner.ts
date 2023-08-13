import express from "express";
import controller from "../controllers/banner";
// import { Schemas, ValidateJoi } from '../middleware/Joi';

const router = express.Router();

router.post('/create', controller.createBanner);
router.get('/get', controller.getAllBanner);
router.get('/get/:bannerID', controller.getBannerByID);
// router.get('/search', controller.searchEstate);

export default router;
