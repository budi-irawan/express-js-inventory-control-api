const stockoutModel = require( '../models' ).Stockout;
const stockModel = require( '../models' ).Stock;
const productModel = require( '../models' ).Product;
const gudangModel = require( '../models' ).Gudang;
const storeModel = require( '../models' ).Store;
const db = require( '../models' );
const {
	Sequelize,
	QueryTypes
} = require( 'sequelize' );

class Stockout {
	static async create( req, res ) {
		try {
			let errors = {};
			let response;
			const {
				productId,
				quantity,
				gudangName,
				storeName
			} = req.body;
			const product = await stockModel.findOne( {
				where: {
					productId: productId
				},
				order: [
					[ 'id', 'DESC' ]
				]
			} );
			const gudang = await gudangModel.findOne( {
				where: {
					gudangName: gudangName
				}
			} );
			const store = await storeModel.findOne( {
				where: {
					storeName: storeName
				}
			} );

			if ( product.stock >= quantity ) {
				let sisa = product.stock - quantity;
				await product.update( {
					stock: sisa
				} );
				const stockout = await stockoutModel.create( {
					productId: product.productId,
					quantity: quantity,
					gudangId: gudang.id,
					storeId: store.id,
					userId: req.user.id
				} );
				response = stockout;
			} else {
				errors.stock = 'stock tidak cukup';
				response = errors;
			}
			res.status( 201 ).json( response );
		} catch ( e ) {
			console.log( e );
		}
	}

	static async read( req, res ) {
		try {
			const stockout = await db.sequelize.query( `
				SELECT "Stockouts"."id","Products"."productName","Stockouts"."quantity","Gudangs"."gudangName","Stores"."storeName","Users"."name" as "user","Stockouts"."createdAt" 
				FROM "Stockouts"
				JOIN "Products" ON "Stockouts"."productId"="Products"."id"
				JOIN "Gudangs" ON "Stockouts"."gudangId"="Gudangs"."id"
				JOIN "Stores" ON "Stockouts"."storeId"="Stores"."id"
				JOIN "Users" ON "Stockouts"."userId"="Users"."id";` );
			res.status( 200 ).json( stockout[ 0 ] );
		} catch ( e ) {
			console.log( e );
		}
	}
}

module.exports = Stockout;