const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();
const port = 8000;
const cors = require('cors');
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

const jwt = require('jsonwebtoken')

mongoose
.connect("mongodb+srv://yelaysong:1234@cluster0.3xiei.mongodb.net/",{
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
})
.then(() =>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.log("Error conecting to MongoDb", err);
});

app.listen(port,() => {
    console.log("Server is running on port 8000")
})

const User = require("./models/user")
const Order = require("./models/order")

app.get("/api/list", async (req, res) => {
    try {
      const lists = await List.find();
      res.status(200).json(lists);
    } catch (error) {
      res.status(500).json({ message: "Error fetching lists" });
    }
  });




//function to send Verification Email to user
const sendVerificationEmail = async(email,verificationToken)=>{

    //create a nodemailer transport
    const transporter = nodemailer.createTransport({
        //configure the email service
        service:"gmail",
        auth:{
            user:"yelaysong15@gmail.com",
            pass:"vcjb grel xxdx giuq"
        }
    })
    //compose the email message
    const mailOptions ={
        from:"amazon.com",
        to:email,
        subject:"Email Verification",
        text: `Please click the following link to verify your email: http://localhost:8000/verify/${verificationToken}`,
    }
    //send the email
    try{
        await transporter.sendMail(mailOptions)
        console.log("Verification email sent successfully");
    }
    catch(error){
        console.log("Error sending verification email",email)
    }

} 

//endpoint to register in the app
app.post("/register",async (req,res) => {
    try{
        const {name,email,password} = req.body;
        //check if the email is already registerd
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({message:"Email already registered"})
        }

        //create a new User
        const newUser = new User({name,email,password})

        //generate and store the verification token
        newUser.verificationToken = crypto.randomBytes(20).toString("hex");

        //save the user to the database
        await newUser.save();

        //send verification email to the user
        sendVerificationEmail(newUser.email,newUser.verificationToken);

        res.status(201).json({
            message:
              "Registration successful. Please check your email for verification.",
          });
    }
    catch(error)
    {
        console.log("error registering user",error);
        res.status(500).json({message:"Registration failed"})
    }
})

//endpopint to verify the email
app.get("/verify/:token",async(req,res) =>{
    try{
        const token = req.params.token

        //Find the user with the given verification token
        const user = await User.findOne({verificationToken: token})
        if(!user){
            return res.status(404).json({message: "Invalid verification token"})
        }

        //Mark the user as verified
        user.verified = true;
        user.verificationToken = undefined

        await user.save()

        res.status(200).json({message: "Email verified successfully"})
    } catch(error){
        res.status(500).json({message: "Email Verification Failed"})
    }
})

const generateSecretKey = () => {
    const secretKey = crypto.randomBytes(32).toString("hex")

    return secretKey;
}

const secretKey = generateSecretKey();

app.post('/login',async(req,res) => {
    try{ 
        const {email,password} = req.body

        //check if the user exist
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({message:"Invalid email or password"})
        }
        
        //check if the password is correct
        if(user.password !== password){
            return res.status(401).json({message: "Invalid password"})
        }

        //generate a token
        const token = await jwt.sign({userId:user._id},secretKey)

        res.status(200).json({token})

    } catch(error) {
        res.status(500).json({message: "Login Failed"})
    }
})

//endpoint to store a new address to the backend
app.post("/addresses", async (req, res) => {
    try {
      const { userId, address } = req.body;
  
      //find the user by the Userid
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      //add the new address to the user's addresses array
      user.addresses.push(address);
  
      //save the updated user in te backend
      await user.save();
  
      res.status(200).json({ message: "Address created Successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error addding address" });
    }
  });

//endpoint to get all the addresses of a particular user
app.get("/addresses/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const addresses = user.addresses;
      res.status(200).json({ addresses });
    } catch (error) {
      res.status(500).json({ message: "Error retrieveing the addresses" });
    }
  });

  //endpoint to store all the orders
app.post("/orders", async (req, res) => {
    try {
      const { userId, cartItems, totalPrice, shippingAddress, paymentMethod } =
        req.body;
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      //create an array of product objects from the cart Items
      const products = cartItems.map((item) => ({
        name: item?.title,
        quantity: item.quantity,
        price: item.price,
        image: item?.image,
      }));
  
      //create a new Order
      const order = new Order({
        user: userId,
        products: products,
        totalPrice: totalPrice,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
      });
  
      await order.save();
  
      res.status(200).json({ message: "Order created successfully!" });
    } catch (error) {
      console.log("error creating orders", error);
      res.status(500).json({ message: "Error creating orders" });
    }
  });

  //get the user profile
app.get("/profile/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving the user profile" });
    }
  });
  

  app.get("/orders/:userId",async(req,res) => {
    try{
      const userId = req.params.userId;
  
      const orders = await Order.find({user:userId}).populate("user");
  
      if(!orders || orders.length === 0){
        return res.status(404).json({message:"No orders found for this user"})
      }
  
      res.status(200).json({ orders });
    } catch(error){
      res.status(500).json({ message: "Error"});
    }
  })

  // Endpoint to delete a specific address by addressId for a particular user
app.delete("/addresses/:userId/:addressId", async (req, res) => {
  try {
    const { userId, addressId } = req.params;

    // Find the user by the userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the address by addressId and remove it
    const addressIndex = user.addresses.findIndex(
      (address) => address._id.toString() === addressId
    );
    
    if (addressIndex === -1) {
      return res.status(404).json({ message: "Address not found" });
    }

    // Remove the address from the addresses array
    user.addresses.splice(addressIndex, 1);

    // Save the updated user data
    await user.save();

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    console.log("Error deleting address:", error);
    res.status(500).json({ message: "Error deleting address" });
  }
});


app.put("/addresses/:userId/:addressId", async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const updatedAddress = req.body;

    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the address that matches the addressId
    const addressIndex = user.addresses.findIndex(
      (address) => address._id.toString() === addressId
    );
    if (addressIndex === -1) {
      return res.status(404).json({ message: "Address not found" });
    }

    // Update the address with the new data
    user.addresses[addressIndex] = { ...user.addresses[addressIndex], ...updatedAddress };

    // Save the updated user in the database
    await user.save();

    res.status(200).json({ message: "Address updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating address", error });
  }
});

