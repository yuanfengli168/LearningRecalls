const express = require('express');
const router = express.Router();

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

// post metadata into the back end of the database: 
router.post('/post-metadata', (req, res) => {
    console.log("post metadata processing!!")
    res.send("post metadata!!")
})



module.exports = router;