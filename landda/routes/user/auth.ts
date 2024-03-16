import express from 'express';
import * as auth from '../../controllers/user/auth';

const router = express.Router();

router
  // signIn, signUp
  .post('/google', auth.signIn)
  // generate token
  .post('/refreshToken', auth.refreshToken);

export default router;
