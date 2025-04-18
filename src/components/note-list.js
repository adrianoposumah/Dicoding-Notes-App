class NoteList extends HTMLElement {
  _notes = [];
  _showArchived = false;
  _shadowRoot = null;
  _style = null;

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");
  }

  set notes(notes) {
    this._notes = notes;
    this.render();
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
      }
      
      .notes-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
      }
      
      .notes-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
      
      h2 {
        margin: 0;
        color: #333;
      }
      
      .toggle-archived {
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 8px 16px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: background-color 0.2s;
      }
      
      .toggle-archived:hover {
        background-color: #2980b9;
      }
      
      .empty-state {
        text-align: center;
        padding: 40px;
        color: #999;
        font-style: italic;
        background-color: #f9f9f9;
        border-radius: 8px;
        grid-column: 1 / -1;
      }
      
      @media (max-width: 600px) {
        .notes-container {
          grid-template-columns: 1fr;
        }
      }
    `;
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  static get observedAttributes() {
    return ["show-archived"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "show-archived") {
      this._showArchived = newValue === "true";
      this.render();
    }
  }

  get showArchived() {
    return this.getAttribute("show-archived") === "true";
  }

  set showArchived(value) {
    this.setAttribute("show-archived", value);
  }

  connectedCallback() {
    this.render();
    this._setupEventListeners();
  }

  _setupEventListeners() {
    const toggleButton = this._shadowRoot.querySelector(".toggle-archived");
    if (toggleButton) {
      toggleButton.addEventListener("click", () => {
        this.showArchived = !this.showArchived;
      });
    }
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);

    const filteredNotes = this._notes.filter((note) => note.archived === this._showArchived);

    this._shadowRoot.innerHTML += `
      <div class="notes-header">
        <h2>${this._showArchived ? "Archived Notes" : "My Notes"}</h2>
        <button class="toggle-archived">
          ${this._showArchived ? "Show Active Notes" : "Show Archived Notes"}
        </button>
      </div>
      
      <div class="notes-container">
        ${
          filteredNotes.length > 0
            ? ""
            : `<div class="empty-state">
            ${this._showArchived ? "No archived notes found." : "No notes found. Create your first note!"}
          </div>`
        }
      </div>
    `;

    const notesContainer = this._shadowRoot.querySelector(".notes-container");

    if (filteredNotes.length > 0) {
      filteredNotes.forEach((note) => {
        const noteItemElement = document.createElement("note-item");
        noteItemElement.note = note;
        notesContainer.appendChild(noteItemElement);
      });
    }

    this._setupEventListeners();
  }
}

customElements.define("note-list", NoteList);
