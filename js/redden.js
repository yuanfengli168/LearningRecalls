// redden.js create an object to make the content and answers lines red
// based on the previous score information:
// e.g. score: 10(1, 2, 4,) from the latest result
// when clean on take quiz, the content's 1,2,4 lines will be in red. 
class Redden {
    constructor() {

    }

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
            // console.log(result);
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

    makeLinesRed(content, lines) {
        // check if we need to do anything.
        if (!this.isLinesValid(lines)) {
            return content;
        }
        else {
            // // let prefix = `<span style="color: red;">I am red!!!</span>`;
            // // let result = prefix + content;
            // console.log("lines: ", lines);
            // for (let line of lines) {
            //     let number = parseInt(line);
            //     if (isNaN(number)) {
            //         continue;
            //     } 
            //     else {
            //         content = this.addRedSpanToLine(number, content);
            //     }
            // }

            // return content;

            content = this.addRedSpanToLine(lines, content);
            return content;
        }
    }

    addRedSpanToLine(lines, content) {
        lines = lines.map(x => !isNaN(parseInt(x)) ? parseInt(x) : -1);
        lines.sort((a, b) => a - b);

        // console.log(lines);
        let arrOfContent = content.split("\n");
        // console.log(arrOfContent);

        let arrOfResult = [];


        
        lines = lines.map(x => x + "");
        // console.log(lines, typeof lines);

        for (let con of arrOfContent) {
            if (this.matchString(con) && this.matchLines(lines, con)) {
                con = `<span style="color: red;">` + con + "</span>";
                // console.log("Matched: ", con);
            } 
            arrOfResult.push(con);
        }

        let result = arrOfResult.join("\n");
        // console.log("Result: ", arrOfResult);
        return result;
    }

    matchLines(lines, con) {
        // console.log(lines);
        // console.log(con);

        let matched = con.match(/^\d+\./);
        // console.log("Matched: ", matched[0].slice(0, -1),);


        return lines.includes(matched[0].slice(0, -1))
    }

    matchString(str) {
        const regex = /^\d+\./;
        return regex.test(str);
    }




    // // returns a new content only at the number passed into the function
    // // number is an array of numbers representing the No. of the line
    // addRedSpanToLine(number, content) {
    //     let prefixIndexs = [];
    //     let postfixIndexs = [];

    //     for (let i = 0; i < content.length; i++) {
    //         // console.log("numbers: line content: ", number, i, content[i]);
    //         let char = content[i];

    //         if (char == number && content[i+1] === ".") {
    //             // we are at the beginning of the line!!
    //             // let temp = this.insertString(content, ` <span style="color: red;">I am red!!!</span> \n`, i)
    //             // console.log("content: ", temp);
    //             // console.log("yess!!!!")
                
    //             // content = "1111" + content;
    //             // content = this.insertString(content, ` <span style="color: red;">I am red!!!</span> \n`, i)

    //             // console.log(typeof content);
    //             // // bug: stackoverflowed: because your for's i is refreshing all the time;
    //             // content = ` <span style="color: red;">I am red!!!</span> \n` + content;
    //             // console.log(content);       

    //             prefixIndexs.push(i);
    //             while (i < content.length) {
    //                 if (content[i] === '\n') {
    //                     postfixIndexs.push(i);
    //                     break;
    //                 }
    //                 i++;
    //             }
    //         }
    //     }

    //     // content = ` <span style="color: red;">I am red!!!</span> \n` + content;
    //     // console.log(resultIndexs);
    //     console.log(postfixIndexs);

    //     // let str = ` <span style="color: red;">I am red!!!</span> \n`;
    //     let prefix = `<span style="color: red;">`;
    //     let offset = 0;
    //     let arrOfRes = this.insertMultipleStrings(content, prefixIndexs, prefix, offset);
    //     content = arrOfRes[0];
    //     offset = arrOfRes[1];

    //     let postfix = '</span>';
    //     arrOfRes = this.insertMultipleStrings(content, postfixIndexs, postfix, offset);
    //     content = arrOfRes[0];
    //     offset = arrOfRes[1];

    //     console.log("CONTENT: ", content);
        
    //     return content;
    // }

    // can only insert one index,
    // insertString(original, insert, index) {
    //     return original.slice(0, index) + insert + original.slice(index);
    // }

    // can insert multiple and single index.
    insertMultipleStrings(original, inserts, str, offset) {
        // Sort inserts by index in ascending order to avoid issues with shifting positions
        // inserts.sort((a, b) => a.index - b.index);
        inserts.sort((a, b) => a - b);


        let result = original;
        offset = offset;  // Keeps track of the shifting due to insertions

        inserts.forEach(index => {
            result = result.slice(0, index + offset) + str + result.slice(index + offset);
            offset += str.length;  // Update offset based on the length of the inserted string
        });

        return [result, offset];
    }

}