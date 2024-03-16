import express from 'express';
import * as favorite from '../../controllers/user/favorite';
import * as stripe from '../../controllers/user/stripe';
import * as message from '../../controllers/user/message';
import { validateToken } from '../../middlewares/accesstoken';
import { limitParams } from '../../middlewares/validate_request';

const router = express.Router();

router
  // favorite
  .get('/user/list-favorite', validateToken, favorite.listFavorites)
  .get('/user/check-favorite', validateToken, favorite.checkFavorites)
  .post('/user/save-favorite/:estateId', validateToken, limitParams('estateId', 20), favorite.saveFavorite)
  // stripe
  .get('/stripe/prices', stripe.getPrices)
  .post('/stripe/session', validateToken, stripe.createSession)
  .get('/stripe/subscribed', validateToken, stripe.getSubscribed)
  // message
  .post('/message/send-message', message.sendMessage)
  .get('/message/search', validateToken, message.searchMessages)
  .delete('/message/delete-message/:messageObjectId', validateToken, limitParams('messageObjectId', 20), message.deleteMessages);

export default router;
