class HttpError extends Error{
    constructor(message, errorCode){
        super(message)
        this.errorCode = errorCode
    }
}
function handleError(mesaage, errorcode){
    const error = new HttpError(mesaage, errorcode);
    return error
}   

module.exports= handleError