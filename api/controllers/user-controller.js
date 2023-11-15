const userModel = require('../models/UserModel')
const { validationResult } = require('express-validator')
const handleError = require('../models/http-error')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/UserModel')
const Listing = require('../models/ListingModel')
async function signup(req, res, next) {

    const error = validationResult(req);
    if (!error.isEmpty()) {

        return next(handleError("Invalid input data", 422))
    }
    const { username, email, password } = req.body;

    let exsistingUser;
    try {
        exsistingUser = await userModel.findOne({ email: email })

    }
    catch (err) {
        const error = handleError("Signing up failed", 500)
        return next(error)
    }
    if (exsistingUser) {
        const error = handleError('user exists already, try to log in', 422)
        return next(error)
    }
    let hashedPassword
    try {
        hashedPassword = await bcryptjs.hash(password, 10)
    }
    catch (err) {
        const error = handleError("Signing up failed", 500)
        return next(error)
    }
    const createdUser = new userModel({
        email, password: hashedPassword, username: username
    })
    try {
        await createdUser.save()
    }
    catch (err) {
        const error = handleError("Signing up failed", 500)
        return next(error)
    }

    res.status(201).json({
        email: createdUser.email, id: createdUser.id, success: true, message: 'User created'
    })
}
async function singin(req, res, next) {
    const error = validationResult(req)
    if (!error.isEmpty()) {
        return (next(handleError("Invalid username or password", 422)))
    }

    const { email, password } = req.body
    try {
        const validUser = await userModel.findOne({ email: email })
        if (!validUser) {
            return next(handleError("Invalid username or password", 404))
        }
        const validPassord = bcryptjs.compareSync(password, validUser.password)

        if (!validPassord) {
            return next(handleError("Invalid username or password", 404))
        }
        const token = jwt.sign({ id: validUser.id, email: validUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.cookie('access_token', token, { httpOnly: true }).status(200).json({ username: validUser.username, id: validUser.id, email: validUser.email, avatar: validUser.avatar })

    } catch (error) {
        return next(handleError("Signing in faliled try again later", 500))
    }
}
async function google(req, res, next) {
    try {
        const user = await userModel.findOne({ email: req.body.email })
        if (user) {
            const token = await jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" })
            res.cookie('access_token', token, { httpOnly: true }).status(200).json({ username: user.username, id: user.id, email: user.email, avatar: user.avatar })
        }
        else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10)
            const newUser = new User({
                username: req.body.username.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4),
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo
            })
            await newUser.save()

            const token = await jwt.sign({ username: newUser.username, id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: "1h" })
            res.cookie('access_token', token, { httpOnly: true }).status(200).json({ id: newUser.id, email: newUser.email, avatar: newUser.avatar })
        }
    } catch (error) {
        console.log(error)
        return next(handleError("Signing in failed,try again later", 500))
    }
}
async function update(req, res, next) {
    if (req.user.id !== req.params.id) {
        return next(handleError("Unauthrized User", 401))
    }
    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }
        const updatedUser = await userModel.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar
            }
        }, { new: true })
        res.json({ id: updatedUser.id, email: updatedUser.email, avatar: updatedUser.avatar })
    } catch (error) {
        return next('Updating data failed, please try again later', 500)
    }
}
async function deleteUser(req, res, next) {
    if (req.user.id !== req.params.id) {
        return next(handleError("Unauthrized User", 401))
    }
    try {
        await userModel.findByIdAndDelete(req.params.id)
        res.clearCookie('access_token')
        res.status(200).json('User deleted successfully')
    } catch (error) {
        return next(handleError('Could not delete user', 500))
    }
}

async function signout(req, res, next) {
    try {
        res.clearCookie('access_token')
        res.status(200).json("User has logged out successfully")
    } catch (error) {
        return next(handleError('Could not sign out'), 500)
    }
}

async function getUserListing(req, res, next) {
    if(req.user.id !== req.params.id){
        return handleError("Unauthrized user", 401)
    }
    try {
        const listings = await Listing.find({ userRef: req.params.id })
        res.json(listings.map((listing)=>listing.toObject({getters:true})))
    } catch (error) {
        return next(handleError("Getting user listings failed, tray again later", 500))
    }
}
async function getUser(req,res,next){
    
    try {
        const user = await User.findById(req.params.id,'-password')
        if(!user) return next(handleError('User not found', 422))
    res.json(user)
    } catch (error) {
      return next(handleError('Getting user data failed', 500))
    }
}
exports.signup = signup
exports.singin = singin
exports.google = google
exports.update = update
exports.deleteUser = deleteUser
exports.signout = signout
exports.getUserListing = getUserListing
exports.getUser = getUser