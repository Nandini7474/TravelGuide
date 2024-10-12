const Joi = require("Joi");

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title:Joi.string().required(),
        descripton:Joi.string().required() 
    }).required(),
});

//form validation server
module.exports.reviewSchema =Joi.object({
    review : Joi.object({
        title:Joi.string().required(),
        descripton:Joi.string().required() 
    }).required(),
});