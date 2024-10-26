// import CreationPageInterface from "./creationPageInterface.js";

class CreationPage extends CreationPageInterface {
    constructor(number) {
        super(number);
    }

    buildSkeleton(id) {
        if (!id) {
            id = "unknown";
        }

        const sections = this.buildSections();
        const skeletonHTML = `<div class="skeleton" id=${id}>` + sections + `</div>`;
        return skeletonHTML;
    }

    buildSections() {
        let result = ``;
        for (let i = 1; i <= this.number; i++) {
            let section = `
                <div class=section-${i}>

                </div>
            `
            result += section;
        }
        return result;
    }


    buildButtons(saveName, resetName) {
        let buttons = 
        `<div class="buttons">
                <button id="save">Save ${saveName}</button>
                <button disabled>Append to Same Tag Today</button>
                <button id="reset">Reset ${resetName}</button>
        </div>`
        return buttons;
    }

}

// export default CreationPage;