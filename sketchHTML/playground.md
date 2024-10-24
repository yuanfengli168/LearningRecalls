# Notes on playground:


## notes on implementations: 
1. how to get the html inside of the iframe: 
    -  ``` document.querySelectorAll("pre.CodeMirror-line")[4].textContent, let 
    

    const iframe = document.querySelector("iframe.codepen");
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

    html = document.querySelectorAll(".boxes .top-boxes .box-html pre.CodeMirror-line");

    let strOfHtml = "";
    for (let l of html) {
        let curText = l.textContent;
        strOfHtml += curText + "\n";
    }
    ```

    We don't do the saving, we just will save all in the Github-gist, just need to type the date, and content which is easier for later!


