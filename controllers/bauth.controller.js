var jwt = require('jsonwebtoken');
const Joi = require('joi');
const { notification } = require('../config/pushNotification');
const { jwt_key } = require('../config/vars')
const mongoose = require('mongoose')
const roleModel = require('../models/role-model')
const brokerModel = require('../models/broker-model')
const adminModel = require('../models/admin-model')


exports.login = async (req, res) => {

    try {
            const broker = await brokerModel.findOne({
            username: req.body.username , active:"true"
        }).populate({ path: 'roles', populate: { path: 'permissions' } });

        if (broker && await broker.verifyPassword(req.body.password)) {
            
            let permissions = broker._doc.roles.reduce((prev, next) => {
                return [...prev, ...next.permissions.map(permission => permission.name)]
            }, [])
            broker._doc.permissions = Array.from(new Set([...broker._doc.permissions.map(v => v.name), ...permissions]))

            broker._doc.roles = broker._doc.roles.map(role => role.name)
            return res.json({
                ...broker._doc,
                token: jwt.sign(broker._doc, jwt_key, { algorithm: 'HS256' })
            })
        }

        throw new Error("Username/password doesn't exist or Please Contact Your Administrator to activate your account")
    //}
    } catch (error) {

        res.status(400).json({
            error: true,
            message: error.message
        })
    }

}
exports.signup = async (req, res) => {
    try {
      
        let role = await roleModel.findOne({name:"broAct"})
            const broker = new brokerModel({
            _id: new mongoose.Types.ObjectId(),
            bname: [{
                firstName: req.body.firstName,
                lastName: req.body.lastName
            }],
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
            image: [{
                photo:req.files[0] && req.files[0].path? req.files[0].path : '',
                slip:req.files[1] && req.files[1].path? req.files[1].path : '',
            }],
            address: [{
                sub_city: req.body.sub_city,
                city: req.body.city,
                area: req.body.area
            }],
            roles:role._id,
        });
        
        await broker.save()
        let admins = await adminModel.find({})
        let fcmIds = await Promise.all(admins.map(admin => admin.fcm))
        fcmIds = fcmIds.filter(el => el != null)
        let notifiation_obj = {
            title: "something",
            body: "something"
        }
        var message = { tokens: fcmIds, notification: notifiation_obj }
        notification(message)
        res.json(broker)

        } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message
        })
    }


}

exports.logout = async (req, res) => {
    try {
       res.redirect( "/property" );
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message
        })
    }

}


