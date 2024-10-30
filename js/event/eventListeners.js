/**
 * A class to add event Listeners for all the pages:
 */
class EventListeners {
    constructor() {
        this.currentPage = findContent();
        this.doms = this.createDoms();
        this.videoUploaded = false;
    }

    // create relative DOMs
    createDoms() {
        switch (this.currentPage) {
            // testing water on the "Create Playground" page:
            case "Create Play Ground":
                return this.getDOMofPG();
        }
    }

    getDOMofPG() {
        // you can encapsule the following 12 lines into one line
        let doms = {
            // inputs: 
            dateInputElement: document.querySelector(".contents .skeleton#playground .date input"),
            titleElement: document.querySelector(".contents .skeleton#playground .title input"),
            descElement: document.querySelector(".contents .skeleton#playground textarea"),
            fileElement: document.querySelector(".contents .skeleton#playground #uploadForm input"),
            // buttons: 
            resetDateButtonElement: document.querySelector(".contents .skeleton#playground .date button.resetDate"),
            saveButtonElement: document.querySelector(".contents .skeleton#playground .buttons button#save"),
            resetButtonElement: document.querySelector(".contents .skeleton#playground .buttons button#reset"),
            // uploadButtonElement: document.querySelector("form#uploadForm input[type=\"button\"]"),
            uploadButtonElement: document.querySelector("input[type=\"button\"]"),
            // others:
            indicatorSpanElement: document.querySelector(".contents .skeleton#playground #uploadForm span.indicator"),
        }
        return doms;
    }

    // add event listener for playGround:
    addEventListenerOfPlayground() {
        this.addEventListenerOfResetDateButton(this.doms.resetDateButtonElement, this.doms.dateInputElement);
        this.addEventListenerOfSaveButton(this.doms.saveButtonElement);
        this.addEventListenerOfResetButton(this.doms.resetButtonElement);
        this.addEventListenerOfUploadButton(this.doms.uploadButtonElement);

        let form = document.querySelector("#uploadForm");

        form.addEventListener('submit', function(event) {
            console.log("Form submitted!");
            event.preventDefault(); // Prevent the form from submitting for demo purposes
        });

        form.addEventListener('reset', function() {
            console.log("Form reset!");
        });

        // Log other common events
        form.addEventListener('focusin', function(event) {
            console.log("Focus in on: ", event.target);
        });

        form.addEventListener('focusout', function(event) {
            console.log("Focus out from: ", event.target);
        });

        form.addEventListener('change', function(event) {
            console.log("Change detected in: ", event.target);
        });

        form.addEventListener('input', function(event) {
            console.log("Input event detected in: ", event.target);
        });

        // To catch all events, you can use the following approach
        form.addEventListener('click', function(event) {
            console.log("Click event detected on: ", event.target);
        });

        form.addEventListener('keyup', function(event) {
            console.log("Key up event detected: ", event.key);
        });

        document.querySelector("#uploadForm").addEventListener("submit", () => {
            console.log("############################");
        })
        // console.log("All event listener added!!")
    }

    // add event listener for all resetDateButtons, and reset to today date if clicked:
    addEventListenerOfResetDateButton(button, input) {
        button.addEventListener('click', () => {
            input.value = getTodayDate();
        })
    }

    // add event listener for the button, and return the all required info 
    addEventListenerOfSaveButton(button) {
        switch (this.currentPage) {
            case "Create Play Ground":
                return this.addEventListenerOfSB(button);
        }
    }

    // add event listener in the SB(Save Button) component of playGround page: 
    addEventListenerOfSB(button) {
        let isRequestInProgress = false;

        button.addEventListener('click', () => {
            console.log("isRequestInProgress? ", isRequestInProgress);
            if (isRequestInProgress) return;
            isRequestInProgress = true;

            // get related data for different pages:
            let data = this.takeRelatedActionsOnSB();
                      
            // only connect to database when data collected!
            const db = new MongoDBAtlas();
            const isSuccessed = this.takeActionsInDB(db, data);

            isSuccessed.then(res => {
                if (res === true) {
                    console.log("True: ", true);
                } else {
                    console.log("False: ", false);
                }
                isRequestInProgress = false;
            })
            return data;
        })
    }

    // add event listener for the button, and reset all the value on the page
    addEventListenerOfResetButton(button) {
        switch (this.currentPage) {
            case "Create Play Ground":
                return this.addEventListenerOfRBOnPG(button);
        }
    }

    // add event listener for reset button in div of play ground: 
    addEventListenerOfRBOnPG(button) {
        button.addEventListener("click", () => {
            this.resetTitle(this.doms.titleElement);
            this.resetDesc(this.doms.descElement);
            // this.resetFile();
        })
    }

    // add event listener for the upload button: 
    addEventListenerOfUploadButton(button) {
        var doms = this.doms;

        // button.addEventListener('submit', function(event) {
        //     // do not refresh the page!!
        //     event.preventDefault();
        // })

        // let form = document.querySelector("#uploadForm");
        // form.addEventListener("submit", function(event) {
        //     console.log("RRRRRR")
        //     event.preventDefault();
        // })

        button.addEventListener('click', async function(event) {
            // event.preventDefault();

            const fileInput = document.getElementById('videoFile');
            const formData = new FormData();
            formData.append('video', fileInput.files[0]);
            // console.log("FormData: ", formData);

            const db = new MongoDBAtlas();
            let res = await db.uploadVideo(formData);
            // console.log("RES: ", res);

            if (fileInput.files[0] && res === false) {
                doms.indicatorSpanElement.textContent = "Failed to Upload";
                doms.indicatorSpanElement.style.backgroundColor = "red";
            }

            if (res === true) {
                doms.indicatorSpanElement.textContent = "Successed to Upload";
                doms.indicatorSpanElement.style.backgroundColor = "green";
            }

            if (res === null) {
                doms.indicatorSpanElement.textContent = "Errors happend";
                doms.indicatorSpanElement.style.backgroundColor = "grey";
            }

            // console.log("Reload still not happenning!!!");

            // try {
            //     const response = await fetch('http://localhost:5001/upload', {
            //     method: 'POST',
            //     body: formData,
            //     });

            //     let spanElement = this.doms.span;
            //     if (response.ok) {
            //         // alert('Video uploaded successfully!');

            //     } else {
            //         alert('Failed to upload video.');
            //     }
            // } catch (error) {
            //     console.error('Error:', error);
            //     alert('An error occurred.');
            // }
        })

        // let form = document.querySelector("#uploadForm");
        // form.addEventListener("submit", function(event) {
        //     console.log("RRRRRR")
        //     event.preventDefault();
        // })
    }


    /**
     * All helper functions below: 
     */
    // GETTERS:
    getSelectedDate(element) {
        return element?.value;
    }

    getTitle(element) {
        return element?.value;
    }

    getDesc(element) {
        return element?.value;
    }

    getFile(element) {
        return element?.files[0];
    }

    // get all the input value from user of play ground page.
    getPlayGroundInfos() {
        let date = this.getSelectedDate(this.doms.dateInputElement);
        let title = this.getTitle(this.doms.titleElement);
        let desc = this.getDesc(this.doms.descElement);
        let video = this.getFile(this.doms.fileElement);
        let videoPath = this.createVideoPath(video);
        let videoHTML = this.createVideoHtmlPage(videoPath);
        let videoHTMLPagePath = this.createVideoHTMLPagePath(video);  

        let obj = {
            date: date,
            title: title,
            desc: desc,
            video: video,
            videoPath: videoPath,
            videoHTML: videoHTML,
            videoHTMLPagePath,
        }
        
        return obj;
    }

    // SETTERS:
    setTitle(element, str) {
        element.value = str;
    }

    setDesc(element, str) {
        element.value = str;
    }

    // RE_SETTERS:
    resetTitle(element) {
        this.setTitle(element, "");
    }

    resetDesc(element) {
        this.setDesc(element, "");
    }

    // OTHERS:
    createVideoPath(file) {
        if (!file) return null;

        let destinationFolderPath = "/assets/video/"
        let fileName = file.name;
        
        return destinationFolderPath + fileName;
    }

    createVideoHtmlPage(filePath) {
        let pageHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>sketch video</title>
            <link rel="stylesheet" href="./../css/video.css">
        </head>
        <body>
            
            <div class="video-container">
                    <video class="playground" src="${filePath}" controls></video>
            </div>
        </body>
        </html>
        `

        return pageHTML;
    }

    // deduped with time, if duplicated name occured the duplicate time would rarely occur on single person 
    // desktop;
    createVideoHTMLPagePath(file) {
        if (!file) return null;

        let destFolder = "/assets/HTMLs/"
        let time = getCurrentDateAndTime("-")
        let name = file.name;
        let suffix = ".html";

        return destFolder + time + name + suffix;
    }

    // ALERTS: 
    alertOnPlayGroundPage(currentPageInputs) {
        let obj = currentPageInputs;
        if (!obj.date || !obj.title || !obj.desc || !obj.videoPath) {
            window.alert("Please fill all the input box on the page!")
            return;
        }
    }

    // CREATE DATA OBJECTS:
    createDataForPG(dataObj) {
        let data = {
            date: dataObj.date,
            title: dataObj.title,
            desc: dataObj.desc,
            video: dataObj.video,
            videoPath: dataObj.videoPath,
            videoHTML: dataObj.videoHTML,
            videoHTMLPagePath: dataObj.videoHTMLPagePath,
        }
        return data;
    }

    // ACTIONS: 
    takeRelatedActionsOnSB() {
        let currentPageInputs;
        let data;

        switch (this.currentPage) {
            case "Create Play Ground":
                currentPageInputs = this.getPlayGroundInfos();
                this.alertOnPlayGroundPage(currentPageInputs);
                data = this.createDataForPG(currentPageInputs);
                return data;
        }
    }

    // return the actions in db side for each creation page.
    takeActionsInDB(db, data) {
        switch (this.currentPage) {
            case "Create Play Ground": 
                let suc1 = db.uploadVideo(video);
                console.log("UPLOAD VIDEO: ", suc1);
                
                let suc2 = db.uploadVideoMetaDataToDB(data);
                return suc1 && suc2;
        }
    }
    

}