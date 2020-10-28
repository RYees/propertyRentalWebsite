const nodeMailer = require('nodeMailer');
let transporter = nodeMailer.createTransport({
    service:'gmail',
    auth:{
        user: "youremail",
        pass:"yourpassword"
    }
})

exports.forgetPassword=async(req,res)=>{
    try{
        let user = await userModel.findOne({
            email:req.body.email
        });
        if(!user){
            throw new Error("User doesnt exist");
        }
        var resetCode = generate random
         number here
             let mailOption = {
                 from: "youremail",
                 to:req.body.email,
                 subject:"Password Reset Link",
                 html:`
                 <h2>Please enter on code below to reset your password </h2>
                 <h2>$(resetCode)</h2>
                 `
             }
             await user.updateOne({reset_link:resetCode});
             transporter.sendMail(mailOption,function (err,data) {
                 if(err){
                     throw new Error("something went wrong")

                 }else{
                     res.status(200).send("password reset link s sent to your email successfully...now you can reset your password")
                 }
                 
             })//reset link field 

    }catch(error){
        res.status(400).json({
            error:true,
            message:error.message
        })
    }
}

exports.resetPassword = async(req,res)=>{
    const {resetLink,newPass} = req.body
    try{
        if(resetLink){
            const user = await userModel.findOne({
                reset_link:resetLink
            });
            if(!user){
                throw new Error("User doesn't eixst")
            }
            user.password = newPass
            user.reset_link=""
            await user.save()
            return res.status(200).json(user)
        }
        else{
            throw new Error("Reset Link can't be null")
        }

    }catch(error){
        res.status(400).json({
            error:true,
            message:error.message
        })
    }
}n