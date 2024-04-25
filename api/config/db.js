import mongoose from 'mongoose';


const connect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO);
        console.log("connected to db");
    } catch (err) {
        console.log("error connecting to db", err.message);
        process.exit(1); 
    }
};

const connected = mongoose.model('connected', connect);

export default connected;

