const { pick } = require('lodash')
const mongoose = require('mongoose')
const brokerModel = require('../models/broker-model')

exports.get = async (req, res) => {

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

exports.create = async (req, res) => {
    try {
        //console.log(req.file);
        const broker = new brokerModel({
             _id: new mongoose.Types.ObjectId(),
             bname:[{
                firstName:req.body.firstName,
                lastName:req.body.lastName
            }],
             username:req.body.username,
             email:req.body.email,
             password: req.body.password ,
             phone: req.body.phone ,
             address: [{
                sub_city:req.body.sub_city,
                city:req.body.city,
                area:req.body.area
             }] ,            
             photo : req.file.path,
             
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
        if(broker) {
            broker = await brokerModel.updateOne({_id: broker._id}, req.body)
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
        if(broker) {
            await brokerModel.remove({
                _id: broker._id
            })
            return res.json(broker)
        }
        throw new Error('User doesn\t exist')

    } catch (error) {
        
    }
}
