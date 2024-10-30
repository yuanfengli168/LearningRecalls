// import CreationPage from "./creationPage.js";

class PlayGroundCreationPage extends CreationPage {
    static SAVE_NAME = "Playground";
    static RESET_NAME = "Playground";
    static ID = "playground";
    static NUMBER = 5;

    constructor(number = PlayGroundCreationPage.NUMBER) {
        super(number);
    }

    // build and put the title into the related index of section on page
    buildTitleComponent(indexOnPage) {
        let titleComponent = `
            <div class="title">
                <label> Please type the title of video: 
                    <input type="text">
                </label>
            </div>
        `
        this.array[indexOnPage] = titleComponent;
        return titleComponent;
    }

     buildVideoUploadComponent(indexOnPage) {
        // <button id="btnID" type="submit" onclick="return false">Upload</button>
        let uploadComponent = `
            <form id="uploadForm" accept-charset="UTF-8" onsubmit="return false;">
                <input type="file" id="videoFile" accept="video/mp4" accept-charset="UTF-8" required>
                <input type="button" name="data" value="Upload">
                <span class="indicator" style="display: inline-block; margin: 0 16px"></span>
            </form>
        `

        // // still reloads the page:
        // let uploadComponent = `
        //     <div id="uploadForm">
        //         <input type="file" id="videoFile" accept="video/mp4" accept-charset="UTF-8" required>
        //         <input type="button" name="data" value="Upload">
        //         <span class="indicator" style="display: inline-block; margin: 0 16px"></span>
        //     </div>
        // `

        this.array[indexOnPage] = uploadComponent;
        return uploadComponent;
     }

    // build and put the description into the related index of section on page
    buildDescriptionComponent(indexOnPage) {
        let descComponent = `
            <div class="desc">
                <label for="desc">Please type Descriptions here: </label>
                <textarea></textarea>
            </div>
        `
        this.array[indexOnPage] = descComponent;
        return descComponent;
    }

    // build the whole page.
    buildWholePage({dateIndex, buttonIndex, titleIndex, descIndex, videoIndex}) {
        this.buildTitleComponent(titleIndex);
        this.buildVideoUploadComponent(videoIndex);
        this.buildDescriptionComponent(descIndex);
        
        let result = super.buildWholePage({dateIndex, buttonIndex});;
    
        return result;
    }

    addEventListeners() {
        const eventL = new EventListeners();
        eventL.addEventListenerOfPlayground();
    }
}

// export default PlayGroundCreationPage;