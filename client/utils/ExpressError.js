/**
     * @param {function} func the async function.
     * @return {Promise} Promise representing the eventual completion of func and error catched
*/
class ExpressError extends Error{
    constructor(message,statusCode){
        super();
        this.message=message;
        this.statusCode=statusCode;
    }
}

module.exports=ExpressError;