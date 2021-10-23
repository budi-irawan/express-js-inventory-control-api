const db = require( '../models' );
const {
	Sequelize,
	QueryTypes
} = require( 'sequelize' );

class Authorization {
	static async isAdmin( req, res, next ) {
		const user = await db.sequelize.query( `
			SELECT "Users"."id","Users"."name","Users"."email","Roles"."roleName"
			FROM "Users"
			JOIN "Roles" ON "Users"."roleId"="Roles"."id"
			WHERE "Users"."id"=${req.user.id}` );

		if ( user[ 0 ][ 0 ].roleName == "admin" ) {
			next();
		} else {
			res.status( 403 ).json( {
				message: 'anda tidak bisa mengakses halaman ini'
			} );
		}
	}

	static async isUser( req, res, next ) {
		const user = await db.sequelize.query( `
			SELECT "Users"."id","Users"."name","Users"."email","Roles"."roleName"
			FROM "Users"
			JOIN "Roles" ON "Users"."roleId"="Roles"."id"
			WHERE "Users"."id"=${req.user.id}` );

		if ( user[ 0 ][ 0 ].roleName == "admin" || user[ 0 ][ 0 ].roleName == "user" ) {
			next();
		} else {
			res.status( 403 ).json( {
				message: 'anda tidak bisa mengakses halaman ini'
			} );
		}
	}
}

module.exports = Authorization;