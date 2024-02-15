// import { MongoClient } from "mongodb";
// import dotenv from "dotenv";

// dotenv.config();

// // const client = new MongoClient(process.env.DATABASE_URI);

// const client = "mongodb+srv://americanoshepherd4:B9dO4XUOrFhLKBne@lunarfit.7difhwf.mongodb.net/";

// try {
//     await client.connect();
// } catch (error) {
//     console.error(error);
// }

// export default client;

import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

// Initialize MongoClient with the connection string from environment variables
const client = new MongoClient(process.env.DATABASE_URI);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Successfully connected to MongoDB.");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

// Call the async function to establish the database connection
connectToDatabase();

export default client;
