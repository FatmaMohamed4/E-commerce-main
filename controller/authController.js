const jwt  = require('jsonwebtoken');
const User=require('../model/userModel');
const {promisify} =require ('util')
const crypto =require('crypto');
const { sendToEmail } = require('../utilites/Email.js');
const catchError = require('../utilites/catchError.js');
const AppError = require('../utilites/appError.js');

// const {sendToEmail } = require('../utilities/OTP/Email.js');



exports.register=catchError(async (req,res,next)=>{
    
    const user = await User.create(req.body)
    if (user){
        return next(new AppError('User is exists' ,500))
    }
        res.status(201).json({
            status:true,
            message:"Sign up Successfully", 
        })
})


exports.logIn = catchError(async (req, res,next) => {
    
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        //
            if (!user || !await user.correctPassword(password, user.password)) {
                return next(new AppError('Invalid email or password',401))
            } 
            let token = jwt.sign({ userId: user._id }, 'E-commerce App# first App',{expiresIn:"90d"});  
           
            res.status(200).json({
                status: true,
                message: "Log in Successfully",
                token: token,
            });
})



exports.forgotPassword =catchError(async(req, res)=> {
    
    const user = await User.findOne({email:req.body.email})
    if (!user){
        return next(new AppError('User not found',404))
    }

    const otp = await user.generateOtp()
    await user.save({ validateBeforeSave: false });
    sendToEmail(req.body.email,otp)

    res.status(200).json({
        status:true,
        meesage:"otp generated and send to your email"
    })

})

exports.verifyOTP=catchError(async(req,res, next)=>{
    
        const otp=crypto.createHash('sha256').update(req.body.otp).digest('hex');;
        const user = await User.findOne({otp:otp,otpExpires:{ $gt: Date.now() },})
        if(!user){
            return next(new AppError('User not found', 404));  
        }
        const token = jwt.sign({ userId: user._id }, 'E-commerce App# first App',{expiresIn:"90d"});  
        res.status(200).json({
            status:true,
            messge:"Comfirmed OTP",
            token
        })
    }  

)




// exports.verifyOTP = async (req, res, next) => {
//     try {
//         const otp = crypto.createHash('sha256').update(req.body.otp).digest('hex');
//         const user = await User.findOne({ resetPasswordOtp: otp, otpExpires: { $gt: Date.now() } });

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const token = jwt.sign({ userId: user._id }, 'E-commerce App# first App', { expiresIn: '90d' });

//         res.status(200).json({
//             status: true,
//             message: "Confirmed OTP",
//             token
//         });
//     } catch (err) {
//         // Handle any unexpected errors
//         console.error('Error verifying OTP:', err);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };


exports.resetPassword = catchError(async (req, res,next) => {
    
    const user = req.user;
    if (!user) {
        return next(new AppError('TRY again',404))
    }

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    
    await user.save({ validateBeforeSave: true });

    res.status(200).json({
        status: true,
        user
    });

}
)

