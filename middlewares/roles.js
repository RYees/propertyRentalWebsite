const migration = require('../config/migrations');
exports.roles = async(req,res,next)=>{
    
    try {
        const broker = await brokerModel.findOne({
        roles: req.body.roles
    })
    //.populate({ path: 'roles', populate: {path: 'permissions'} });
    //broker._doc.roles = broker._doc.roles.map(role => role.name)
         if(broker){
             broker.insertOne(
            { roles: ['broAct']}
         )weg
       }
             throw new Error('you dont have broker role')
  

        
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error
        })
    }
}



