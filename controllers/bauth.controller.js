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
            username: req.body.username
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
        console.log(req.file);
      let model= new roleModel({_id: new mongoose.Types.ObjectId('5f95908700c2d06190da0e33')})
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
            address: [{
                sub_city: req.body.sub_city,
                city: req.body.city,
                area: req.body.area
            }],
           // photo: req.file.path,
            roles:model._id,
        });
        
        await broker.save()
        //console.log("1")
        let admins = await adminModel.find({})
        //console.log("2")
        let fcmIds = await Promise.all(admins.map(admin => admin.fcm))
        //console.log(fcmIds)
        fcmIds = fcmIds.filter(el => el != null)
        //console.log("3")
        let notifiation_obj = {
            title: "something",
            body: "something"
        }
        var message = { tokens: fcmIds, notification: notifiation_obj }
        notification(message)
        //console.log("4")
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

        const broker = await brokerModel.create(req.body)
        // clean up
        res.json(broker)
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error
        })
    }

}


