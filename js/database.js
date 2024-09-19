

// // Import MongoDB client
// const { MongoClient } = require('mongodb');

// // Connection URL (Replace with your MongoDB connection string)
// const url = 'mongodb://localhost:27017';
// const client = new MongoClient(url);

// // Database and Collection name
// const dbName = 'learningRecalls';
// const collectionName = 'allData';


// // Async function to connect and insert the object
// async function saveObject(myObject) {
//   try {
//     // Connect to the MongoDB server
//     await client.connect();
//     console.log('Connected to MongoDB');

//     // Select the database and collection
//     const db = client.db(dbName);
//     const collection = db.collection(collectionName);

//     // Insert the object into the collection
//     const result = await collection.insertOne(myObject);
//     console.log(`Object inserted with _id: ${result.insertedId}`);
//   } catch (error) {
//     console.error('Error inserting object:', error);
//   } finally {
//     // Close the connection
//     await client.close();
//   }
// }

// // // Call the function to save the object
// // saveObject();
// export default saveObject;



// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://lyf992022:Mongodb05122024@cluster0.kzx6op0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// const dbName = 'learningRecalls';
// const collectionName = 'allData';

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");

//     const db = client.db(dbName);
//     const collection = db.collection(collectionName);

//     // Insert the object into the collection
//     const result = await collection.insertOne({a: "bbbb"});
//     console.log(`Object inserted with _id: ${result.insertedId}`);


//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

/**
 * an class that index.js can utilize
 */
class MongoDBAtlas {
  constructor(obj) {
    this.obj = obj ?? null;
  }

  /**
   * Using put method, because the userID is always the same 1001
   * for now. 
   * 
   * no input:
   * @returns: str, "success"/"unsuccess";
   */
  async saveToDatabase() {
    // communicate to backend. 
    // making API calls. 
    // Only write put method for now. 
    const obj = this.obj;
    let isSuccess = false;
    
    fetch('http://localhost:5001/api/data', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: this.transferObjToJSON(obj)
    })
    .then(response => response.json())
    .then(data => {
      console.log("Updated:", data);
    })
    .catch(error => console.error('Error: ', error));
  }

  transferObjToJSON(obj) {
    return JSON.stringify(obj);
  }

}