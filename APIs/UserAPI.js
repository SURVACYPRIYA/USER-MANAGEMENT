// Create min-express app
import exp from 'express'
import { UserModel } from '../models/UserModel.js'
export const UserApp=exp.Router()

// USER API ROUTES

// Create User
UserApp.post('/users',async(req,res)=>{
    //get new user
    const newUser=req.body
    //create user document
    const newUserDocument=new UserModel(newUser)
    //save new user 
    let user=await newUserDocument.save()
    //save res
    res.status(201).json({message:"User Created",payload: user})
})


// Read all Users 
UserApp.get("/users",async(req,res)=>{
    //read all users
    let usersList=await UserModel.find({status:true})
    //send res
    res.status(200).json({message:"Users" , payload: usersList})
})


// Read a User by ID 
UserApp.get("/users/:id",async(req,res)=>{
    //get user if from url
    let uid=req.params.id;
    //find user by ID
    let user=await UserModel.findOne({_id:uid,status:true})
    //check user
    if(!user){
        return res.status(404).json({message:"user not found"})
    }
    //send res
    res.status(200).json({message:"User found",payload:user}) 
})


// Delete a User by ID 
UserApp.delete("/users/:id",async(req,res)=>{
    //get user if from url
    let uid=req.params.id;
    //find user and change status to false
    let user=await UserModel.findByIdAndUpdate(uid,{$set:{status:false}})
    //check user
    if(!user){
        return res.status(404).json({message:"user not found"})
    }
    //send res
    res.status(200).json({message:"User removed"}) 
})  


// Activate User(change status to true)
UserApp.patch("/users/:id",async(req,res)=>{
    //get user if from url
    let uid=req.params.id;
    //find user and change status to false
    let user=await UserModel.findByIdAndUpdate(uid,{$set:{status:true}},{new:true})
    //send res
    res.status(200).json({message:"User activated", payload:user}) 
})
// PUT(complete change) & PATCH (partial change)




// Update a user by ID