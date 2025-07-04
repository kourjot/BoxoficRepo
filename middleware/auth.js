import jwt from "jsonwebtoken"
import "dotenv/config"

 const tokenVerify=async(req,res,next)=>{
    const authHeader =req.headers["authorization"]
    // console.log(authHeader );
    try{
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized: Token missing or malformed"});
        }
         const token= authHeader.split(" ")[1];
        //  console.log(token)
        //  console.log(token) // Extract the token from the header
        const verification= jwt.verify(token,process.env.JWT_SECRET_KEY)
    
        if(!verification){
            return res.status(401).send("token verification error")
        }
        req.user = verification;
        next()
    }catch(err){
        return res.status(500).json({ error: "Error in token", details: err.message });

    }


}
export {tokenVerify}