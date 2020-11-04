const { pick } = require('lodash')
const mongoose = require('mongoose')
const roleModel = require('../models/role-model')
const brokerModel = require('../models/broker-model')
const propertyModel = require('../models/property-model')

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

exports.create = async (req, res) => {
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
            photo: req.file.path,
            roles:model._id
        });
        
        await broker.save()

        res.json(broker)
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message
        })
    }


}

exports.update = async (req, res) => {

    try {
        let broker = await brokerModel.findById(req.params.id)
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
        let broker = await brokerModel.findById(req.params.id)
        if (broker) {
            await brokerModel.remove({
                _id: broker._id
            })
            return res.json(broker)
        }
        throw new Error('User doesn\t exist')

    } catch (error) {

    }
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
                image: req.file.path,
                area_in_m2: req.body.area_in_m2,
                notes: req.body.notes,
                broker: req.user._id

            });
            
           property.save()
           return res.json(property)
            //console.log(req.file);
        } catch (error) {
            

        }
    }


exports.searchproperty = async (req, res) => {
    const query = req.query.prop_type || req.query.sub_city || req.query.city
        || req.query.area || req.query.firstName;

    propertyModel.find({
        $or: [
            { "prop_type": { $regex: query, $options: '$i' } },
            { "address.sub_city": { $regex: query, $options: '$i' } },
            { "address.city": { $regex: query, $options: '$i' } },
            { "address.area": { $regex: query, $options: '$i' } }
            // { "bname.firstName": { $regex: query, $options: '$i' } }

        ]
    }).select("prop_type  image")
        .then(data => {
            res.send(data);
        })

}

exports.updateproperty = async (req, res) => {

    try {
        let property = await propertyModel.findById(req.params.id)
        if (property) {
            property = await propertyModel.updateOne({ _id: property._id }, req.body)
            return res.json(property)
        }

        throw new Error('User dosen\'t exist')



    } catch (error) {
        res.status(400).json({
            error: true,
            message: error
        })
    }
}

exports.removeproperty = async (req, res) => {
    try {
        let property = await propertyModel.findById(req.params.id)
        if (property) {
            await propertyModel.remove({
                _id: property._id
            })
            return res.json(property)
        }
        throw new Error('User doesn\t exist')

    } catch (error) {

    }
}


