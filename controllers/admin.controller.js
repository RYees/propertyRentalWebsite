const { pick } = require('lodash')
const commentModel = require('../models/comment-model')
const adminModel = require('../models/admin-model')
const brokerModel = require('../models/broker-model')
const propertyModel = require('../models/property-model')
const mongoose = require('mongoose')


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

        const broker = await brokerModel.create(req.body)
        /*/_id:mongoose.Types.ObjectId(),
        bname:req.body.bname ,
        username:req.body.username,
        email:req.body.email,
        password: req.body.password ,
        phone: req.body.phone ,
        address: req.body.address ,
        photo : req.file.path,
        broker:req.body.brokerId/*/
        res.json(broker)
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error
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

exports.createproperty = (req, res, next) => {

    brokerModel.findById(req.body.brokerId)
        .then(broker => {
            if (!broker) {
                return res.status(404).json({
                    message: 'Broker not found'
                });
            }
            const property = new propertyModel({
                _id: mongoose.Types.ObjectId(),
                bname: req.body.bname,
                prop_type: req.body.prop_type,
                address: req.body.address,
                price: req.body.price,
                image: req.file.path,
                broker: req.body.brokerId
            });
            return property.save()

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
        //property:property
    });


}

exports.updatestatus = async (req, res) => {

    try {
        let broker = await brokerModel.findById(req.params.id)
        if (broker) {
            broker = await brokerModel.updateOne({ _id: broker._id, active: broker.active },)
            return res.json(broker)
        }

        throw new Error('Broker dosen\'t exist')



    } catch (error) {
        res.status(400).json({
            error: true,
            message: error
        })
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