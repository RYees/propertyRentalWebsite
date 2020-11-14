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
                  name: Joi.string(),
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
