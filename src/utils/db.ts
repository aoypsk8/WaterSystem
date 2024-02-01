import { MongoClient } from 'mongodb';
//mongodb+srv://aoypsk8:bt6wBcxqflFGsqN7@cluster0.e947ezb.mongodb.net/
const url = 'mongodb+srv://aoypsk8:bt6wBcxqflFGsqN7@cluster0.e947ezb.mongodb.net/'; 
const dbName = 'test'; 


async function connectMongoDB() {
    const client = new MongoClient(url);
    try {
        await client.connect();
        console.log('Connected to MongoDB Success !');
        return client.db(dbName);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

export default connectMongoDB;
