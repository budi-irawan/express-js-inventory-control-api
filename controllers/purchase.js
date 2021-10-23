const purchaseModel = require( '../models' ).Purchase;
const stockModel = require( '../models' ).Stock;
const productModel = require( '../models' ).Product;
const gudangModel = require( '../models' ).Gudang;
const db = require( '../models' );
const {
	Sequelize,
	QueryTypes
} = require( 'sequelize' );

class Purchase {
	static async create( req, res ) {
		try {
			const {
				productId,
				price,
				quantity,
				gudangName
			} = req.body;
			const product = await productModel.findOne( {
				where: {
					id: productId
				}
			} );
			const gudang = await gudangModel.findOne( {
				where: {
					gudangName: gudangName
				}
			} );

			const purchase = await purchaseModel.create( {
				productId: product.id,
				price: price,
				quantity: quantity,
				gudangId: gudang.id,
				userId: req.user.id
			} );

			const stock = await stockModel.create( {
				productId: purchase.productId,
				price: purchase.price,
				stock: purchase.quantity,
				gudangId: purchase.gudangId
			} );

			res.status( 201 ).json( purchase );
		} catch ( e ) {
			console.log( e );
		}
	}

	static async read( req, res ) {
		try {
			const purchase = await db.sequelize.query( `
				select "Purchases"."id","Products"."productName","Purchases"."price","Purchases"."quantity","Gudangs"."gudangName","Users"."name" as "user","Purchases"."createdAt"
				from "Purchases"
				join "Products" on "Purchases"."productId"="Products"."id"
				join "Gudangs" on "Purchases"."gudangId"="Gudangs"."id"
				join "Users" on "Purchases"."userId"="Users"."id";` );
			res.status( 200 ).json( purchase[ 0 ] );
		} catch ( e ) {
			console.log( e );
		}
	}
	//
	// static async update( req, res ) {
	// 	try {
	//
	// 	} catch ( e ) {
	// 		console.log( e );
	// 	}
	// }
	//
	// static async delete( req, res ) {
	// 	try {
	//
	// 	} catch ( e ) {
	// 		console.log( e );
	// 	}
	// }
}

module.exports = Purchase;