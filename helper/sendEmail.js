const nodemailer = require( 'nodemailer' );
require( "dotenv" ).config();

const transporter = nodemailer.createTransport( {
	host: 'gmail',
	port: 587,
	secure: false,
	auth: {
		user: process.env.MAIL,
		pass: process.env.PASS,
	}
} )

const sendEmailVerification = ( email, verificationCode ) => {
	const options = {
		from: "'Inventory-Server' <no-reply@gmail.com>",
		to: email,
		subject: "Verifikasi Pendaftaran",
		text: "oke",
		html: `<h3>Selamat datang</h3><br/>
		Verifikasi akun anda di sini <a href=http://localhost:3000/api/users/verification/${verificationCode}> verifikasi</a>`,
	};

	transporter.sendMail( options, ( err, info ) => {
		if ( err ) {
			console.log( err );
		}
		console.log( `Email terkirim ke ${email}` );
	} )
}

const resetPassword = ( email, tokenReset ) => {
	const options = {
		from: "'Inventory-Server' <no-reply@gmail.com>",
		to: email,
		subject: "Password Reset",
		text: "oke",
		html: `<h3>Panduan ubah password</h3><br/>
		Klik tautan ini untuk pengaturan ulang password <a href=http://localhost:3000/api/users/password-reset/${tokenReset}> reset password</a>`,
	};

	transporter.sendMail( options, ( err, info ) => {
		if ( err ) {
			console.log( err );
		}
		console.log( `Email reset password terkirim ke ${email}` );
	} )
}

module.exports = {
	sendEmailVerification,
	resetPassword,
	transporter
};