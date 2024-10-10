class Filters {
    constructor(tag = "", order = "1") {
        this.tag = tag;
        this.order = order;
    }

    // adding the filters into the webpage:
    async renderFilters(tag, order) {
        this.tag = tag;
        this.order = order;
        console.log("RenderFilters, tag, order: ", tag, order, this.tag, this.order);

        try {
            // get the data from backend
            const mongoDbAtlas = new MongoDBAtlas();
            const tags = await mongoDbAtlas.getAllTags(ROOT_USER_ID);
            // console.log("Tags: ", tags);

            let tagOptions = ``;
            for (let tag of tags) {
                let tagOption = `
                     <option value=${tag}>
                        ${tag}
                    </option>
                `
                tagOptions += tagOption;
            }
            // console.log(tagOptions);

            let quizHistoryContainer = document.querySelector('.QuizHistoryContainer .filters-container');
            if (quizHistoryContainer) {
                let newChild = document.createElement('div');
                let filterContent = `
                    <div class="filters">
                        <form action="">
                            <label for="filter-select">Filters: </label>
                            <select name="" id="tag">
                                <option value="">
                                    choose one tag
                                </option>
                                ${tagOptions}
                            </select>

                            <select name="" id="order">
                                <option value="1">
                                    choose order
                                </option>
                                <option value="2">
                                    non-chronological (Most Recent first)
                                </option>
                                <option value="3">
                                    chronological (Least Recent first)
                                </option>
                                
                            </select>
                        </form>
                    </div>`
                newChild.innerHTML = filterContent;
                let parentElemnt = quizHistoryContainer;
                parentElemnt.appendChild(newChild);


                this.addOrderEventListener();
                this.addTagEventListener();

                this.setTagValue(tag);
                this.setOrderValue(order);

            }
        } 
        catch(e) {
            throw new Error(e);
        }
    }


    // listen to the filters and get value for tag and order:
    // return tag value
    getTagValue() {
        // add event listener on option. 
        return document.querySelector('.filters form select#tag').value;
    }


    getOrderValue() {
        return document.querySelector('.filters form select#order')?.value;
    }
    
    setTagValue(tag) {
        // add event listener on option. 
        document.querySelector('.filters form select#tag').value = tag;
    }


    setOrderValue(order) {
        document.querySelector('.filters form select#order').value = order;
    }

    // bug1: this.order in the function() {} 
    //       the this is referring to the functio instead of the class.
    addTagEventListener() {
        let tag = document.querySelector('.filters form select#tag');
        this.order = this.getOrderValue();
        // console.log("this.order: ", this.order);

        if (tag) {
                tag.addEventListener('change', () => {
                // get the value of the selected option;
                let selectedValue = tag.value;

                let parent = document.querySelector(".quiz");
                parent.innerHTML = '';

                // ??? will the arrow function helping 
                //     making this reference to the class instead of function?
                console.log(this.tag);
                this.tag = selectedValue;
                this.order = this.getOrderValue();
                showPreviousQuizs(null, this.tag, this.order);

                // console.log("tag value: ", selectedValue, this.tag);
                // console.log("order value: ", this.order);
            })
        }
        
    }

    addOrderEventListener() {
        let order = document.querySelector('.filters form select#order');
        this.tag = this.getTagValue();
        // console.log("this.tag: ", this.tag);

        if (order) {
            order.addEventListener('change', () => {
            let selectedValue = order.value;
            let parent = document.querySelector(".quiz");
            parent.innerHTML = '';
            this.order = selectedValue;
            this.tag = this.getTagValue();
            showPreviousQuizs(null, this.tag, this.order);
            })
        }
        
    }
}