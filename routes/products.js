const express = require('express')
const router = express.Router()

const {getAllproducts, getAllProductsStatic} = require('../controllers/productsController')

router.route('/').get(getAllproducts)
router.route('/static').get(getAllProductsStatic)

module.exports = router
