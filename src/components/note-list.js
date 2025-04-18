class NoteList extends HTMLElement {
  _notes = [];
  _showArchived = false;

  constructor() {
    super();
  }

  set notes(notes) {
    this._notes = notes;
    this.render();
  }

  _emptyContent() {
    this.innerHTML = "";
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
    const toggleButton = this.querySelector(".toggle-button");
    if (toggleButton) {
      toggleButton.addEventListener("click", () => {
        this.showArchived = !this.showArchived;
        // Dispatch a custom event when archive toggle changes
        this.dispatchEvent(
          new CustomEvent("archive-toggle", {
            bubbles: true,
            composed: true,
          }),
        );
      });
    }
  }

  render() {
    this._emptyContent();

    const filteredNotes = this._notes || [];

    this.innerHTML = `
      <div class="block">
        <div class="flex justify-between items-center mb-5">
          <h2 class="m-0 text-gray-800 text-xl font-bold">${this._showArchived ? "Archived Notes" : "My Notes"}</h2>
          <button class="toggle-button bg-blue-500 text-white border-none rounded py-2 px-4 cursor-pointer text-sm transition-colors hover:bg-blue-600">
            ${this._showArchived ? "Show Active Notes" : "Show Archived Notes"}
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 notes-container">
          ${
            filteredNotes.length > 0
              ? ""
              : `<div class="text-center py-10 text-gray-500 italic bg-gray-50 rounded-lg col-span-full">
              ${this._showArchived ? "No archived notes found." : "No notes found. Create your first note!"}
            </div>`
          }
        </div>
      </div>
    `;

    const notesContainer = this.querySelector(".notes-container");

    if (filteredNotes.length > 0) {
      filteredNotes.forEach((note, index) => {
        const noteItemElement = document.createElement("note-item");
        noteItemElement.note = note;
        noteItemElement.setAttribute("data-aos", "fade-up");
        noteItemElement.setAttribute("data-aos-delay", `${index * 100}`);
        noteItemElement.setAttribute("data-aos-duration", "800");

        notesContainer.appendChild(noteItemElement);
      });
    }

    this._setupEventListeners();
  }
}

customElements.define("note-list", NoteList);
