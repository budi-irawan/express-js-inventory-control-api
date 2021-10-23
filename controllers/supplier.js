const supplierModel = require( '../models' ).Supplier;

class Supplier {
	static async create( req, res ) {
		try {
			const {
				supplierName,
				address,
				email,
				phone
			} = req.body;
			const supplier = await supplierModel.create( {
				supplierName: supplierName,
				address: address,
				email: email,
				phone: phone
			} );
			res.status( 201 ).json( supplier );
		} catch ( e ) {
			console.log( e.message );
		}
	}

	static async read( req, res ) {
		try {
			const suppliers = await supplierModel.findAll();
			res.status( 200 ).json( suppliers );
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
				supplierName,
				address,
				email,
				phone
			} = req.body;
			const supplier = await supplierModel.update( {
				supplierName: supplierName,
				address: address,
				email: email,
				phone: phone
			}, {
				where: {
					id: id
				}
			} );
			res.status( 200 ).json( {
				message: 'supplier berhasil diupdate'
			} );
		} catch ( e ) {
			console.log( e.message );
		}
	}

	static async delete( req, res ) {
		try {
			const {
				id
			} = req.params;
			const supplier = await supplierModel.destroy( {
				where: {
					id: id
				}
			} );
			res.status( 200 ).json( {
				message: 'supplier berhasil dihapus'
			} )
		} catch ( e ) {
			console.log( e.message );
		}
	}

	// static async getAllProductBySupplier(req,res) {
	//   try {
	//
	//   } catch (e) {
	//     console.log(e.message);
	//   }
	// }
}

module.exports = Supplier;