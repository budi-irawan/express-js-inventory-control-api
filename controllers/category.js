const categoryModel = require( '../models' ).Category;
const db = require( '../models' );
const {
	Sequelize,
	QueryTypes
} = require( 'sequelize' );

class Category {
	static async create( req, res ) {
		try {
			const {
				categoryName
			} = req.body;
			const category = await categoryModel.create( {
				categoryName: categoryName
			} );
			res.status( 201 ).json( category );
		} catch ( e ) {
			console.log( e.message );
		}
	}

	static async read( req, res ) {
		try {
			const categories = await categoryModel.findAll();
			res.status( 200 ).json( categories );
		} catch ( e ) {
			console.log( e.message );
		}
	}

	static async update( req, res ) {
		try {
			const {
				id
			} = req.params;
			const {
				categoryName
			} = req.body;
			const category = await categoryModel.update( {
				categoryName: categoryName
			}, {
				where: {
					id: id
				}
			} );
			res.status( 200 ).json( {
				message: 'category berhasil diupdate'
			} )
		} catch ( e ) {
			console.log( e.message );
		}
	}

	static async delete( req, res ) {
		try {
			const {
				id
			} = req.params;
			const category = await categoryModel.destroy( {
				where: {
					id: id
				}
			} );
			res.status( 200 ).json( {
				message: 'category berhasil dihapus'
			} )
		} catch ( e ) {
			console.log( e.message );
		}
	}

	static async getProductByCategory( req, res ) {
		try {
			const {
				id
			} = req.params;
			const category = await db.sequelize.query( `SELECT * FROM "Categories" WHERE "id"=${id};` );
			const products = await db.sequelize.query( `
				SELECT "Products"."id","Products"."productName","Suppliers"."supplierName"
				FROM "Products"
				JOIN "Categories" ON "Products"."categoryId"="Categories"."id"
				JOIN "Suppliers" ON "Products"."supplierId"="Suppliers"."id"
				WHERE "Products"."categoryId"=${id};` );
			category[ 0 ][ 0 ].products = products[ 0 ];
			res.status( 200 ).json( category[ 0 ][ 0 ] );
		} catch ( e ) {
			console.log( e.message );
		}
	}
}

module.exports = Category;