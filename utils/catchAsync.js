/**
     * @param  {function} func the async function.
     * @return {Promise} Promise representing the eventual completion of func and error catched
*/
module.exports=func=>{
    return (req,res,next)=>{
        func(req,res,next).catch(next);
    }
}