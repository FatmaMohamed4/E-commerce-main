exports.protect= async(req,res,next) =>{
    //token from user 
    let token ;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer") ){
        token=req.headers.authorization.split(" ")[1]
    }
    console.log(token)
    if(!token){
        return next(new AppError ('please log in', 401))
    }
    
    
    //verfiy token with secret key
    const decodedToken = await promisify (jwt.verify)(token,'E-commerce App# first App') //return id
    console.log(decodedToken)
    //check user (of token) is exist
    const currentUser =await User.findById(decodedToken.userId)
    
    
      if(!currentUser){
        return next (new AppError('User not found',404))
      }
    
    
      req.user=currentUser
    next()
    }
    
    exports.restrictTo=()=>{ 
        return (req,res,next)=>{
            if(!req.user.isAdmin){
               return next(new AppError ('Not Allowed to do this',401))
            }
            next();
        }
    
    }
    