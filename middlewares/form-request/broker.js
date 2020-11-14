const Joi = require('joi');

exports.brokerFormRequest = schemaName => async (req, res, next) => {
    let validationObjects = {
        createBroker: () =>
            Joi.object({
                firstName: Joi.string(),
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
                phone: Joi.number()
                    .integer()
                    .min(0000000000)
                    .max(1000000000)
                    .required(),
                sub_city: Joi.string()
                    .alphanum()
                    .min(3)
                    .max(30)
                    .required(),
                city: Joi.string()
                    .alphanum()
                    .min(3)
                    .max(30)
                    .required(),
                area: Joi.string()
                    .alphanum()
                    .min(3)
                    .max(30)
                    .required(),
                image: Joi.string(),
                company: Joi.string(),
                about: Joi.string(),
                rating: Joi.string(),
                favorites: Joi.string(),
                username: Joi.string()
                    .alphanum()
                    .min(5)
                    .max(30)
                    .required(),
                password: Joi.string().required()
                    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

                email: Joi.string()
                    //.pattern(new RegExp('^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$')),
                    .email()
            }),
        loginBroker: () =>
            Joi.object({
                username: Joi.string()
                    .alphanum()
                    .min(3)
                    .max(30)
                    .required(),

                password: Joi.string().required()
                    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
            }),
    }
    try {
        const { error } = validationObjects[schemaName]().validate(req.body)
        if (!error) {
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
