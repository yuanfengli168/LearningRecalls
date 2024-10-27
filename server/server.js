const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const multer = require('multer');
const fs = require('fs');

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
let dbClientClass;


class DBClient {
  defaultDBName = DB_NAME;
  defaultCollectionName = COLLECTION_NAME; 

  constructor(dbClient) {
    this.dbClient = dbClient ?? null;
    this.db = this.getDatabase(this.defaultDBName);
    this.collection = this.getCollection(this.defaultCollectionName);
    this.document = null;
  }

  // get db by dbName;
  getDatabase(dbName) {
    return dbClient.db(dbName);
  }

  // get collection by dbName and collectionName
  getCollection(dbName, collectionName) {
    return this.getDatabase(dbName).collection(collectionName);
  }

  /**
  * return true or false for the document
  * @param {string} userID 
  * @param {collection in mongoClient} collection 
  */
  async findUserIDInCol(userID, collection) {
    return await collection.findOne({userID: userID});
  }

  // // return a document, including dates.
  // // return a Promise!
  // async getDocument(userID) {
  //   console.log("this.collection: ", this.collection);
  //   return await this.findUserIDInCol(userID, this.collection);
  // }

  // // // 提前优化是灾难的开始：这里两行多了点但是正确，改成一行浪费30min
  // // return a document, including dates.
  // // return a Promise!
  // // async getDocument(userID, dbName, collectionName) {
  // //   if (dbName === this.defaultDBName && collectionName === this.defaultCollectionName) {
  // //     return await this.findUserIDInCol(userID, this.collection);
  // //   }

  // //   let colleciton = this.getCollection(dbName, collectionName);
  // //   return await findUserIDInCol(userID, colleciton);
  // // }

  // async getObjectOfDates(userID) {
  //   const document = await this.getDocument(userID);
  //   return document.dates; // hard coded by this app.
  // }

  // getObjectOfTags(userID, date) {
  //   const objectOfDates = this.getObjectOfDates(userID);
  //   return objectOfDates[date];
  // }

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
app.put('/api/data', async (req,res) => {
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

// return all tags for the usrID for all dates
app.get('/api/all-tags', async(req, res) => {
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
app.get('/api/today-tags', async(req, res) => {
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
app.get('/api/contents-and-answers', async(req, res) => {
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

// // All failed let's do it again
// // Set up storage for uploaded files: 
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // const uploadDir = path.join(__dirname, req.body.videoHTMLPagePath)
//     const uploadDir = path.join(null, "/assets/video/");

//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true }); // the directory should already available.
//     }
    
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     // cb(null, req.body.video.name); 
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// })

// const upload = multer({ storage });

// // upload video and its html page to the path received: 
// // app.post('/api/uploadVideo', upload.single('video'), async(req, res) => {
// app.post('/api/uploadVideo', async(req, res) => {
//   try {
//     console.log("uploadVideo: ", req.body);
//     res.json(true);
//   }
//   catch (e) {
//     console.error(e);
//     res.json(false);
//   }
// })

// // Define the destination folder for video uploads
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'video'); // Specify 'video' folder as the destination
//     },
//     filename: (req, file, cb) => {
//         // Customize the file name to avoid overwriting
//         cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to original file name
//     }
// });

// // Set up Multer with storage and file filter to restrict file type
// const upload = multer({
//     storage: storage,
//     fileFilter: (req, file, cb) => {
//         const filetypes = /mp4/;
//         const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//         const mimetype = filetypes.test(file.mimetype);

//         if (mimetype && extname) {
//             return cb(null, true);
//         } else {
//             cb(new Error('Only .mp4 files are allowed!'));
//         }
//     }
// });

// // Define the route for handling video uploads
// app.post('/upload', upload.single('videoFile'), (req, res) => {
//     try {
//         res.send('Video uploaded successfully!');
//     } catch (error) {
//         res.status(400).send('Error uploading video');
//     }
// });

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, path.join("/assets/", 'video'));
    cb(null, path.join(__dirname, 'video'));

  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// Serve static files from the client folder
// app.use(express.static(path.join(__dirname, 'client')));

// Route to handle video uploads
app.post('/upload', upload.single('video'), (req, res) => {
  if (req.file) {
    res.status(200).send('File uploaded successfully');
  } else {
    res.status(400).send('Failed to upload file');
  }
});



/*
Helper Functions below!
*/
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
