const express = require( 'express' );
const router = express.Router();

const {
	upload
} = require( '../../middleware/upload' );
const authentification = require( '../../middleware/authentification' );
const authorization = require( '../../middleware/authorization' );
const userController = require( '../../controllers/user' );

router.post( '/register', upload.single( 'image' ), userController.register );
router.put( '/verification/:verificationCode', userController.verification );
router.post( '/login', userController.login );
router.post( '/forgot-password', userController.forgotPassword );
router.put( '/password-reset/:tokenReset', userController.passwordReset );
router.get( '/', authentification.isLogin, authorization.isAdmin, userController.getAllUser );
router.get( '/:id', authentification.isLogin, authorization.isUser, userController.getById );
router.delete( '/:id', authentification.isLogin, authorization.isAdmin, userController.delete );

module.exports = router;