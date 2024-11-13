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

        button.addEventListener('click', async function(event) {
            const fileInput = document.getElementById('videoFile');
            const formData = new FormData();
            formData.append('video', fileInput.files[0]);

            const db = new MongoDBAtlas();
            let res = await db.uploadVideo(formData);

            const textContent = doms.indicatorSpanElement.textContent;
            const bgColor = doms.indicatorSpanElement.style.backgroundColor;
            if (fileInput.files[0] && res === false) {
                textContent = "Failed to Upload";
                bgColor = "red";
            }

            if (res === true) {
                textContent = "Successed to Upload";
                bgColor = "green";
            }

            if (res === null) {
                textContent = "Errors happend";
                bgColor = "grey";
            }
        })
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

        let destinationFolderPath = "/server/assets/video/"
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
            <style>
                body {
                    background-color: grey;
                }

                .video-container {
                    text-align: center;
                }
                video {
                    height: 80vh;
                    width: fit-content;
                    margin: 10vh 0;
                }
            </style>
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

        let destFolder = "/server/assets/html/"
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
    async takeActionsInDB(db, data) {
        switch (this.currentPage) {
            case "Create Play Ground": 

                const metaDataObj = {
                    userID: ROOT_USER_ID,
                    date: data.date,
                    title: data.title,
                    desc: data.desc,
                    videoHTMLPagePath: data.videoHTMLPagePath,
                }
                console.log("metaDataObj: ", metaDataObj);
                let suc3 = await db.uploadVideoMetaDataToDB(metaDataObj);


                let formData = new FormData();
                formData.append('video', data.video);
                let suc1 = await db.uploadVideo(formData);
                
                const dataObj = {
                    videoHTML: data.videoHTML,
                    videoHTMLPagePath: data.videoHTMLPagePath,
                }
                let suc2 = await db.uploadVideoHTML(dataObj);

                if (suc1 && suc2 && suc3) {
                    alert("All successed!!!");
                }
                else {
                    alert("Something wrong!!!");
                }

                return suc1 && suc2 && suc3;
        }
    }
    

}