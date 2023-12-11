const { Router } = require("express");
const { check } = require('express-validator')
const userController = require('../controllers/user-controller.js');
const verifyToken = require("../util/verifyUser.js");
const router = Router()
router.post('/sign-up', [
            check('username').isLength({ min: 4 }),
            check('password').isLength({ min: 6 }),
            check('email').normalizeEmail().isEmail()
                    ] ,
    userController.signup)
    router.post('/activate',userController.activation)
router.post('/sign-in',[check('email').normalizeEmail().isEmail(),
                        check('password').isLength({min:6})],userController.singin)
router.post('/google',userController.google)
router.post('/update/:id',verifyToken,userController.update)
router.delete('/delete/:id',verifyToken,userController.deleteUser)
router.get('/signout',userController.signout)
router.get('/listings/:id', verifyToken,userController.getUserListing)
router.get('/:id', verifyToken, userController.getUser)

module.exports = router