const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
    const products = await Product.find({ price: { $gt:30 }})
        .sort('price')
        .select('name price') 
        //.limit(10)
        //.slip(5)    
    res.status(200).json({products, nbHits: products.length})
}

const getAllproducts = async (req, res) => {
    const { featured, company, name, sort, fields, numericFilters} = req.query
    const queryObject ={}

    if (featured){
        queryObject.featured = featured === 'true' ? true: false
    }

    if (company){
        queryObject.company = company
    }

    if (name){
        queryObject.name = { $regex: name, $options: 'i'}
    }

    if (numericFilters){
        const operatorMap = {
            '>':'$gt', // Greater Than
            '>=':'$gte', // Greater Than Or Equal
            '=':'$eq', // Equal
            '<':'$lt', // Less Than
            '<=':'$lte' // Less Than Or Equal
        }
        const regEx = /\b(<|>|>=|=|<|<=)\b/g   // Regular Expression
        let filters = numericFilters.replace(
            regEx,
            (match) => `-${operatorMap[match]}-`
        )
        const options = ['price', 'rating'];
        filters = filters.split(',').forEach((item) =>{
            const [field, operator, value] = item.split('-')
            if (options.includes(field)){
                queryObject[field] = {[operator]: Number(value)}
            }
        })
    }

    console.log(queryObject)
    let result = Product.find(queryObject)

    //sort
    if (sort){
        const sortList = sort.split(',').join(' ') // Splitting string into an array
        result = result.sort(sortList)

    } else{
        result = result.sort('createAt')
    }

    if (fields){
        const fieldList = fields.split(',').join(' ') // Splitting string into an array
        result = result.select(fieldList)    
    }

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit 
    
    result = result.skip(skip).limit(limit)

    const products = await result
    res.status(200).json({products, nbHits: products.length})
}

module.exports = {
    getAllProductsStatic,
    getAllproducts
}