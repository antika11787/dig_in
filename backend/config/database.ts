import mongoose from 'mongoose';

const databaseConnection = async (callback: () => void) => {
    try {
        if(process.env.DATABASE_URL) {
            const client = await mongoose.connect(process.env.DATABASE_URL);
            if(client) {
                console.log("Database connected successfully.");
                callback();
            }
            else {
                console.log("Database could not be connected.");
            }
        }
    } catch (error) {
        console.log("Error: ", error);
    }
}

module.exports = databaseConnection;
