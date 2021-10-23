const express = require( 'express' );
const router = express.Router();

const authentification = require( '../../middleware/authentification' );
const authorization = require( '../../middleware/authorization' );
const gudangController = require( '../../controllers/gudang' );

router.post( '/', authentification.isLogin, authorization.isAdmin, gudangController.create );
router.get( '/', authentification.isLogin, authorization.isAdmin, gudangController.read );
router.get( '/:id/products', authentification.isLogin, authorization.isAdmin, gudangController.readProducts );
router.put( '/:id', authentification.isLogin, authorization.isAdmin, gudangController.update );
router.delete( '/:id', authentification.isLogin, authorization.isAdmin, gudangController.delete );

module.exports = router;