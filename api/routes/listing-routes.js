const {Router} = require('express')
const {check} = require('express-validator')
const listingController = require('../controllers/listing-controller.js')
const verifyToken = require('../util/verifyUser.js')

const router = Router()

router.post('/create',verifyToken,[
    check('name').not().isEmpty(),
    check('description').not().isEmpty(),
    check('address').not().isEmpty(),
    check('regularPrice').not().isEmpty(),
    check('discountPrice').not().isEmpty(),
    check('bathrooms').not().isEmpty(),
    check('furnished').not().isEmpty(),
    check('parking').not().isEmpty(),
    check('type').not().isEmpty(),
    check('offer').not().isEmpty(),
    check('imageUrls').not().isEmpty(),
    check('userRef').not().isEmpty(),
    check('bedrooms').isNumeric(),], listingController.createListing )

router.delete('/delete/:id', verifyToken, listingController.deleteListing)
router.post('/update/:id', verifyToken, listingController.updateListing)
router.get('/get/:id', listingController.getListing)
router.get('/search', listingController.search)
module.exports = router