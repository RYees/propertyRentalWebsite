var jwt = require('jsonwebtoken');
const Joi = require('joi');
const { jwt_key } = require('../config/vars')
const adminModel = require('../models/admin-model')


exports.login = async (req, res) => {
    try {
        const admin = await adminModel.findOne({
            username: req.body.username
        }).populate({ path: 'roles', populate: { path: 'permissions' } });

        if (admin && await admin.verifyPassword(req.body.password)) {
            let permissions = admin._doc.roles.reduce((prev, next) => {
                return [...prev, ...next.permissions.map(permission => permission.name)]
            }, [])
            admin._doc.permissions = Array.from(new Set([...admin._doc.permissions.map(v => v.name), ...permissions]))

            admin._doc.roles = admin._doc.roles.map(role => role.name)
            return res.json({
                ...admin._doc,
                token: jwt.sign(admin._doc, jwt_key, { algorithm: 'HS256' })
            })
        }

        throw new Error("Username/password not found")

    } catch (error) {

        res.status(400).json({
            error: true,
            message: error.message
        })
    }

}

exports.signup = async (req, res) => {

    try {
        const admin = await adminModel.create(req.body)
        res.json(admin)
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message
        })
    }

}

exports.logout = async (req, res) => {
    try {

        const admin = await adminModel.create(req.body)
        // clean up
        res.json(admin)
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error
        })
    }

}


