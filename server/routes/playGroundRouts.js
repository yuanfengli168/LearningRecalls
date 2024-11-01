const express = require('express');
const router = express.Router();
// const dbClientClassInstance = await require('./../server');

// const dbClientClassInstance = await import('./../server.js');

// get userID. 
/**
 * learningRecalls.playGroundCollection {
 *    userID: {
 *      dates: {
 *          '2024-10-31': [
 *              {
 *                  date: date,
 *                  title: title, 
 *                  desc: desc,
 *                  videoPath: data.videoPath.   
 *              }
 *  
 *          ]
 *      }
 *    }
 * }
 */

// module.exports = (dbClientClass) => {
//     const router = express.Router();

//     // post metadata into the back end of the database: 
//     router.post('/post-metadata', async (req, res) => {
//         // // the following will work if without module.exports, but 
//         // // not working for the current configuration. 
//         // let data = JSON.parse(req.body);

//         let data = req.body;
//         console.log("The passed data: ", data);

//         console.log("DBClientClass 3: ", dbClientClass);

//         // check if the database and collection exists?
//         let answer = await dbClientClass.getDatabase("learningRecalls");
//         console.log("ANSWER: ", answer);
//         res.send("ANSWER: ", answer);
        


//         console.log("post metadata processing!!")
//         res.send("post metadata!!")
//     })

//     return router;
// }


// post metadata into the back end of the database: 
    router.post('/post-metadata', async (req, res) => {
        // the following will work if without module.exports, but 
        // not working for the current configuration. 
        // let data = JSON.parse(req.body);

        let data = req.body;
        console.log("The passed data: ", data);

        const dbClientClass = await import('./../server.js');
        console.log("DBClientClass 3: ", dbClientClass);
        // printMethodNames(dbClientClass);

        // // check if the database and collection exists?
        let answer = await dbClientClass.getCollection("learningRecalls", "lkjlkj");
        console.log("ANSWER: ", answer);
        res.send("ANSWER: ", answer);
        


        console.log("post metadata processing!!")
        res.send("post metadata!!")
    })

// function printMethodNames(Class) {
//   // Get the prototype of the class
//   const prototype = Object.getPrototypeOf(new Class());
  
//   // Get all property names on the prototype
//   const methodNames = Object.getOwnPropertyNames(prototype)
//     .filter(prop => typeof prototype[prop] === 'function' && prop !== 'constructor');

//   console.log("Method names:", methodNames);
// }

// // Usage
// printMethodNames(ExampleClass);



module.exports = router;