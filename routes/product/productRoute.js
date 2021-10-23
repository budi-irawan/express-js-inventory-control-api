const express = require( 'express' );
const router = express.Router();
const {
	upload
} = require( '../../middleware/upload' );

const authentification = require( '../../middleware/authentification' );
const authorization = require( '../../middleware/authorization' );
const productController = require( '../../controllers/product' );

router.post( '/', authentification.isLogin, authorization.isUser, upload.array( 'images' ), productController.create );
router.get( '/', authentification.isLogin, authorization.isUser, productController.read );
router.put( '/:id', authentification.isLogin, authorization.isUser, upload.array( 'images' ), productController.update );
router.delete( '/:id', authentification.isLogin, authorization.isUser, productController.delete );
router.get( '/:id', authentification.isLogin, authorization.isUser, productController.getProductById );

module.exports = router;