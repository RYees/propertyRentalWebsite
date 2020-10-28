var jwt = require('jsonwebtoken');
const Joi = require('joi');

const { jwt_key } = require('../config/vars')
const brokerModel = require('../models/broker-model')


exports.login = async (req, res) => {
  //  const brr =  brokerModel.findOne({
    //    active: req.body.active
         
   // })
   // if(brr.req.body.active===true){
    try {
        const broker = await brokerModel.findOne({
            username: req.body.username
        }).populate({ path: 'roles', populate: {path: 'permissions'} });

        if(broker && await broker.verifyPassword(req.body.password)){
            // 1. map through all roles
            // 2. find each permissions inside the role
            // 3. combine permissions
            let permissions =  broker._doc.roles.reduce((prev, next) => {
                return [...prev, ...next.permissions.map(permission => permission.name)]
            },[])
            broker._doc.permissions = Array.from(new Set([...broker._doc.permissions.map(v => v.name), ...permissions ]))

            broker._doc.roles = broker._doc.roles.map(role => role.name)
           return res.json({
               ...broker._doc,
               token: jwt.sign( broker._doc, jwt_key, { algorithm: 'HS256' })
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
//}else{
  //  throw new Error("You are not still approved, Please contact the system administrator")
    
//}
exports.signup = async (req, res) => {

    try {
        const broker = await brokerModel.create(req.body)
        if(broker){
            broker = await brokerModel.insertOne(
            { roles: ['broAct']}
        )
      }
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


