/**
 * A class to add event Listeners for all the pages:
 */
class EventListeners {
    constructor() {
        this.currentPage = findContent();
        this.doms = this.createDoms();
    }

    // create relative DOMs
    createDoms() {
        let doms = {};

        switch (this.currentPage) {
            // testing water on the "Create Playground" page:
            case "Create Play Ground":
                doms = {
                    // inputs: 
                    dateInputElement: document.querySelector(".contents .skeleton#playground .date input"),
                    titleElement: document.querySelector(".contents .skeleton#playground .title input"),
                    descElement: document.querySelector(".contents .skeleton#playground textarea"),
                    fileElement: document.querySelector(".contents .skeleton#playground .video-upload input"),


                    // buttons: 
                    resetDateButtonElement: document.querySelector(".contents .skeleton#playground .date button.resetDate"),
                    saveButtonElement: document.querySelector(".contents .skeleton#playground .buttons button#save"),
                    resetButtonElement: document.querySelector(".contents .skeleton#playground .buttons button#reset"),
                }
                return doms;
        }
    }

    // add event listener for playGround:
    addEventListenerOfPlayground() {
        this.addEventListenerOfResetDateButton(this.doms.resetDateButtonElement, this.doms.dateInputElement);
        this.addEventListenerOfSaveButton(this.doms.saveButtonElement);
        this.addEventListenerOfResetButton(this.doms.resetButtonElement);
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
                return this.addEventListenerOfSBOnPG(button);
        }
    }

    // add event listenr in the component of playGround page: 
    addEventListenerOfSBOnPG(button) {
        let isRequestInProgress = false;

        button.addEventListener('click', () => {
            if (isRequestInProgress) return;
            isRequestInProgress = true;

            let date = this.getSelectedDate(this.doms.dateInputElement);
            let title = this.getTitle(this.doms.titleElement);
            let desc = this.getDesc(this.doms.descElement);
            let video = this.getFile(this.doms.fileElement);
            let videoPath = this.createVideoPath(video);
            let videoHTML = this.createVideoHtmlPage(videoPath);
            let videoHTMLPagePath = this.createVideoHTMLPagePath(video);
            console.log("File: ", videoPath);
            

            if (!date || !title || !desc || !videoPath) {
                window.alert("Please fill all the input box on the page!")
                return;
            }

            let data = {
                date: date,
                title: title,
                desc: desc,
                video: video,
                videoPath: videoPath,
                videoHTML: videoHTML,
                videoHTMLPagePath: videoHTMLPagePath,
            }

            console.log("Data: ", data);

            // TODO: Writing database api here later: 
            //       When progress is done or error received, return 
            //      and setIsRequestInProgress === false; 
            //      Please use try{} catch{} finally{}
            const db = new MongoDBAtlas();
            const isSuccessed = db.uploadVideo(data);
            console.log("uploading data: ", data);
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

    // test the store for the file: 
    


    /**
     * All helper functions below: 
     */
    // GETTERS:
    getSelectedDate(element) {
        console.log(element.value);
        return element.value;
    }

    getTitle(element) {
        return element.value;
    }

    getDesc(element) {
        return element.value;
    }

    getFile(element) {
        return element.files[0];
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
        let destFolder = "/assets/HTMLs/"
        let time = getCurrentDateAndTime("-")
        let name = file.name;
        let suffix = ".html";

        return destFolder + time + name + suffix;
    }

}