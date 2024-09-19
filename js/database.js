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
    // // communicate to backend. 
    // // making API calls. 
    // // Only write put method for now. 
    const obj = this.obj;
    console.log("object is: ", JSON.stringify(obj));
    
    // const responseStatus = await fetch('http://localhost:5001/api/data', {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: this.transferObjToJSON(obj)
    // })
    // .then(response => response.json())
    // .then(data => {
    //   console.log("Updated:", data);
    // })
    // .catch(error => console.error('Error: ', error));

    // console.log("Response: ", responseStatus);
    // if (!responseStatus.ok) {
    //   return "unsuccess";
    // } else {
    //   return "success";
    // }

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

  transferObjToJSON(obj) {
    return JSON.stringify(obj);
  }
}