const productModel = require( '../models' ).Product;
const imageProductModel = require( '../models' ).ProductImage;
const categoryModel = require( '../models' ).Category;
const supplierModel = require( '../models' ).Supplier;
const sharp = require( 'sharp' );
const path = require( 'path' );
const db = require( '../models' );
const {
	Sequelize,
	QueryTypes
} = require( 'sequelize' );

class Product {
	static async create( req, res ) {
		try {
			const {
				productName,
				categoryName,
				supplierName
			} = req.body;
			const category = await categoryModel.findOne( {
				where: {
					categoryName: categoryName
				}
			} );
			const supplier = await supplierModel.findOne( {
				where: {
					supplierName: supplierName
				}
			} );
			const product = await productModel.create( {
				productName: productName,
				categoryId: category.id,
				supplierId: supplier.id
			} );

			for ( let i = 0; i < req.files.length; i++ ) {
				const filename = req.files[ i ].originalname.replace( /\..+$/, '' );
				const newFilename = `product-${filename}-${Date.now()}.png`;
				sharp( req.files[ i ].path )
					.resize( 144, 144 )
					.png( {
						quality: 90
					} )
					.toFile( path.join( __dirname, '../', 'public', 'produk', newFilename ), ( err, info ) => {
						if ( err ) {
							console.log( err );
						} else {
							console.log( `image cropped` );
						}
					} );
				const images = await imageProductModel.create( {
					imageName: newFilename,
					productId: product.id
				} );
			}
			res.status( 201 ).json( product );
		} catch ( e ) {
			console.log( e );
		}
	}

	static async read( req, res ) {
		try {
			const products = await productModel.findAll();
			res.status( 200 ).json( products );
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
				productName,
				categoryName,
				supplierName
			} = req.body;
			const category = await categoryModel.findOne( {
				where: {
					categoryName: categoryName
				}
			} );
			const supplier = await supplierModel.findOne( {
				where: {
					supplierName: supplierName
				}
			} );
			const product = await productModel.update( {
				productName: productName,
				categoryId: category.id,
				supplierId: supplier.id
			}, {
				where: {
					id: id
				}
			} );

			for ( let i = 0; i < req.files.length; i++ ) {
				const filename = req.files[ i ].originalname.replace( /\..+$/, '' );
				const newFilename = `product-${filename}-${Date.now()}.png`;
				sharp( req.files[ i ].path )
					.resize( 144, 144 )
					.png( {
						quality: 90
					} )
					.toFile( path.join( __dirname, '../', 'public', 'produk', newFilename ), ( err, info ) => {
						if ( err ) {
							console.log( err );
						} else {
							console.log( `image cropped` );
						}
					} );

				const images = await imageProductModel.update( {
					imageName: newFilename
				}, {
					where: {
						productId: id
					}
				} );
			}
			res.status( 200 ).json( {
				message: 'product berhasil diupdate'
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
			const product = await productModel.destroy( {
				where: {
					id: id
				}
			} );
			res.status( 200 ).json( {
				message: 'product berhasil dihapus'
			} )
		} catch ( e ) {
			console.log( e.message );
		}
	}

	static async getProductById( req, res ) {
		try {
			const {
				id
			} = req.params;
			const product = await db.sequelize.query( `
    	  SELECT "Products"."id","Products"."productName","Categories"."categoryName","Suppliers"."supplierName"
        FROM "Products"
        JOIN "Categories" ON "Products"."categoryId"="Categories"."id"
        JOIN "Suppliers" ON "Products"."supplierId"="Suppliers"."id"
        WHERE "Products"."id"=${id};` );
			const images = await db.sequelize.query( `
        SELECT "ProductImages"."imageName"
        FROM "ProductImages"
        WHERE "ProductImages"."productId"=${id}` );
			product[ 0 ][ 0 ].images = images[ 0 ];
			res.status( 200 ).json( product[ 0 ][ 0 ] );
		} catch ( e ) {
			console.log( e );
		}
	}
}

module.exports = Product;