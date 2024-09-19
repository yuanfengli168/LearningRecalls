const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json()); // Parse JSON data
app.use(cors()); // enable CORS for all routes and origins


// DATABASE:
const DB_NAME = "learningRecalls";
const COLLECTION_NAME = "allData";
const mongoUri = process.env.MONGODB_URI;

let dbClient;

// Connect to MongoDB
async function connectToDatabase() {
  try {
    dbClient = new MongoClient(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    await dbClient.connect();
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process if connection fails
  }
}
// Connect to the database when starting the server
connectToDatabase();


// ROUTES:
app.get('/', (req, res) => {
  res.send('Hello from the Node.js backend!');
});

// get all Quiz
app.get('/api/quizs', async (req, res) => {
  // TODO: add userID as param
  try {
    const userID = 1001;

    console.log("trying to find dates of ", userID);
    let collection = getColInDB(COLLECTION_NAME, DB_NAME);
    let document = await findUserIDInCol(userID, collection);
    console.log("successed!")
    res.json(document.dates);
  }
  catch (e) {
    console.error(e);
  }
})

// api/data
// saving new obj to database: 
app.put('/api/data', async (req,res) => {
    let data = req.body;
    let date = data.date;
    let tag = data.tag;

    // check if the database have this userID. 
    let collection = getColInDB(COLLECTION_NAME, DB_NAME);
    let userID = req.body.userID;
    let document = await findUserIDInCol(userID, collection);

    let mapOfDates = new Map(); // key: dates, value are map of tags in object format.
    let mapOfTags = new Map();  // key: tags, value are object

    // userID not exist.
    if (document === null) {
      mapOfDates = createMapOfDates(data);
      await collection.insertOne({userID: userID, dates: transferMapToObject(mapOfDates)});
    // userID exist:
    } else {
      objectOfDates = document.dates;
      // TODO: if there is no .dates found what should you do?
      mapOfDates = transferObjectToMap(objectOfDates);

      // if date exist get mapOfTags. 
      if (mapOfDates.get(date)) {
        mapOfTags = transferObjectToMap(mapOfDates.get(date));
      } 
      // else would be an empty map.
      mapOfTags = createMapOfTags(data, mapOfTags);
      mapOfDates.set(date, transferMapToObject(mapOfTags));

      await collection.updateOne({userID: userID}, {$set: {dates: transferMapToObject(mapOfDates)}});
    }
    
    return res.json('it worked!!');
});

function createMapOfTags(data, mapOfTags) {
  mapOfTags.set(data.quizTags, data);
  return mapOfTags;
}

function createMapOfDates(data) {
  let map = new Map();
  let mapOT = new Map();
  mapOT = createMapOfTags(data, mapOT);

  map.set(data.date, mapOT);
  return map;
}



function transferMapToObject(map) {
  return Object.fromEntries(map);
}

function transferObjectToMap(obj) {
  return new Map(Object.entries(obj));
}


/**
 * Return the collection object from mongoClient
 * @param {string, string} collection, database
 * @param {db.collection} database collection type
 * @returns 
 */
function getColInDB(collection, database) {
    let db = dbClient.db(database);
    let dbCollection = db.collection(collection);

    return dbCollection;
}

/**
 * return true or false for the document
 * @param {string} userID 
 * @param {collection in mongoClient} collection 
 */
async function findUserIDInCol(userID, collection) {
  const document = await collection.findOne({userID: userID});
  return document;
}


// SERVER
// Handle server shutdown
function gracefulShutdown() {
  if (dbClient) {
    dbClient.close()
      .then(() => {
        console.log('MongoDB disconnected');
        process.exit(0);
      })
      .catch(err => {
        console.error('Error disconnecting from MongoDB:', err);
        process.exit(1);
      });
  } else {
    process.exit(0);
  }
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
