class UIHandler { 
    constructor() {
        this.pageTitle = document.title;
        this.titleTxt = document.getElementById("page-title");
        let indexBtn = this.getButton("index-link");
        let writerBtn = this.getButton("writer-link");
        let readerBtn = this.getButton("reader-link");
    }

    getButton(btnId) {
        return document.getElementById(btnId);
    }

    displayTitle() {
        switch (this.pageTitle) {
            case "Lab 1":
                this.titleTxt.textContent = userText.pageTitles[0];
                break;
            case "Writer":
                this.titleTxt.textContent = userText.pageTitles[1];
                break;
            case "Reader":
                this.titleTxt.textContent = userText.pageTitles[2];
                break;
            default:
                this.titleTxt.textContent = "Unknown Page";
        }
    }

    populateNavButtons() {
        if (indexBtn) {
            indexBtn.textContent = userText.pageTitles[0];
        }
        if (writerBtn) {
            writerBtn.textContent = userText.pageTitles[1];
        }
        if (readerBtn) {
            readerBtn.textContent = userText.pageTitles[2];
        }
    }

}

class NoteCard {
    constructor(id) {


        this.element = document.createElement("div");
    }
}

class updateHandler {}