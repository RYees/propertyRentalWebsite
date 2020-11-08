const { pick } = require('lodash')

const propertyModel = require('../models/property-model')
const brokerModel = require('../models/broker-model')
const mongoose = require('mongoose')


exports.getAll = (req, res, next) => {
    const property = propertyModel.find()
        .select("broker  _id  bname  prop_type  address  price image ")
        .populate('broker', 'bname')
        .exec()
        .then(docs => {
            res.status(200).json({
                propertys: docs.map(doc => {
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


