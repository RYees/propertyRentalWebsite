const Joi = require('joi');

exports.brokerFormRequest = schemaName => async (req,res,next) => {
    let validationObjects = {
        createBroker: () => 
            Joi.object({
                firstName: Joi.string()
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
            }),
        updateBroker: () => 
            Joi.object({
                email: Joi.string()
                    .alphanum()
                    .min(3)
                    .max(30)
                    .required(),
            }),
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
