 const jwt = require("jsonwebtoken")
 async function createActivationToken(user) {
    return await jwt.sign(user, process.env.ACTIVATION_SERCET, {
        expiresIn: '5m'
    })
}
module.exports = createActivationToken