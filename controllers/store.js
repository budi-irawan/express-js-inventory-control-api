const storeModel = require( '../models' ).Store;

class Store {
	static async create( req, res ) {
		try {
			const {
				storeName,
				address,
				email,
				phone
			} = req.body;
			const store = await storeModel.create( {
				storeName: storeName,
				address: address,
				email: email,
				phone: phone
			} );
			res.status( 201 ).json( store );
		} catch ( e ) {
			console.log( e );
		}
	}

	static async read( req, res ) {
		try {
			const stores = await storeModel.findAll();
			res.status( 200 ).json( stores );
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
				storeName,
				address,
				email,
				phone
			} = req.body;
			const store = await storeModel.update( {
				storeName: storeName,
				address: address,
				email: email,
				phone: phone
			}, {
				where: {
					id: id
				}
			} );
			res.status( 200 ).json( {
				message: 'toko berhasil diupdate'
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
			const store = await storeModel.destroy( {
				where: {
					id: id
				}
			} );
			res.status( 200 ).json( {
				message: 'store berhasil dihapus'
			} );
		} catch ( e ) {
			console.log( e );
		}
	}
}

module.exports = Store;