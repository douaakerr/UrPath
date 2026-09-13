import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true,
        },
        message:{
            type:string,
            required: true,
        },

        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",    
        }
    }