const { formatPrice, date } = require('../../lib/utils');

const Category = require('../models/Category');
const Product = require('../models/Product');
const File = require('../models/File');


module.exports = {
    create(require, response) {
        Category.all()
            .then(function(results) {
                const categories = results.rows

                return response.render('products/create.njk', { categories });
            }).catch(function(err) {
                throw new Error(err)
            })
    },
    async post(require, response) {
        const keys = Object.keys(require.body)

        for (key of keys) {
            if (require.body[key] == "") {
                return response.send('Please, fill all the form!')
            }
        }

        if (require.files.length == 0) 
            return response.send('Please, send at least one file image')

        let results = await Product.create(require.body)
        const productId = results.rows[0].id

        const filesPromise = require.files.map(file => File.create({...file, product_id: productId}))
        await Promise.all(filesPromise)

        return response.redirect(`/products/${productId}`);
     
    },
    async show(require, response) {
        let results = await Product.find(require.params.id)
        const product = results.rows[0]

        if (!product) return response.send("Product not found!")

        const { day, hour, minutes, month } = date(product.updated_at)

        product.published = {
            day: `${day}/${month}`,
            hour: `${hour}:${minutes}h`,
        }

        product.oldPrice = formatPrice(product.old_price)
        product.price = formatPrice(product.price)

        return response.render('products/show', { product })
    },
    async edit(require, response) {
        let results = await Product.find(require.params.id)
        const product = results.rows[0]

        if (!product) return response.send('Product not found!')

        product.price = formatPrice(product.price)
        product.old_price = formatPrice(product.old_price)

        results = await Category.all()
        const categories = results.rows

        results = await Product.files(product.id)
        let files = results.rows
        files = files.map(file => ({
            ...file,
            src: `${require.protocol}://${require.headers.host}${file.path.replace('public', '')}`
        }))

        return response.render('products/edit.njk', { product, categories, files });
    },
    async put(require, response) {
        const keys = Object.keys(require.body)

        for (key of keys) {
            if (require.body[key] == "" && key != "removed_files") {
                return response.send('Please, fill all the form!')
            }
        }

        if (require.files.length != 0) {
            const newFilesPromise = require.files.map(file => File.create({...file, product_id: require.body.id}))
            await Promise.all(newFilesPromise)
        }

        if (require.body.removed_files) {
            const removedFiles = require.body.removed_files.split(",")
            const lastIndex = removedFiles.length - 1
            removedFiles.splice(lastIndex, 1)

            const removedFilesPromise = removedFiles.map(id => File.delete(id))
            await Promise.all(removedFilesPromise)
        }

        require.body.price = require.body.price.replace(/\D/g, "")

        if (require.body.old_price != require.body.price) {
            const oldProduct = await Product.find(require.body.id)

            require.body.old_price = oldProduct.rows[0].price
        }

        await Product.update(require.body)

        return response.redirect(`/products/${require.body.id}`)
    },
    async delete(require, response) {
        await Product.delete(require.body.id)

        return response.redirect('/products/create')
    }
}