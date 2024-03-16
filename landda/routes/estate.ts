import express from 'express';
import * as createEstate from '../controllers/estate/create';
import * as searchEstate from '../controllers/estate/search';
import { upload } from '../configs/wasabi';
import { validateToken } from '../middlewares/accesstoken';
import { limitParams } from '../middlewares/validate_request';

const router = express.Router();

router
  // post
  .post('/upload-multiple', upload.array('images', 3), createEstate.uploadImages)
  .post('/create', validateToken, createEstate.createEstate)
  // push
  .patch('/update/:estateId', validateToken, limitParams('estateId', 20), createEstate.updateEstate)
  // delete
  .delete('/delete/:estateId', limitParams('estateId', 20), validateToken, createEstate.deleteEstate)
  // get, search
  .get('/popular-categories-th', searchEstate.getPopularCategoriesTH)
  .get('/popular-provinces-th', searchEstate.getPopularProvincesTH)
  .get('/search', searchEstate.searchEstate);

export default router;
