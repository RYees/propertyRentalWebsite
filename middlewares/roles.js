const migration = require('../config/migrations');
exports.roles = async(req,res,next)=>{
    
    try {
        const broker = await brokerModel.findOne({
        roles: req.body.roles
    })
  
         if(broker){
             broker.insertOne(
            { roles: ['broAct']}
         )
       }
             throw new Error('you dont have broker role')
  

        
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error
        })
    }
}



