const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const multer = require('multer');
const fs = require('fs');
const sanitize = require('sanitize-filename');

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5001;

// ===================================================================================================
// Middleware
app.use(express.json()); // Parse JSON data
app.use(cors()); // enable CORS for all routes and origins


// ===================================================================================================
// DATABASE:
const DB_NAME = "learningRecalls";
const DB_TEST_NAME = "dbTests";
const DB_PLAYGROUND = 'dbPlayground'
const COLLECTION_NAME = "allData";
const COLLECTION_TEST_NAME = "collectionTest";
const COLLECTION_PLAYGROUND = "collectionPlayground";
const PLAY_GROUND_COLLECTION_NAME = "playGround";
const mongoUri = process.env.MONGODB_URI;

var dbClient;
var dbClientClass;


class DBClient {
  defaultDBName = DB_NAME;
  defaultCollectionName = COLLECTION_NAME;

  constructor(dbClient) {
    this.dbClient = dbClient ?? null;
    this.db = this.getDatabase(this.defaultDBName);
    this.collection = this.getCollection(this.defaultCollectionName);
    this.document = null;
  }

  // see if the database exists?
  async doesDbExist(dbName) {
    const client = this.dbClient;

    try {
      const adminDb = client.db().admin();
      const databases = await adminDb.listDatabases();

      // Check if the specified database exists
      const dbExists = databases.databases.some(db => db.name === dbName);

      if (dbExists) {
        console.log(`Database "${dbName}" exists.`);
        return true;
      } else {
        console.log(`Database "${dbName}" does not exist.`);
        return false;
      }
    } catch (error) {
      console.error('Error checking database existence:', error);
      return null;
    }
  }

  // get db by dbName;
  getDatabase(dbName) {
    // so this actually create the db, if it does not exists.
    return dbClient.db(dbName);
  }

  // get collection by dbName and collectionName
  getCollection(dbName, collectionName) {
    return this.getDatabase(dbName).collection(collectionName);
  }

  // check if data exists in the collection?
  async checkIfDataInCol(collection, data) {
    return await collection.findOne(data);
  }

  /**
  * return true or false for the document
  * @param {string} userID 
  * @param {collection in mongoClient} collection 
  */
  async findUserIDInCol(userID, collection) {
    return await collection.findOne({ userID: userID });
  }

  /**
  * Return the collection object from mongoClient
  * @param {string, string} collection, database
  * @param {db.collection} database collection type
  * @returns 
  */
  getColInDB(collection, database) {
    let db = dbClient.db(database);
    let dbCollection = db.collection(collection);

    return dbCollection;
  }
}

// Connect to MongoDB
async function connectToDatabase() {
  try {
    dbClient = new MongoClient(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    await dbClient.connect();
    console.log('MongoDB connected');
    dbClientClass = new DBClient(dbClient);

    console.log("dbClientClass initiated");
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process if connection fails
  }
}
// Connect to the database when starting the server
connectToDatabase();
// console.log("DbClientClass after: ", dbClientClass);


// // for oterh module to use dbClientClass
// module.exports = { dbClientClass };

// ================================================================================================
// ROUTES:
app.get('/', (req, res) => {
  res.send('Hello from the Node.js backend!');
});

// get all Quiz
app.get('/api/quizs', async (req, res) => {
  // TODO: add userID as param
  try {
    const userID = req.body.userID ?? 1001;
    console.log("trying to find dates of ", userID);

    let collection = dbClientClass.getCollection(DB_NAME, COLLECTION_NAME);
    let document = await dbClientClass.findUserIDInCol(userID, collection);

    console.log("successed!")
    res.json(document.dates);
  }
  catch (e) {
    console.error(e);
  }
})

// api/data
// saving new obj to database: 
app.put('/api/data', async (req, res) => {
  let data = req.body;
  let userID = req.body.userID;
  let date = data.date;

  // check if the database have this userID. 
  let collection = dbClientClass.getColInDB(COLLECTION_NAME, DB_NAME);
  let document = await dbClientClass.findUserIDInCol(userID, collection);

  let mapOfDates = new Map(); // key: dates, value are map of tags in object format.
  let mapOfTags = new Map();  // key: tags, value are object

  // userID not exist.
  if (document === null) {
    mapOfDates = createMapOfDates(data);
    await collection.insertOne({ userID: userID, dates: transferMapToObject(mapOfDates) });
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

    await collection.updateOne({ userID: userID }, { $set: { dates: transferMapToObject(mapOfDates) } });
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
    const collection = dbClientClass.getColInDB(COLLECTION_NAME, DB_NAME);
    const document = await dbClientClass.findUserIDInCol(userID, collection);

    // 提前优化是灾难的开始：这里两行多了点但是正确，改成一行浪费30min
    // const document = await dbClientClass.getDocument(userID, DB_NAME, COLLECTION_NAME);
    const mapOfDates = transferObjectToMap(document.dates);

    const mapOfTags = transferObjectToMap(mapOfDates.get(date));
    const results = transferObjectToMap(mapOfTags.get(tag)).get("results");

    const obj = {
      finishedDateTime: finishedDateTime,
      score: score,
    }
    results.push(obj);

    // set in database.
    const filter = { userID: userID };
    let keys = "dates." + date + "." + tag + ".results";
    // the following won't work, as well as str.concat();
    // const keys = `dates.${date}.${tag}.results`;

    // the backtiks, and concat won't work for keys
    // only the computed property names works.
    // use [] as computed property names.
    const update = {
      // $set: {"dates.2024-09-20.html.results" : results} // this works though
      $set: { [keys]: results }
    };
    await collection.updateOne(filter, update);

    return res.json();
  }
  catch (e) {
    console.error(e);
  }
});

// return all tags for the usrID for all dates
app.get('/api/all-tags', async (req, res) => {
  try {
    const query = req.query;
    const userID = +query.userID;

    const collection = dbClientClass.getColInDB(COLLECTION_NAME, DB_NAME);
    const document = await dbClientClass.findUserIDInCol(userID, collection);
    // very fast retrieval, will get the document only once!!
    this.document = document;

    // for unknow reason this will never work.
    // const objectOfDates = await dbClientClass.getObjectOfDates(userID);
    // console.log("all-tags: ", objectOfDates);

    const mapOfDates = transferObjectToMap(document.dates);
    const map = new Map();

    for (const [date, objectOfTags] of mapOfDates) {
      let mapOfTags = transferObjectToMap(objectOfTags);

      for (const [tag, objectOfData] of mapOfTags) {
        map.set(tag, map.get(tag) + 1 || 1);
      }
    }
    const resultArray = sortMap(map);
    res.json(resultArray);
  }
  catch (e) {
    // do not worry about this error in version 1.0
    console.error(e);
  }
});

// return all tags for the userID for the selected date
app.get('/api/today-tags', async (req, res) => {
  try {
    const query = req.query;
    const date = query.date;

    const mapOfDates = this.document?.dates;
    if (!mapOfDates || !mapOfDates[date]) {
      res.json([]);
    }
    else {
      const set = new Set();
      for (const [tag, objectOfData] of transferObjectToMap(mapOfDates[date])) {
        set.add(tag);
      }

      const resultArray = [...set];
      res.json(resultArray);
    }
  }
  catch (e) {
    console.error(e);
    res.json([]);
  }
})

// return only one row of data by date and tag: 
app.get('/api/contents-and-answers', async (req, res) => {
  try {
    const query = req.query;
    const userID = +query.userID;
    const date = query.date;
    const tag = query.tag;

    // TODO: see why this is not working? 
    // // not sure why the following won't work, so not using it
    // const collection = dbClientClass.getColInDB(COLLECTION_NAME, DB_NAME);
    // const document = await dbClientClass.findUserIDInCol(userID, collection);

    const document = this.document;
    // bug1: why the objectOfDates is showing as an null for all times?
    const objectOfDates = document.dates;
    const rowOfDate = objectOfDates[date][tag]; // should never return null;

    res.json(rowOfDate);
  }
  catch (e) {
    console.error(e);
    res.json({});
  }
})

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '/assets/video/'));
  },
  filename: (req, file, cb) => {
    // Use the original filename, ensuring UTF-8 compatibility: (this was a bug, see below comments.)
    // this is an old bug that multer has, The version I used for this line of multer: multer": "^1.4.5-lts.1",
    // so you have to write like this, 'latin1' must be added or utf-8 won't work, I spend 1 hr working on this.
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf-8');
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

// Route to handle video uploads
app.post('/upload', upload.single('video'), (req, res) => {
  if (req.file) {
    res.status(200).send('File uploaded successfully');
  } else {
    res.status(400).send('Failed to upload file');
  }
});


// Route to handle metadata of video uploads: 
app.post('/uploadVideoMetaData', (req, res) => {
  let data = req.body;
  const videoHTML = data.videoHTML;
  const videoHTMLPagePath = data.videoHTMLPagePath;
  // due to a little diff from server, deleting /server in str front
  const filePath = path.join(__dirname, videoHTMLPagePath.slice(7));

  fs.writeFile(filePath, videoHTML, (err) => {
    if (err) {
      console.error("Error writing file: ", err);
      return res.status(500).send("Failed to save HTML file");
    }
    res.status(200).send("HTML file saved successfully!");
  })
})


// handle post action for playground
app.post('/api/playground/post-metadata', async (req, res) => {
  let metaData = req.body;
  let databaseName = DB_PLAYGROUND;
  let collectionName = COLLECTION_PLAYGROUND

  try {
    let collection = dbClientClass.getCollection(databaseName, collectionName); // this will build db and collection if not exists.
    let dataInCol = await dbClientClass.checkIfDataInCol(collection, metaData);

    if (dataInCol) {
      res.json("existed");
      res.send("existed!!");
    }
    else {
      metaData = {
        ...metaData,
        logs: [],
      }
      await collection.insertOne(metaData);
      res.json("inserted");
      res.send("inserted!!!")
    }

  }
  catch (e) {
    // TODO: 
    // Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
    // let's fix this in version 1.x.x
    console.error(e);
  }
})

app.get('/api/playground/get-all-history', async (req, res) => {
  const query = req.query;
  const userID = +query.userID;

  // database name and collection name are hardcoded
  const dbName = DB_PLAYGROUND;
  const collectionName = COLLECTION_PLAYGROUND;

  try {
    const dbQuery = { userID: userID };
    const collection = dbClientClass.getCollection(dbName, collectionName);
    const documents = await collection.find(dbQuery).toArray();

    // // express deprecated res.send(status, body): 
    // // Use res.status(status).send(body) instead server.js:430:9
    // res.send("documents: ", documents);
    // res.status(200).send("documents: ", documents);
    res.json(documents);
  }
  catch (e) {
    console.error(e);
  }
})


app.post('/api/playground/post-both-link', async (req, res) => {
  let data = req.body;
  

  try {
    // testing purpose: 
    // let collection = dbClientClass.getCollection(DB_TEST_NAME, COLLECTION_TEST_NAME);

    let collection = dbClientClass.getCollection(DB_PLAYGROUND, COLLECTION_PLAYGROUND);
    let document = await collection.findOne(data.queryObj);
    console.log("Document: ", document);
    

    let logs = document.logs;
    console.log("LOGS: ", logs);
    console.log(Array.isArray(logs));

    if (!Array.isArray(logs)) {
      logs = [];
    }

    // check duplicates: 
    // if (logs.includes(data.paramObj)) { // this will check the reference
    if (logsContainObj(data.paramObj, logs)) {
      return res.status(200).send("existed!!!");
    }

    console.log("ParamObj: ", data.paramObj);
    let updatedLogs = logs.slice().concat([data.paramObj]);
    console.log("UP", updatedLogs);

    const filter = {
      userID: document.userID,
      date: document.date,
      title: document.title
    };
    const update = {
      $set : {logs : updatedLogs}
    }
    const result = await collection.updateOne(filter, update);

    // console.log(`Matched ${result.matchedCount} document(s) and modified ${result.modifiedCount} document(s).`);
    // res.status(200).send("Find the document!!\n" + JSON.stringify(document));
    if (result.modifiedCount === 1) {
      res.status(200).send(true);
    }
    else {
      res.status(500).send(false);
    }



  }
  catch (e) {
    console.error(e);
    res.status(500).send("error occured");
  }
})


/*
===================================================================================================
Helper Functions below!
*/
// see if the obj in the array: 

function logsContainObj(obj, array) {
  return array.some((item) => deepEqual(item, obj));
}

function deepEqual(obj1, obj2) {
  // Check if both are strictly equal
  if (obj1 === obj2) return true;

  // Check if both are objects (including arrays), and not null
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }

  // Get keys from both objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check if they have the same number of keys
  if (keys1.length !== keys2.length) return false;

  // Check if all keys and values are the same recursively
  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}


// return a key of array
// by decreasing order of count
function sortMap(map) {
  let entries = map.entries();
  entries = [...entries];
  entries.sort((a, b) => b[1] - a[1]);
  let result = entries.map((ent) => ent[0]);

  return result;
}

function createMapOfTags(data, mapOfTags) {
  // a bug was that if we save by the previous 
  // prefill
  // then the logs data would disappear. 
  if (mapOfTags.has(data.quizTags)) {
    let value = mapOfTags.get(data.quizTags);
    value.quizContent = data.quizContent;
    value.quizAnswerContent = data.quizAnswerContent;
    console.log("Create existing map of tags: ", mapOfTags.toString())

  } else {
    mapOfTags.set(data.quizTags, data);
    console.log("Create new map of tags: ", mapOfTags.toString())
  }


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

