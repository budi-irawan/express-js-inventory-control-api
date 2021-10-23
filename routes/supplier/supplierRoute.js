const express = require( 'express' );
const router = express.Router();

const authentification = require( '../../middleware/authentification' );
const authorization = require( '../../middleware/authorization' );
const supplierController = require( '../../controllers/supplier' );

router.post( '/', authentification.isLogin, authorization.isUser, supplierController.create );
router.get( '/', authentification.isLogin, authorization.isUser, supplierController.read );
router.put( '/:id', authentification.isLogin, authorization.isUser, supplierController.update );
router.delete( '/:id', authentification.isLogin, authorization.isUser, supplierController.delete );

module.exports = router;