const express = require( 'express' );
const router = express.Router();

const authentification = require( '../../middleware/authentification' );
const authorization = require( '../../middleware/authorization' );
const storeController = require( '../../controllers/store' );

router.post( '/', authentification.isLogin, authorization.isUser, storeController.create );
router.get( '/', authentification.isLogin, authorization.isUser, storeController.read );
router.put( '/:id', authentification.isLogin, authorization.isUser, storeController.update );
router.delete( '/:id', authentification.isLogin, authorization.isUser, storeController.delete );

module.exports = router;