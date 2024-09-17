

// Import MongoDB client
const { MongoClient } = require('mongodb');

// Connection URL (Replace with your MongoDB connection string)
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database and Collection name
const dbName = 'learningRecalls';
const collectionName = 'allData';


// Async function to connect and insert the object
async function saveObject(myObject) {
  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected to MongoDB');

    // Select the database and collection
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Insert the object into the collection
    const result = await collection.insertOne(myObject);
    console.log(`Object inserted with _id: ${result.insertedId}`);
  } catch (error) {
    console.error('Error inserting object:', error);
  } finally {
    // Close the connection
    await client.close();
  }
}

// // Call the function to save the object
// saveObject();
export default saveObject;