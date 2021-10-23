const express = require( 'express' );
const router = express.Router();

const authentification = require( '../../middleware/authentification' );
const authorization = require( '../../middleware/authorization' );
const purchaseController = require( '../../controllers/purchase' );

router.post( '/', authentification.isLogin, authorization.isUser, purchaseController.create );
router.get( '/', authentification.isLogin, authorization.isUser, purchaseController.read );
// router.put( '/:id', purchaseController.update );
// router.delete( '/:id', purchaseController.delete );

module.exports = router;