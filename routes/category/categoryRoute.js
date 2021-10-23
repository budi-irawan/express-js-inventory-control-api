const express = require( 'express' );
const router = express.Router();

const authentification = require( '../../middleware/authentification' );
const authorization = require( '../../middleware/authorization' );
const categoryController = require( '../../controllers/category' );

router.post( '/', authentification.isLogin, authorization.isUser, categoryController.create );
router.get( '/', authentification.isLogin, authorization.isUser, categoryController.read );
router.put( '/:id', authentification.isLogin, authorization.isUser, categoryController.update );
router.delete( '/:id', authentification.isLogin, authorization.isUser, categoryController.delete );
router.get( '/:id/products', authentification.isLogin, authorization.isUser, categoryController.getProductByCategory );

module.exports = router;