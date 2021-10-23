const express = require( 'express' );
const router = express.Router();

const authentification = require( '../../middleware/authentification' );
const authorization = require( '../../middleware/authorization' );
const stockoutController = require( '../../controllers/stockout' );

router.post( '/', authentification.isLogin, authorization.isUser, stockoutController.create );
router.get( '/', authentification.isLogin, authorization.isUser, stockoutController.read );
// router.put( '/:id', purchaseController.update );
// router.delete( '/:id', purchaseController.delete );

module.exports = router;