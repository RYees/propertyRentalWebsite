const { pick } = require('lodash')
const adminModel = require('../models/admin-model')
const brokerModel = require('../models/broker-model')
const propertyModel = require('../models/property-model')
const mongoose = require('mongoose')

exports.adminprofile = async (req, res) => {

    try {
        const admin = await adminModel.findById(req.user._id)
        .select("name username email ")
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
            sort[req.query.sort] = req.query.asc ? 1 : 1
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

exports.getproperty = async (req, res) => {
    try{
    const property = await propertyModel.findById(req.params.id)
        .select("broker  prop_type  address.sub_city  address.city  address.area  price.amount  price.type  prop_contents.amenities  prop_contents.bedrooms  prop_contents.bathrooms  prop_contents.no_of_floors  image.image1  image.image2  image.image3  area_in_m2")
        .populate('broker', 'bname')
        res.json(property)
        
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message
        })
    }
}


exports.updateBstatus = async (req, res) => {
    try {
        let broker = await brokerModel.findById(req.params.id)
        if (broker) {
            broker = await brokerModel.updateOne({ _id: broker._id }, { $set: { active: "true" } });
            return res.json(broker)
        } 
        throw new Error('Update Unsuccessfull')

    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message
        })
    }
}
exports.updatePstatus = async (req, res) => {
    try {
        let property = await propertyModel.findById(req.params.id)
        if (property) {
            property = await propertyModel.updateOne({ _id: property._id }, { $set: { active: "true" } });
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