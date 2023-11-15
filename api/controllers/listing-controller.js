const { validationResult } = require('express-validator')
const ListingModel = require('../models/ListingModel.js')
const handleError = require('../models/http-error.js')
async function createListing(req, res, next) {
    const error = validationResult(req)
    if (!error.isEmpty()) return next(handleError('Invalid input data, try again', 422))
    try {
        const listing = await ListingModel.create(req.body)
        res.status(201).json(listing)
    } catch (error) {
        return next(handleError('Creating Listing failed, please try again', 500))
    }
}
async function deleteListing(req, res, next) {
    try {
        const listing = await ListingModel.findById(req.params.id)
        if (!listing) return next(handleError('Listing Not Found', 422))
        if (listing.userRef !== req.user.id) return next(handleError("Unauthrized user", 401))
        await ListingModel.findByIdAndDelete(req.params.id)
        res.status(200).json('Listing has been deleted successfully')
    } catch (error) {
        return next(handleError('Deleteing listing failed, try again later', 500))
    }
}
async function updateListing(req, res, next) {
    try {
        const listing = await ListingModel.findById(req.params.id)
        if (!listing) return next(handleError("Listing not found", 422))
        if (listing.userRef !== req.user.id) return next(handleError("Unauthrized user ", 401))
        const updatedListing = await ListingModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.status(200).json(updatedListing)
    } catch (error) {
        return next(handleError("Updating listing failed, try again later", 500))
    }
}

async function getListing(req, res, next) {
    try {
        const listing = await ListingModel.findById(req.params.id)
        if (!listing) return next(handleError("Listing not found", 422))
        res.json(listing)
    } catch (error) {
        return next(handleError("Failed to get, try again later", 500))
    }
}
async function search(req,res,next){
    try {
        const limit = parseInt(req.query.limit)||10
        const startIndex = parseInt(req.query.startIndex)||0
        let offer = req.query.offer 
        if(offer ==undefined || offer=='false'){
            offer = {$in:[false,true]}
        }

        let furnished = req.query.furnished
        if(furnished ===undefined ||furnished =='false'){
            furnished = {$in:[false, true]}
        }

        let parking = req.query.parking
        if(parking === undefined ||parking =='false'){
            parking = {$in:[false, true]}
        }
        let type = req.query.type
        if(type ===undefined ||type =='all'){
            type = {$in:['rent', 'sale']}
        }
        const searchTerm = req.query.searchTerm ||''
        const sort = req.query.sort ||'createdAt'
        const order = req.query.order|| 'desc'
        const listings = await ListingModel.find({
            name:{$regex:searchTerm,$options:'i'},offer,
            furnished,parking,type
        }).sort({
            [sort]:order
        }).skip(startIndex).limit(limit)
        res.json(listings.map((listing)=>(listing.toObject({getters:true}))))
    } catch (error) {
        return(next(handleError("Seaching Operation failed, try again",500)))
    }
}
module.exports.deleteListing = deleteListing
module.exports.createListing = createListing
module.exports.updateListing = updateListing
module.exports.getListing = getListing
exports.search = search