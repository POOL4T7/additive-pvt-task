const UserController = require('../controller/user.controller');
const UserMiddleware = require('../middlewares/auth.middleware');

const router = require('express').Router();

router.post('/register', UserController.userRegistration);
router.patch(
  '/update-profile',
  UserMiddleware.protect,
  UserController.updateProfile
);

router.post('/login', UserController.login);
router.get('/get-profile', UserMiddleware.protect, UserController.getProfile);

module.exports = router;
