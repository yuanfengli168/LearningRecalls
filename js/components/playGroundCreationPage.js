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

    // build and put the video upload into the related index of section on page
    buildVideoUploadComponent(indexOnPage) {
        let uploadComponent = `
            <div class="video-upload">
                <p>Please upload video here: </p>
                <input type="file" accept=".mp4">
                <p>Only accept .mp4 type</p>
            </div>
        `
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

        return super.buildWholePage({dateIndex, buttonIndex});
    }
}

// export default PlayGroundCreationPage;