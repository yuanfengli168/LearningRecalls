/**
 * @interface 
 */
class CreationPageInterface {
    /**
     * @abstract
     * @returns {void}
     */
    // number means how many vertical 
    // divs you would like in the skeleton.
    constructor(number) {
        this.number = number;
    }

    // build the outer div for the page: 
    buildSkeleton(id) {}
    
    // build sections in the skeleton
    buildSections() {}

    buildButtons() {}
}

// export default CreationPageInterface;