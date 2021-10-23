'use strict';
const {
	Model
} = require( 'sequelize' );
module.exports = ( sequelize, DataTypes ) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate( models ) {
			// define association here
			User.belongsTo( models.Role, {
				foreignKey: 'roleId',
				as: 'role'
			} )
		}
	};
	User.init( {
		name: DataTypes.STRING,
		email: DataTypes.STRING,
		password: DataTypes.STRING,
		phoneNumber: DataTypes.STRING,
		image: DataTypes.STRING,
		roleId: DataTypes.INTEGER,
		isActive: DataTypes.BOOLEAN,
		verificationCode: DataTypes.STRING,
		resetCode: DataTypes.STRING,
		expireCode: DataTypes.DATE
	}, {
		sequelize,
		modelName: 'User',
	} );
	return User;
};