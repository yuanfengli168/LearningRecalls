/**
 * an class that index.js can utilize
 */
class MongoDBAtlas {
  constructor(obj) {
    this.obj = obj ?? null;
  }

  /**
   * return all quiz saved in allData collection
   */
  async getAllQuiz() {
    try {
      const response = await fetch('http://localhost:5001/api/quizs', {
                          method: 'GET',
                       })
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      const data = await response.json(); // data is in object format.

      return data;
    } 
    catch (e) {
      console.error(e);
    }
  }

  // optimizing the time
  // hopefully the time can be seen faster while retrieving 
  // data
  // a succeeded function from getAllQuiz(), which will
  // return the only one quiz by the date and the tag:
  async getContentAndAnswer(date, tag) {
    try {
      let data = await this.getAllQuiz();
      // data is a object:
      let content = data[date][tag];
      let quizContent = content.quizContent;
      let answerContent = content.quizAnswerContent;
      
      return [quizContent, answerContent];
    } 
    catch (e) {
      console.error(e);
    }
  }


  /**
   * Using put method, because the userID is always the same 1001
   * for now. 
   * 
   * no input:
   * @returns: str, "success"/"unsuccess";
   */
  async saveToDatabase() {
    // // communicate to backend. 
    // // making API calls. 
    // // Only write put method for now. 
    const obj = this.obj;

    try {
      // Fetch data from the API
      // const response = await fetch('http://localhost:5001/api/data');
      
      const response = await fetch('http://localhost:5001/api/data', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: this.transferObjToJSON(obj)
      })

      // Check if the response is ok (status code 200-299)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Parse the JSON data
      const data = await response.json();

      // Get the container element
      const dataContainer = document.querySelector('.data-container');

      // Update the content of the container with the fetched data
      // This assumes `data` is a string or can be directly inserted

      if (dataContainer) {
        dataContainer.classList.add('successed');
        dataContainer.textContent = "Saved Successed!"// Pretty-print JSON
        setTimeout(() => dataContainer.classList.remove('successed'), 2000);
      } else {
        console.error("element not found");
      }
      

    } catch (error) {
      console.error('Error fetching data:', error);

      // Update the container with an error message
      const dataContainer = document.querySelector('.data-container');
      dataContainer.classList.add('failed');
      dataContainer.textContent = 'Failed to Save';
      setTimeout(() => dataContainer.classList.remove('failed'), 2000);
    }
  }

  /**
   * 
   * @param {String} date 
   * @param {String} type 
   * @param {String} finishedDateTime
   * @param {Number} score 
   */
  async postScore(date, type, finishedDateTime, score, userID, tag) {
    const obj = {
          userID: userID,
          tag: tag,
          date: date,
          finishedDateTime: finishedDateTime,
          score: score
    };

    try {
      const response = await fetch('http://localhost:5001/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: this.transferObjToJSON(obj)
      });

      if (!response.ok) {
        return false;
      }
      else {
        return true;
      }
    } 
    catch (e) {
      console.error(e);
      return false;
    }
  }

  // return array of string format of tags
  async getAllTags(userID, date) {
    try{
      let response;

      if (!date) {
        date = "none"
        response = await fetch(`http://localhost:5001/api/all-tags?userID=${userID}`, {
          method: "GET",  
          headers: {
            'Content-Type': 'application/json'
          },
        });
      } 
      else {
        response = await fetch(`http://localhost:5001/api/today-tags?userID=${userID}&date=${date}`, {
          method: "GET",  
          headers: {
            'Content-Type': 'application/json'
          },
        });
      }

      if (!response.ok) {
        throw new Error("all-tags api erros occured");
      }
      const data = await response.json();
      return data; // arrayOfTags
    }
    catch (e) {
      console.error(e);
    }
  }

  async getContentAndAnswerByQuery(userID, date, tag) {
    try {
      let response;

      // date and tag will always be valid:
      response = await fetch(`http://localhost:5001/api/contents-and-answers?
                              userID=${userID}&date=${date}&tag=${tag}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        },
      });
      if (!response.ok) {
        throw new Error("contents-and-answers api errors occured!")
      }

      const data = await response.json();
      return [data.quizContent, data.quizAnswerContent];
    }
    catch (e) {
      console.error(e);
    }

  }

  // let's simplify and unnest the nested eventlistener here!!
  // by clicking upload, it will upload video, 
  // 1) if the video is already uploaded, we only update the database of playGround by the 'save playground'
  // 2) if video not uploaded, we upload video and update the data base of playGround by clicking the 'save playground'
  // upload video to backend: 
  async uploadVideo(formData) {
    // let button = document.querySelector("form#uploadForm button");
    // button.addEventListener('click', async () => {
    //     const fileInput = document.getElementById('videoFile');
    //     const formData = new FormData();
    //     formData.append('video', fileInput.files[0]);
    //     console.log("FormData: ", formData);

      try {
          const response = await fetch('http://localhost:5001/upload', {
          method: 'POST',
          body: formData,
          });


          if (response.ok) {
            // alert('Video uploaded successfully!');
            return true;
          } else {
            // alert('Failed to upload video.');
            return false;
          }
      } catch (error) {
          console.error('Error:', error);
          // alert('An error occurred.');
          return null;
      }
  }

  // upload date, video title, video description and video file path to back end, 
  async uploadVideoMetaDataToDB(data) {
    try {
      // TODOs.
    }
  }

  transferObjToJSON(obj) {
    return JSON.stringify(obj);
  }
}