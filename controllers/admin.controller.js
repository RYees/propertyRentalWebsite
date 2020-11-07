const { pick } = require('lodash')
const commentModel = require('../models/comment-model')
const adminModel = require('../models/admin-model')
const brokerModel = require('../models/broker-model')
const propertyModel = require('../models/property-model')
const mongoose = require('mongoose')

exports.adminprofile = async (req, res) => {

    try {
        //console.log(req.params);
        const admin = await adminModel.findById(req.user._id)
        res.json(admin)
    } catch (error) {
        res.status(404).json({
            error: true,
            message: error.message
        })
    }

}

exports.profileupdate = async (req, res) => {

    try {
        let admin = await adminModel.findById(req.user._id)
        if (admin) {
            admin = await adminModel.updateOne({ _id: admin._id }, req.body)
            return res.json(admin)
        }

        throw new Error('Admin dosen\'t exist')



    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message
        })
    }
}

exports.profileremove = async (req, res) => {
    try {
        let admin = await adminModel.findById(req.user._id)
        if (admin) {
            await adminModel.remove({
                _id: admin._id
            })
            return res.json(admin)
        }
        throw new Error('Admin doesn\t exist')

    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message
        })
    }
}


exports.Allbrokers = async (req, res) => {

    try {

        let sort = {}
        if (req.query.sort) {
            sort[req.query.sort] = req.query.asc ? 1 : -1
        }

        let query = {}

        if (req.query.filter) {
            let filter = JSON.parse(req.query.filter);
            query = pick(filter, ['username', 'email', 'active'])

        }

        const options = {
            sort: Object.values(sort).length > 0 ? sort : {
                'created_at': -1
            },
            page: req.query.page || 1,
            limit: req.query.limit || 10,
            populate: { path: 'roles', populate: { path: 'permissions' } }
        }
        const brokers = await brokerModel.paginate(query, options)

        res.json(brokers)

    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message
        })
    }

}

exports.getbroker = async (req, res) => {

    try {
        console.log(req.params);
        const broker = await brokerModel.findById(req.params.id)
        res.json(broker)
    } catch (error) {
        res.status(404).json({
            error: true,
            message: error
        })
    }

}

exports.createbroker = async (req, res) => {
    try {
        console.log(req.file);
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
            photo: req.file.path

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

exports.updatebroker = async (req, res) => {

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

exports.removebroker = async (req, res) => {
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






exports.getAllpropertys = async (req, res) => {

    try {

        let sort = {}
        if (req.query.sort) {
            sort[req.query.sort] = req.query.asc ? 1 : -1
        }

        let query = {}

        if (req.query.filter) {
            let filter = JSON.parse(req.query.filter);

            query = pick(filter, ['bname', 'prop_type', 'active'])

        }

        const options = {
            sort: Object.values(sort).length > 0 ? sort : {
                'created_at': -1
            },
            page: req.query.page || 1,
            limit: req.query.limit || 10,
            populate: { path: 'broker' }
        }
        const propertys = await propertyModel.paginate(query, options)

        res.json(propertys)

    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message
        })
    }

}

exports.getproperty = (req, res) => {
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

exports.createproperty = (req, res) => {

    brokerModel.findById(req.body.brokerId)
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
            //console.log(req.file);
        })
        .then(result => {
            console.log(result);
            res.status(201).json(result);
        })
        // res.json(property)
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err.message
            });
        });
    res.status(201).json({
        message: 'property was created',
        //property:propertyj
    });


}

exports.updatestatus = async (req, res) => {

    try {
        let broker = await brokerModel.findById(req.params.id)
        if (broker) {
            broker = await brokerModel.updateOne({active:true})
            return res.json(broker)
        }

        throw new Error('Broker dosen\'t exist')



    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message
        })
    }
}

exports.put = async (req, res) => {
    //const broker = await brokerModel.findById(req.params.id)
    const broker = await brokerModel.findOne({
        _id: req.params.id , active:"false"
    })
       // console.log(foundUser.active);
         if (broker.active) {
            broker.update({_id: req.params.id}, {$set: {active: true}});
            return res.json(broker)
        } else {
           broker.update({_id: req.params.id}, {$set: {active: false}});
           return res.json(broker)
        }
    
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


exports.searchproperty = async (req, res, next) => {
    try {
        //const property = propertyModel.createIndexes({bname:"text"})
        //$match: { $text: { $search: "cake" } } }
        //let property = await propertyModel.aggregate([{$match: { $text: { $search: "for" } }} ,])
        //const property = await propertyModel.findById(req.params.id)
        const searchedFEILD = req.query.bname;
        await propertyModel.find({ bname: { $regex: searchedFEILD, $options: '$i' } })
            .then(data => {
                res.send(data);
                //res.json(property)
            });
    } catch (error) {
        res.status(404).json({
            error: true,
            message: error.message
        })
    }
}

exports.searchbroker = async (req, res, next) => {
    try {
        //const property = propertyModel.createIndexes({bname:"text"})
        //$match: { $text: { $search: "cake" } } }
        //let property = await propertyModel.aggregate([{$match: { $text: { $search: "for" } }} ,])
        //const property = await propertyModel.findById(req.params.id)
        const searchedFEILD = req.query.bname;
        await brokerModel.find({ bname: { $regex: searchedFEILD, $options: '$i' } })
            .then(data => {
                res.send(data);
                //res.json(property)
            });
    } catch (error) {
        res.status(404).json({
            error: true,
            message: error.message
        })
    }
}






exports.getAllcomments = async (req, res) => {

    try {

        let sort = {}
        if (req.query.sort) {
            sort[req.query.sort] = req.query.asc ? 1 : -1
        }

        let query = {}

        if (req.query.filter) {
            let filter = JSON.parse(req.query.filter);

            query = pick(filter, ['bro_comment', 'active'])

        }

        const options = {
            sort: Object.values(sort).length > 0 ? sort : {
                'created_at': -1
            },
            page: req.query.page || 1,
            limit: req.query.limit || 10,
            populate: { path: 'broker' }
        }
        const comments = await commentModel.paginate(query, options)

        res.json(comments)

    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message
        })
    }

}

exports.getcomment = (req, res) => {
    const comment = commentModel.findById(req.params.id)
        .select("broker  _id  bro_comment ")
        .populate('broker', 'bname')
        .exec()
        .then(comment => {
            if (!comment) {
                return res.status(404).json({
                    message: "comment not found"
                });
            }
            res.status(200).json({
                comment: comment,
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

exports.createcomment = (req, res, next) => {

    brokerModel.findById(req.body.brokerId)
        .then(broker => {
            if (!broker) {
                return res.status(404).json({
                    message: 'Broker not found'
                });
            }
            const comment = new commentModel({
                _id: mongoose.Types.ObjectId(),
                bro_comment: req.body.bro_comment,
                broker: req.body.brokerId
            });
            return comment.save()

        })
        .then(result => {
            console.log(result);
            res.status(201).json(result);
        })
        // res.json(comment)
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    res.status(201).json({
        message: 'comment was created',
        //comment:comment
    });


}

exports.updatecomment = async (req, res) => {

    try {
        let comment = await commentModel.findById(req.params.id)
        if (comment) {
            comment = await commentModel.updateOne({ _id: comment._id }, req.body)
            return res.json(comment)
        }

        throw new Error('comment dosen\'t exist')



    } catch (error) {
        res.status(400).json({
            error: true,
            message: error
        })
    }
}

exports.removecomment = async (req, res) => {
    try {
        let comment = await commentModel.findById(req.params.id)
        if (comment) {
            await commentModel.remove({
                _id: comment._id
            })
            return res.json(comment)
        }
        throw new Error('comment doesn\t exist')

    } catch (error) {

    }
}

exports.savefcm = async (req, res) => {
    try {
        const { fcm } = req.body
        const { id } = req.params
        let admin = await adminModel.findById(id)

        admin.fcm = fcm
        await admin.save()
        res.json({ message: "updated" })

    } catch {

    }
}