const express = require( 'express' );
const router = express.Router();

const roleRoute = require( './role/roleRoute' );
const userRoute = require( './user/userRoute' );
const categoryRoute = require( './category/categoryRoute' );
const supplierRoute = require( './supplier/supplierRoute' );
const productRoute = require( './product/productRoute' );
const gudangRoute = require( './gudang/gudangRoute' );
const purchaseRoute = require( './purchase/purchaseRoute' );
const storeRoute = require( './store/storeRoute' );
const stockoutRoute = require( './stockout/stockoutRoute' );

router.use( '/api/roles', roleRoute );
router.use( '/api/users', userRoute );
router.use( '/api/categories', categoryRoute );
router.use( '/api/suppliers', supplierRoute );
router.use( '/api/products', productRoute );
router.use( '/api/gudang', gudangRoute );
router.use( '/api/purchases', purchaseRoute );
router.use( '/api/stores', storeRoute );
router.use( '/api/stock-out', stockoutRoute );

module.exports = router;