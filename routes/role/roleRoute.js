const express = require( 'express' );
const router = express.Router();

const authentification = require( '../../middleware/authentification' );
const authorization = require( '../../middleware/authorization' );
const roleController = require( '../../controllers/role' );

router.post( '/', authentification.isLogin, authorization.isAdmin, roleController.create );
router.get( '/', authentification.isLogin, authorization.isAdmin, roleController.read );
router.put( '/:id', authentification.isLogin, authorization.isAdmin, roleController.update );
router.delete( '/:id', authentification.isLogin, authorization.isAdmin, roleController.delete );
router.get( '/:id/users', authentification.isLogin, authorization.isAdmin, roleController.getAllUsers );

module.exports = router;