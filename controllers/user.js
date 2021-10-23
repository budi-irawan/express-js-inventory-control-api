const bcrypt = require( 'bcrypt' );
const jwt = require( 'jsonwebtoken' );
const fs = require( 'fs' );
const validEmail = require( '../helper/validEmail' );
const sendEmail = require( '../helper/sendEmail' );
const userModel = require( '../models' ).User;
const roleModel = require( '../models' ).Role;
const db = require( '../models' );
const {
	Sequelize,
	QueryTypes
} = require( 'sequelize' );

class User {
	static async register( req, res ) {
		try {
			const {
				name,
				email,
				password,
				phoneNumber,
				roleName
			} = req.body;
			let errors = [];
			let response;
			let statusCode;
			if ( !name ) {
				errors.name = 'nama harus diisi';
			}
			if ( !email ) {
				errors.email = 'email harus diisi';
			} else if ( validEmail.isEmailValid( email ) == false ) {
				errors.email = 'format email tidak valid';
			} else {
				const emailExist = await userModel.findOne( {
					where: {
						email: email
					}
				} );
				if ( emailExist ) {
					errors.email = 'email sudah terdaftar';
				}
			}
			if ( !password ) {
				errors.password = "password harus diisi";
			} else if ( !/^\S*$/.test( password ) ) {
				errors.password = "password tidak boleh mengandung spasi";
			} else if ( !/^(?=.*[A-Z]).*$/.test( password ) ) {
				errors.password = "password harus mengandung minimal 1 huruf besar"
			} else if ( !/^(?=.*[a-z]).*$/.test( password ) ) {
				errors.password = "password harus mengandung minimal 1 huruf kecil"
			} else if ( !/^(?=.*[0-9]).*$/.test( password ) ) {
				errors.password = "password harus mengandung minimal 1 angka"
			} else if ( !/^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/.test( password ) ) {
				errors.password = "password harus mengandung minimal 1 karakter spesial"
			} else if ( !/^.{6,}$/.test( password ) ) {
				errors.password = "password minimal 6 karakter"
			}
			if ( !phoneNumber ) {
				errors.phoneNumber = "no hp harus diisi";
			} else if ( isNaN( phoneNumber ) ) {
				errors.phoneNumber = "no hp harus angka";
			}
			if ( !req.file ) {
				errors.image = 'foto belum diupload';
			}
			if ( !roleName ) {
				errors.roleName = 'nama role harus diisi';
			}
			const role = await roleModel.findOne( {
				where: {
					roleName: roleName
				}
			} );

			if ( Object.entries( errors ) == 0 ) {
				const passwordHash = await bcrypt.hash( password, 10 );
				const verificationCode = await jwt.sign( {
					email: email
				}, 'secret' );
				const user = await userModel.create( {
					name: name,
					email: email,
					password: passwordHash,
					phoneNumber: phoneNumber,
					image: req.file.filename,
					roleId: role.id,
					isActive: false,
					verificationCode: verificationCode,
					resetCode: null,
					expireCode: null
				} );
				sendEmail.sendEmailVerification( user.email, user.verificationCode );
				statusCode = 201;
				response = user;
			} else {
				statusCode = 400;
				response = errors;
			}
			res.status( statusCode ).json( response );
		} catch ( e ) {
			console.log( e.message );
		}
	}

	static async verification( req, res ) {
		try {
			const {
				verificationCode
			} = req.params;
			let errors = {};
			let response;
			let statusCode;

			const user = await userModel.findOne( {
				where: {
					verificationCode: verificationCode
				}
			} );

			if ( !user ) {
				errors.tokenVerifikasi = 'kode verifikasi tidak valid';
			} else {
				await user.update( {
					isActive: true
				} );
			}
			if ( Object.entries( errors ) == 0 ) {
				statusCode = 200;
				response = {
					status: 'verifikasi berhasil'
				}
			} else {
				statusCode = 400;
				response = errors;
			}
			res.status( statusCode ).json( response );
		} catch ( e ) {
			console.log( e );
		}
	}

	static async login( req, res ) {
		try {
			const {
				email,
				password
			} = req.body;
			let errors = {};
			let response;
			let statusCode;
			let token;

			const user = await userModel.findOne( {
				where: {
					email: email
				}
			} );

			if ( !email ) {
				errors.email = 'email harus diisi';
			} else if ( validEmail.isEmailValid( email ) == false ) {
				errors.email = 'format email tidak valid';
			} else if ( !user ) {
				errors.email = 'email belum terdaftar';
			} else if ( user.isActive == false ) {
				errors.email = 'anda belum verifikasi email';
			} else if ( !password ) {
				errors.password = 'password harus diisi';
			} else {
				const match = await bcrypt.compare( password, user.password );
				if ( !match ) {
					errors.password = 'password salah';
				} else {
					token = await jwt.sign( {
						id: user.id,
						email: user.email
					}, 'secret' );
				}
			}

			if ( Object.entries( errors ) == 0 ) {
				statusCode = 200;
				response = {
					token: token
				}
			} else {
				statusCode = 400;
				response = errors;
			}
			res.status( statusCode ).json( response );
		} catch ( e ) {
			console.log( e.message );
		}
	}

	static async forgotPassword( req, res ) {
		try {
			const {
				email
			} = req.body;
			let errors = {};
			let response;
			let statusCode;
			if ( !email ) {
				errors.email = 'masukkan email anda';
			} else {
				const user = await userModel.findOne( {
					where: {
						email: email
					}
				} );
				if ( !user ) {
					errors.email = 'email belum terdaftar';
				} else {
					const tokenReset = await jwt.sign( {
						email: user.email
					}, 'secret' );
					await user.update( {
						tokenReset: tokenReset,
						tokenKadaluarsa: Date.now() + 3600000
					} );
				}
			}
			if ( Object.entries( errors ) == 0 ) {
				statusCode = 200;
				response = {
					pesan: 'cek email anda untuk melakukan pengaturan ulang password'
				};
				sendEmail.resetPassword( user.email, user.tokenReset )
			} else {
				statusCode = 400;
				response = errors;
			}
			res.status( statusCode ).json( response );
		} catch ( e ) {
			console.log( e.message );
		}
	}

	static async passwordReset( req, res ) {
		try {
			const {
				tokenReset
			} = req.params;
			const {
				password
			} = req.body;
			let errors = {};
			let response;
			let statusCode;

			const user = await userModel.findOne( {
				where: {
					tokenReset: tokenReset
				}
			} );

			if ( !password ) {
				errors.password = "password harus diisi";
			} else if ( !/^\S*$/.test( password ) ) {
				errors.password = "password tidak boleh mengandung spasi";
			} else if ( !/^(?=.*[A-Z]).*$/.test( password ) ) {
				errors.password = "password harus mengandung minimal 1 huruf besar"
			} else if ( !/^(?=.*[a-z]).*$/.test( password ) ) {
				errors.password = "password harus mengandung minimal 1 huruf kecil"
			} else if ( !/^(?=.*[0-9]).*$/.test( password ) ) {
				errors.password = "password harus mengandung minimal 1 angka"
			} else if ( !/^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/.test( password ) ) {
				errors.password = "password harus mengandung minimal 1 karakter spesial"
			} else if ( !/^.{6,}$/.test( password ) ) {
				errors.password = "password minimal 6 karakter"
			}

			if ( Object.entries( errors ).length == 0 ) {
				const passwordHash = await bcrypt.hash( password, 10 );
				await user.update( {
					password: passwordHash,
					tokenReset: null,
					tokenKadaluarsa: null
				} );
				statusCode = 200;
				response = {
					pesan: 'password berhasil direset'
				}
			} else {
				statusCode = 400;
				response = errors;
			}
			res.status( statusCode ).json( response );
		} catch ( e ) {
			console.log( e.message );
		}
	}

	static async getAllUser( req, res ) {
		try {
			let response;
			let statusCode;
			const users = await userModel.findAll( {
				include: [ {
					model: roleModel,
					as: 'role'
				} ]
			} );
			if ( users.length > 0 ) {
				statusCode = 200;
				response = users;
			} else {
				statusCode = 404;
				response = {
					pesan: 'belum ada data'
				}
			}
			res.status( statusCode ).json( response );
		} catch ( e ) {
			console.log( e.message );
		}
	}

	static async getById( req, res ) {
		try {
			const {
				id
			} = req.params;
			let response;
			let statusCode;
			const user = await userModel.findOne( {
				where: {
					id: id
				}
			} );
			if ( !user ) {
				statusCode = 404;
				response = {
					pesan: 'data tidak ada'
				}
			} else {
				statusCode = 200;
				response = user
			}
			res.status( statusCode ).json( response );
		} catch ( e ) {
			console.log( e.message );
		}
	}

	static async delete( req, res ) {
		try {
			const {
				id
			} = req.params;
			let response;
			let statusCode;

			const user = await userModel.findOne( {
				where: {
					id: id
				}
			} );
			if ( !user ) {
				statusCode = 404;
				response = {
					pesan: 'user tidak ada'
				}
			} else {
				await user.destroy();
				fs.unlink( `./public/foto/${user.image}`, ( err ) => {
					if ( err ) throw err;
				} );
				statusCode = 200;
				response = {
					pesan: 'user berhasil dihapus'
				}
			}
			res.status( statusCode ).json( response );
		} catch ( e ) {
			console.log( e.message );
		}
	}
}

module.exports = User;