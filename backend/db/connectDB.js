import mongoose from "mongoose";

export const connectDB = async ()=>{
    try {
       
        const connection = await mongoose.connect(process.env.MONGO_URL)
        console.log(`MongoDB Connected: ${connection.connection.host}`);

    } catch(err) {
        console.log("Error connecting to MongoDB!")
        process.exit(1)
    }
}