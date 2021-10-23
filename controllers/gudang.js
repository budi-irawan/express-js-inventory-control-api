const gudangModel = require( '../models' ).Gudang;
const db = require( '../models' );
const {
	Sequelize,
	QueryTypes
} = require( 'sequelize' );

class Gudang {
	static async create( req, res ) {
		try {
			const {
				gudangName
			} = req.body;
			const gudang = await gudangModel.create( {
				gudangName: gudangName
			} );
			res.status( 201 ).json( gudang );
		} catch ( e ) {
			console.log( e );
		}
	}

	static async read( req, res ) {
		try {
			const gudang = await gudangModel.findAll();
			res.status( 200 ).json( gudang );
		} catch ( e ) {
			console.log( e );
		}
	}

	static async readProducts( req, res ) {
		try {
			const {
				id
			} = req.params;
			const gudang = await db.sequelize.query( `SELECT "Gudangs"."gudangName" FROM "Gudangs" WHERE "Gudangs"."id"=${id}` );
			const products = await db.sequelize.query( `
				SELECT "Stocks"."id","Products"."productName","Stocks"."price","Stocks"."stock","Stocks"."createdAt"
				FROM "Stocks"
				JOIN "Products" on "Stocks"."productId"="Products"."id"
				WHERE "Stocks"."gudangId"=${id}
				ORDER BY "Stocks"."createdAt" asc;` );
			gudang[ 0 ][ 0 ].products = products[ 0 ];
			res.status( 200 ).json( gudang[ 0 ][ 0 ] );
		} catch ( e ) {
			console.log( e );
		}
	}

	static async update( req, res ) {
		try {
			const {
				id
			} = req.params;
			const {
				gudangName
			} = req.body;
			const gudang = await gudangModel.update( {
				gudangName: gudangName
			}, {
				where: {
					id: id
				}
			} );
			res.status( 200 ).json( {
				message: 'gudang berhasil diupdate'
			} );
		} catch ( e ) {
			console.log( e );
		}
	}

	static async delete( req, res ) {
		try {
			const {
				id
			} = req.params;
			const gudang = await gudangModel.destroy( {
				where: {
					id: id
				}
			} );
			res.status( 200 ).json( {
				message: 'gudang berhasil dihapus'
			} );
		} catch ( e ) {
			console.log( e );
		}
	}
}

module.exports = Gudang;