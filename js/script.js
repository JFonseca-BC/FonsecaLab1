class UIHandler { 
    constructor() {
        this.pageTitle = document.title;
        this.titleTxt = document.getElementById("page-title");
        this.updateTxt = document.getElementById("update-time");
        
        this.indexBtn = this.getButton("index-link");
        this.writerBtn = this.getButton("writer-link");
        this.readerBtn = this.getButton("reader-link");
    }

    getButton(btnId) {
        return document.getElementById(btnId);
    }

    displayTitle() {
        switch (this.pageTitle) {
            case "Lab 1":
                if(this.titleTxt) this.titleTxt.textContent = userText.labTitle;
                break;
            case "Writer":
                if(this.titleTxt) this.titleTxt.textContent = userText.pageTitles[1];
                break;
            case "Reader":
                if(this.titleTxt) this.titleTxt.textContent = userText.pageTitles[2];
                break;
            default:
                if(this.titleTxt) this.titleTxt.textContent = "Unknown Page";
        }
    }

    populateNavButtons() {
        if (this.writerBtn) {
            this.writerBtn.textContent = userText.pageTitles[1]; // "writer.html"
        }
        if (this.readerBtn) {
            this.readerBtn.textContent = userText.pageTitles[2]; // "reader.html"
        }


        if (this.indexBtn) {
            this.indexBtn.textContent = userText.pageTitles[0]; // "index.html"
        }
    }

    updateTimeDisplay() {
        if (this.updateTxt) {
            const now = new Date();
            const timeString = now.toLocaleTimeString(); 

            if (this.pageTitle === "Reader") {
                this.updateTxt.textContent = userText.timeTexts[0] + " " + timeString;
            } else if (this.pageTitle === "Writer") {
                this.updateTxt.textContent = userText.timeTexts[1] + " " + timeString;
            }
        }
    }
}

class NoteCard {
    constructor(content, type, index, removeCallback) {
        this.element = document.createElement("div");
        this.element.style.marginBottom = "1em";

        const boxWidth = "15em";
        const boxHeight = "4em";

        if (type === "Writer") {
            const textArea = document.createElement("textarea");
            textArea.value = content;
            textArea.style.width = boxWidth;
            textArea.style.height = boxHeight;
            textArea.style.verticalAlign = "middle";
            
            const btn = document.createElement("button");
            btn.textContent = userText.buttons[1]; 
            btn.style.marginLeft = "1em";
            btn.style.backgroundColor = "orange";
            btn.style.color = "white";
            btn.style.border = "none";
            btn.style.padding = "0.5em 1em";
            btn.style.borderRadius = "0.3em";
            btn.style.cursor = "pointer";


            btn.onclick = function() {
                removeCallback(index);
            };

            this.element.appendChild(textArea);
            this.element.appendChild(btn);

        } else if (type === "Reader") {
            const p = document.createElement("p");
            p.textContent = content;
            p.style.backgroundColor = "#4a90e2";
            p.style.color = "white";
            p.style.padding = "1em";
            p.style.width = boxWidth; 
            p.style.minHeight = boxHeight;           
            this.element.appendChild(p);
        }
    }
}

class updateHandler {
    constructor() {
        this.ui = new UIHandler();
        this.notesContainer = document.getElementById("notes-container");
        this.storageKey = "lab1_notes";
        
        this.removeNote = this.removeNote.bind(this);
        this.addNote = this.addNote.bind(this);
        this.saveNotesFromDOM = this.saveNotesFromDOM.bind(this);
        this.refreshReader = this.refreshReader.bind(this);
        
        this.init();
    }

    init() {
        this.ui.displayTitle();
        this.ui.populateNavButtons(); 
        
        if (document.title === "Writer") {
            this.initWriter();
        } else if (document.title === "Reader") {
            this.initReader();
        }
    }

    // --- Writer Logic ---
    initWriter() {
        this.renderWriterNotes();

        const self = this;
        setInterval(function() {
            self.saveNotesFromDOM();
            self.ui.updateTimeDisplay();
        }, 2000);
    }

    getNotes() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    renderWriterNotes() {
        const notes = this.getNotes();
        this.notesContainer.innerHTML = ""; 

        const self = this;
        notes.forEach(function(noteContent, index) {
            const card = new NoteCard(noteContent, "Writer", index, self.removeNote);
            self.notesContainer.appendChild(card.element);
        });

        const addBtn = document.createElement("button");
        addBtn.textContent = userText.buttons[0]; 
        addBtn.style.backgroundColor = "green";
        addBtn.style.color = "white";
        addBtn.style.border = "none";
        addBtn.style.padding = "0.5em 2em";
        addBtn.style.marginTop = "1em";
        addBtn.style.borderRadius = "0.3em";
        addBtn.style.cursor = "pointer";
        addBtn.onclick = this.addNote;

        this.notesContainer.appendChild(addBtn);
    }

    addNote() {
        const currentNotes = this.scrapeNotesFromDOM();
        currentNotes.push("");
        localStorage.setItem(this.storageKey, JSON.stringify(currentNotes));
        this.renderWriterNotes();
    }

    removeNote(index) {
        const currentNotes = this.scrapeNotesFromDOM();
        currentNotes.splice(index, 1);
        localStorage.setItem(this.storageKey, JSON.stringify(currentNotes));
        this.renderWriterNotes();
    }

    scrapeNotesFromDOM() {
        const textAreas = this.notesContainer.querySelectorAll("textarea");
        const notes = [];
        textAreas.forEach(function(area) {
            notes.push(area.value);
        });
        return notes;
    }

    saveNotesFromDOM() {
        const notes = this.scrapeNotesFromDOM();
        localStorage.setItem(this.storageKey, JSON.stringify(notes));
    }

    // --- Reader Logic ---
    initReader() {
        this.refreshReader();

        const self = this;
        setInterval(function() {
            self.refreshReader();
        }, 2000);
    }

    refreshReader() {
        const notes = this.getNotes();
        this.notesContainer.innerHTML = ""; 

        const self = this;
        notes.forEach(function(noteContent) {
            const card = new NoteCard(noteContent, "Reader");
            self.notesContainer.appendChild(card.element);
        });

        this.ui.updateTimeDisplay();
    }
}

document.addEventListener("DOMContentLoaded", function() {
    new updateHandler();
});