const jwt = require('jsonwebtoken');
const verifyToken = (req,res, next)=>{

    const token = req.headers.authorization;
      
    if(!token){
        return res.status(401).json({message:'Missing user please Login '});

    }
  
    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err,decoded)=>{
        
        if (err){
            if(err.name==="TokenExpiredError"){
                return res.status(401).json({message: "Token Expired,Please login again"})
            }
            return res.status(401).json({message:"Invalid token"});
        }
        req.userId= decoded.userId;
        next();
    })
}

module.exports=verifyToken;