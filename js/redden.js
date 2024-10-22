// redden.js create an object to make the content and answers lines red
// based on the previous score information:
// e.g. score: 10(1, 2, 4,) from the latest result
// when clean on take quiz, the content's 1,2,4 lines will be in red. 

// I created and made this class works in 2 hours (10/21/2024)
class Redden {
     /**
     * return array of line numbers
     * @param {array} originally from data.results 
     * @return {array} can be empty, but containing lines number in number
    */
    getWrongLines(results) {
        // if no results yet, we do nothing, no console.error as well.
        if (results.length === 0) {  
            return [];
        }

        let result = [];
        if (results) {
            // get the last one which with the closest date:
            const res = results.at(-1); // is a object
            const score = res.score;
            const insidePar = this.getContentInParenthesis(score);
            result = insidePar.split(",");
        }
        
        return result;
    }

    /**
     * return the string inside parenthesis (if exists) of the input string
     * @param {string} a string may have only one parenthesis in it. 
     * @return {string} the content inside the parenthesis but without parenthesis
     */
    getContentInParenthesis(str) {
        const match = str.match(/\(([^)]+)\)/);
        // If there's a match, return the captured group, otherwise return null
        return match ? match[1] : "";
    }

    // see if array of lines number contain any numbers
    isLinesValid(lines) {
        for (let l of lines) {
            if (parseInt(l)) {
                return true;
            }
        }
        return false;
    }

    // only make some target lines red
    makeLinesRed(content, lines) {
        // check if we need to do anything.
        if (!this.isLinesValid(lines)) {
            return content;
        }
        else {
            content = this.addRedSpanToLine(lines, content);
            return content;
        }
    }

    // adding <span> element to the target line
    addRedSpanToLine(lines, content) {
        lines = lines.map(x => !isNaN(parseInt(x)) ? parseInt(x) : -1);
        lines.sort((a, b) => a - b);

        let arrOfContent = content.split("\n");
        let arrOfResult = [];

        lines = lines.map(x => x + "");

        for (let con of arrOfContent) {
            if (this.matchString(con) && this.matchLines(lines, con)) {
                con = `<span style="color: red;">` + con + "</span>";
            } 
            arrOfResult.push(con);
        }

        let result = arrOfResult.join("\n");
        return result;
    }

    // if the lines number found in the current line of content -> con
    matchLines(lines, con) {
        let matched = con.match(/^\d+\./);
        return lines.includes(matched[0].slice(0, -1))
    }

    // see if the lines starts with the lines
    matchString(str) {
        const regex = /^\d+\./;
        return regex.test(str);
    }
}