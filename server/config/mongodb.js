
import mongoose from 'mongoose';


const connectDB = async () => {
  try {

    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to MongoDB');
    });
    const conn = await mongoose.connect(`${process.env.MONGO_URI}/imagify`, {                

    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  } 
};

export default connectDB;