const Joi = require('joi');


exports.adminFormRequest = schemaName => async (req,res,next) => {
    let validationObjects = {
        loginAdmin: () => 
            Joi.object({
                username: Joi.string()
                    .alphanum()
                    .min(3)
                    .max(30)
                    .required(),
            
                password: Joi.string().required()
                    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
            }),
        createAdmin: () => 
            Joi.object({
                firstName: Joi.string().required(),
                lastName: Joi.string()
                    .alphanum()
                    .min(3)
                    .max(30)
                    .required(),
                username: Joi.string()
                    .alphanum()
                    .min(3)
                    .max(30)
                    .required(),
                phone: Joi.string()
                    .alphanum()
                    .min(3)
                    .max(30)
                    .required(),
                address: Joi.string()
                    .alphanum()
                    .min(3)
                    .max(30)
                    .required(),
                image: Joi.string()
                    .alphanum()
                    .min(3)
                    .max(30)
                    .required(),
                company: Joi.string()
                    .alphanum()
                    .min(3)
                    .max(30)
                    .required(),
                about: Joi.string()
                    .alphanum()
                    .min(3)
                    .max(30)
                    .required(),
                rating: Joi.string()
                    .alphanum()
                    .min(3)
                    .max(30)
                    .required(),
                favorites: Joi.string()
                    .alphanum()
                    .min(3)
                    .max(30)
                    .required(),
                    username: Joi.string()
                    .alphanum()
                    .min(3)
                    .max(30)
                    .required(),
                password: Joi.string().required()
                    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
                                    
                email: Joi.string()
                    .email()
            })
    }
    try {
       const {error } =  validationObjects[schemaName]().validate(req.body)
       if(!error) {
           return next();
       }
       throw new Error(error)
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message
        })
    }

}
