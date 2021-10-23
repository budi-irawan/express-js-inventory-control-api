require( "dotenv" ).config();

const creds = {
	development: {
		username: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		dialect: process.env.DB_DIAL,
		logging: false
	},
	test: {
		username: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		dialect: process.env.DB_DIAL
	},
	production: {
		username: "dmldlzigzvgoad",
		password: "551d3c37f5bcf6ce1d40c3dcda73da27cbd39cd674a973879e0a16729014c018",
		database: "dfnjlbakshllql",
		host: "ec2-54-166-120-40.compute-1.amazonaws.com",
		port: 5432,
		dialect: "postgres",
		ssl: true,
		dialectOptions: {
			ssl: {
				require: true, // This will help you. But you will see nwe error
				rejectUnauthorized: false // This line will fix new error
			}
		}
	}
}

module.exports = creds;