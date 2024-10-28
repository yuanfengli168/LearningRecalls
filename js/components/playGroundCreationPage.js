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
        let uploadComponent = `
            <form id="uploadForm" accept-charset="UTF-8">
                <input type="file" id="videoFile" accept="video/mp4" accept-charset="UTF-8" required>
                <button type="button">Upload</button>
            </form>
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
        
        let result = super.buildWholePage({dateIndex, buttonIndex});;
    
        return result;
    }

    addEventListeners() {
        const eventL = new EventListeners();
        eventL.addEventListenerOfPlayground();

        // TODO: encapsul it!!
        // test for uploadVideo: 
        let button = document.querySelector("form#uploadForm button");
        button.addEventListener('click', async () => {
            const fileInput = document.getElementById('videoFile');
            const formData = new FormData();
            formData.append('video', fileInput.files[0]);
            console.log("FormData: ", formData);

            try {
                const response = await fetch('http://localhost:5001/upload', {
                method: 'POST',
                body: formData,
                });

                if (response.ok) {
                alert('Video uploaded successfully!');
                } else {
                alert('Failed to upload video.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred.');
            }
        })
    }
}

// export default PlayGroundCreationPage;