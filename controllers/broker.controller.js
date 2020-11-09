const { pick } = require('lodash')
const mongoose = require('mongoose')
const roleModel = require('../models/role-model')
const brokerModel = require('../models/broker-model')
const propertyModel = require('../models/property-model')
//const { notification } = require('../config/pushNotification');


exports.profile = async (req, res) => {

    try {
        //console.log(req.params);
        const broker = await brokerModel.findById(req.user._id)
        res.json(broker)
    } catch (error) {
        res.status(404).json({
            error: true,
            message: error.message
        })
    }

}

exports.update = async (req, res) => {

    try {
        let broker = await brokerModel.findById(req.user._id)
        if (broker) {
            broker = await brokerModel.updateOne({ _id: broker._id }, req.body)
            return res.json(broker)
        }

        throw new Error('User dosen\'t exist')



    } catch (error) {
        res.status(400).json({
            error: true,
            message: error
        })
    }
}

exports.remove = async (req, res) => {
    try {
        let broker = await brokerModel.findById(req.user._id)
        if (broker) {
            await brokerModel.remove({
                _id: broker._id
            })
            return res.json(broker)
        }
        throw new Error('Broker doesn\t exist')

    } catch (error) {

    }
}

exports.getproperty = (req, res) => {
        const property = propertyModel.find({broker:req.user._id})
        .select("broker  _id  prop_type  price.amount  price.type  prop_contents.bedrooms  prop_contents.bathrooms  prop_contents.no_of_floors  prop_contents.amenities  address.sub_city  address.city address.area  address.coordinates  image  notes  area_in_m2")
        .populate('broker', 'username')
        .exec()
        .then(property => {
            if (!property) {
                return res.status(404).json({
                    message: "Property not found"
                });
            }
            res.status(200).json({
                property: property,
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
                //message: error.message
            });
        });
}


exports.createproperty = async (req, res, next) => {
try{
            const property = new propertyModel({
                _id: mongoose.Types.ObjectId(),
                prop_type: req.body.prop_type,
                address: [{
                    sub_city: req.body.sub_city,
                    city: req.body.city,
                    area: req.body.area,
                    coordinates: req.body.coordinates
                }],
                price: [{
                    amount: req.body.amount,
                    type: req.body.type
                }],
                prop_contents: [{
                    bedrooms: req.body.bedrooms,
                    bathrooms: req.body.bathrooms,
                    no_of_floors: req.body.no_of_floors,
                    amenities: req.body.amenities
                }],
                image:[{
                    image1:req.files[0] && req.files[0].path? req.files[0].path : '',
                    image2:req.files[1] && req.files[1].path? req.files[1].path : '',
                    image3:req.files[2] && req.files[2].path? req.files[2].path : '' 
                }],
                area_in_m2: req.body.area_in_m2,
                notes: req.body.notes,
                broker: req.user._id

            });
            
           property.save()
        // let admins = await adminModel.find({})
        // let fcmIds = await Promise.all(admins.map(admin => admin.fcm))
        // fcmIds = fcmIds.filter(el => el != null)
        // let notifiation_obj = {
        //     title: "something",
        //     body: "something"
        // }
        // var message = { tokens: fcmIds, notification: notifiation_obj }
        // notification(message)

           return res.json(property)
        }catch (error) {
            res.status(400).json({ 
                error: true,
                message: error.message
            })
        }
    }


exports.searchproperty = async (req, res) => {
    try{
    const query = req.query.prop_type || req.query.sub_city || req.query.city
        || req.query.area || req.query.firstName;

    propertyModel.find({
        $or: [
            { "prop_type": { $regex: query, $options: '$i' } },
            { "address.sub_city": { $regex: query, $options: '$i' } },
            { "address.city": { $regex: query, $options: '$i' } },
            { "address.area": { $regex: query, $options: '$i' } }
            
        ]
    }).select("prop_type  image")
        // .then(data => {
        //     res.send(data);
        // })
    }catch (error) {
        res.status(400).json({ 
            error: true,
            message: error.message
        })
    }
}

exports.updateproperty = async (req, res) => {

    try {
        let property = await propertyModel.findById({_id: req.params.id , broker: req.user._id})
        if (property) {
            property = await propertyModel.updateOne({broker: require.user._id})
            return res.json(property)
        }

        throw new Error('Property dosen\'t exist')

    } catch (error) {
        res.status(400).json({ 
            error: true,
            message: error.message
        })
    }
}

exports.removeproperty = async (req, res) => {
    try {
        let property = await propertyModel.findById({_id: req.params.id, broker: req.user._id})
        if (property) {
            const user = this
            await propertyModel.remove({broker: req.user._id})
            return res.json(property)
        }
        throw new Error('Property doesn\t exist')

    } catch (error) {
        res.status(400).json({ 
            error: true,
            message: error.message
        })
    }
}

exports.changestatus = async (req, res) => {
    try {
        let property = await propertyModel.findById(req.params.id)
        if (property) {
            property = await propertyModel.updateOne({ _id: property._id }, { $set: { active: "false" } });
            return res.json(property)
        } 
        throw new Error('Update Unsuccessfull')

    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message
        })
    }
}

