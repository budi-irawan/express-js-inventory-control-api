const db = require( '../models' );
const {
	Sequelize,
	QueryTypes
} = require( 'sequelize' );
const roleModel = require( '../models' ).Role;
const userModel = require( '../models' ).User;

class Role {
	static async create( req, res ) {
		try {
			const {
				roleName
			} = req.body;
			let errors = {};
			let response;
			let statusCode;
			if ( !roleName || roleName == '' || roleName == null ) {
				errors.roleName = 'nama role harus diisi';
			}

			if ( Object.entries( errors ).length == 0 ) {
				const role = await roleModel.create( {
					roleName: roleName
				} );
				statusCode = 201;
				response = role;
			} else {
				statusCode = 400;
				response = errors;
			}
			res.status( statusCode ).json( response );
		} catch ( e ) {
			console.log( e.message );
		}
	}

	static async read( req, res ) {
		try {
			let response;
			let statusCode;
			const role = await roleModel.findAll();
			if ( role.length > 0 ) {
				statusCode = 200;
				response = role;
			} else {
				statusCode = 404;
				response = {
					pesan: 'belum ada data'
				}
			}
			res.status( statusCode ).json( role );
		} catch ( e ) {
			console.log( e.message );
		}
	}

	static async update( req, res ) {
		try {
			const {
				roleName
			} = req.body;
			const {
				id
			} = req.params;
			let errors = {};
			let response;
			let statusCode;

			if ( !roleName || roleName == '' || roleName == null ) {
				errors.roleName = 'nama role harus diisi';
			}

			const role = await roleModel.update( {
				roleName: roleName
			}, {
				where: {
					id: id
				}
			} );

			if ( Object.entries( errors ) == 0 ) {
				statusCode = 200;
				response = {
					pesan: 'role berhasil diperbarui'
				};
				res.status( statusCode ).json( response );
			} else {
				statusCode = 400;
				response = errors;
			}
		} catch ( e ) {
			console.log( e.message );
		}
	}

	static async delete( req, res ) {
		try {
			const {
				id
			} = req.params;
			let errors = {};
			let response;
			let statusCode;

			const role = await roleModel.destroy( {
				where: {
					id: id
				}
			} );

			if ( Object.entries( errors ) == 0 ) {
				statusCode = 200;
				response = {
					pesan: 'role berhasil dihapus'
				};
				res.status( statusCode ).json( response );
			} else {
				statusCode = 400;
				response = errors;
			}
		} catch ( e ) {
			console.log( e.message );
		}
	}

	static async getAllUsers( req, res ) {
		try {
			const {
				id
			} = req.params;
			const role = await db.sequelize.query( `SELECT * FROM "Roles" WHERE "id"=${id}` );
			const user = await db.sequelize.query( `SELECT "Users"."id","Users"."name","Users"."email" FROM  "Users" WHERE "roleId"=${id}` );

			role[ 0 ][ 0 ].users = user[ 0 ];
			res.status( 200 ).json( role[ 0 ][ 0 ] );
		} catch ( e ) {
			console.log( e.message );
		}
	}
}

module.exports = Role;