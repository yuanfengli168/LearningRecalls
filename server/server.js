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

app.post('/api/scores', async (req, res) => {
  try {
    // get date, type, finishedDateTime, and score
    let data = req.body;
    let userID = data.userID;
    let tag = data.tag;
    let date = data.date;
    // for now we only got Quiz type, we need 
    // test, and exam in future. TODO.
    // let type = data.type;
    let finishedDateTime = data.finishedDateTime;
    let score = data.score;

    // find the key of results
    // TODO: combine all this into one private member of the class or this file
    const collection = getColInDB(COLLECTION_NAME, DB_NAME);
    const document = await findUserIDInCol(userID, collection);
    const mapOfDates = transferObjectToMap(document.dates);

    const mapOfTags = transferObjectToMap(mapOfDates.get(date));
    const results = transferObjectToMap(mapOfTags.get(tag)).get("results");

    const obj = {
      finishedDateTime: finishedDateTime,
      score: score,
    }
    results.push(obj);
    
    // set in database.
    const filter = {userID: userID};
    let keys = "dates." + date + "." + tag + ".results";
    // the following won't work, as well as str.concat();
    // const keys = `dates.${date}.${tag}.results`;

    // the backtiks, and concat won't work for keys
    // only the computed property names works.
    // use [] as computed property names.
    const update = {
      // $set: {"dates.2024-09-20.html.results" : results} // this works though
      $set: { [keys] : results}
    };
    await collection.updateOne(filter, update);

    return res.json();
  } 
  catch (e) {
    console.error(e);
  }
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
