const Joi=require('joi');

//Define the schema using Joi
module.exports.campgroundSchema=Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(10),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description:Joi.string().required()
    }).required()
})
