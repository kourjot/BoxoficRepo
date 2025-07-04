
import {OAuth2Client} from "google-auth-library";
import "dotenv/config";
import {User} from "../model/user.js";
import jwt from "jsonwebtoken";
// Load the client ID from environment variables
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);
 
const healthCheck = (req, res) => {
  return res.status(200).json({
    status: "success",
    message: "Server is running",
  });
};

const googleAuth = async (req, res) => {

  const { token } = req.body;
//   console.log("Received token:", token);
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    console.log(ticket);

    const payload = ticket.getPayload();
    const {email,name}  = payload;

    let user=await User.findOne({email})
    if(user){
        console.log("User already exists:", user);
        return res.status(400).json({
            status: "error",
            message: "User already exists, please login",
        })
    }


    if(!user){
        user = await User.create({
            name,
            email,
            password: null, // Google auth does not require a password
            phoneNumber: null, // Assuming phoneNumber is optional
            role: "user", // Default role for new users
        });
    }
    const jwtToken=jwt.sign({
        userId:user._id,
        email:user.email,
        role:user.role
    },process.env.JWT_SECRET,{
        expiresIn:"7d" // Token will expire in 7 days
    })
    console.log("JWT Token:", jwtToken);    
    return res.status(200).json({
      status: "success",
      token: jwtToken,
      message: "User authenticated successfully",
      email,
      name,
    });
  } catch (error) {

    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
}




export { googleAuth , healthCheck};