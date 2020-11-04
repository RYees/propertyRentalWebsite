const { pick } = require('lodash')

const propertyModel = require('../models/property-model')
const brokerModel = require('../models/broker-model')
const mongoose = require('mongoose')


exports.getAll = (req, res, next) => {
    const property = propertyModel.find()
        .select("broker  _id  bname  prop_type  address  price image ")
        //.populate('broker')
        .populate('broker', 'bname')
        .exec()
        .then(docs => {//res.status(200).json(docs);})
            res.status(200).json({
                propertys: docs.map(doc => {
                    //console.log(propertyModels)  ;
                    return {
                        id: doc._id,
                        broker: doc.broker,
                        bname: doc.bname,
                        prop_type: doc.prop_type,
                        address: doc.address,
                        price: doc.price,
                        image: doc.image
                    }
                })
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
exports.get = (req, res) => {
    const property = propertyModel.findById(req.params.id)
        .select("broker  _id  bname  prop_type  address  price ")
        .populate('broker', 'bname')
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

exports.create = async (req, res, next) => {

    await brokerModel.findById(req.body.brokerId)
        .then(broker => {
            if (!broker) {
                return res.status(404).json({
                    message: 'Broker not found'
                });
            }
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
                broker: req.body.brokerId

            });
            return property.save()
            console.log(req.file);
        })
        .then(result => {
            console.log(result);
            res.status(201).json(result);
        })
        // res.json(property)
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    res.status(201).json({
        message: 'property was created',
        //property:propertyj
    });


}
exports.search = async (req, res) => {
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

exports.update = async (req, res) => {

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

exports.remove = async (req, res) => {
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

