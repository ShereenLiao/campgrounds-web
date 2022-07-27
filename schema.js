const Joi=require('joi');

//Define the campground schema using Joi
module.exports.campgroundSchema=Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(10),
        // image: Joi.string().required(),
        location: Joi.string().required(),
        description:Joi.string().required()
    }).required()
})


//Define the review schema using Joi
module.exports.reviewSchema=Joi.object({
    review: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5),
    }).required()
})