const { pick } = require('lodash')

const commentModel = require('../models/comment-model')
const brokerModel = require('../models/broker-model')
const mongoose = require('mongoose')

exports.getAll = (req,res,next)=>{
    const comment = commentModel.find()
    .select("broker  _id    bro_comment ")
    .populate('broker',  'bname')
    .exec()
    .then(docs=>{
        res.status(200).json({
            comments: docs.map(doc =>{
               
                return {
                    id:doc._id,
                    bro_comment: doc.bro_comment,
                    broker: doc.broker
                    
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

exports.get =  (req, res) => {
    const comment = commentModel.findById(req.params.id)
    .select("broker  _id  bro_comment ")
    .populate('broker', 'bname')
    .exec()
    .then(comment=>{
        if(!comment){
            return res.status(404).json({
                message:"comment not found"
            });
        }
        res.status(200).json({
            comment:comment,
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

exports.create = (req, res,next) => {
  
     brokerModel.findById(req.body.brokerId)
    .then(broker => {
        if(!broker){
            return res.status(404).json({
                message:'Broker not found'
            });
        }
      const comment = new commentModel({
        _id:mongoose.Types.ObjectId(),
        bro_comment:req.body.bro_comment,
        broker:req.body.brokerId
             });
      return comment.save()
        
    })
    .then(result =>{
        console.log(result);
        res.status(201).json(result);
    })
   // res.json(comment)
   .catch(err=>{
    console.log(err);
    res.status(500).json({
        error:err
    });
});
res.status(201).json({
    message:'comment was created',
    //comment:comment
});
 

}

