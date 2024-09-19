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

// api/data
// saving new obj to database: 
app.put('/api/data', async (req,res) => {
    console.log("userID: ", req.body.userID);

    // search if the database has this user!

    return res.json('it worked!!');
});


// // Connect to MongoDB Atlas by mongoose worked.
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => 
//     // connct to atlas
//     console.log('Connected to MongoDB Atlas')

//     // connect to the database and collection!

//   )
//   .catch((err) => console.error('Error connecting to MongoDB:', err));

// // connect to mongoDB by mongoClient worked.
// async function main(){
//     /**
//      * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
//      * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
//      */
//     const uri = "mongodb+srv://lyf992022:Mongodb05122024@cluster0.kzx6op0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
 

//     const client = new MongoClient(uri);
 
//     try {
//         // Connect to the MongoDB cluster
//         await client.connect();
 
//         // Make the appropriate DB calls
//         // await  listDatabases(client);
//         console.log("Connected to MongoDB Atlas...");
 
//     } catch (e) {
//         console.error(e);
//     } finally {

//         console.log("MongoDB connection disconnected and closed.")
//         await client.close();
//     }
// }
// main().catch(console.error);


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
