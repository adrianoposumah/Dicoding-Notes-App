class NoteItem extends HTMLElement {
  _note = null;
  _shadowRoot = null;
  _style = null;

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");
  }

  set note(note) {
    this._note = note;
    this.render();
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        padding: 16px;
        transition: transform 0.2s ease;
      }
      
      :host(:hover) {
        transform: translateY(-5px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      
      h2 {
        margin-top: 0;
        color: #333;
        font-size: 1.2rem;
      }
      
      p {
        color: #666;
        margin-bottom: 10px;
        overflow-wrap: break-word;
      }
      
      .date {
        font-size: 0.8rem;
        color: #999;
        margin-top: auto;
      }
      
      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 10px;
      }
      
      button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 0.9rem;
        transition: background-color 0.2s;
      }
      
      .delete-btn {
        color: #e74c3c;
      }
      
      .delete-btn:hover {
        background-color: #fde0dc;
      }
      
      .archive-btn {
        color: #3498db;
      }
      
      .archive-btn:hover {
        background-color: #e1f0fa;
      }
    `;
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  connectedCallback() {
    if (this._note) {
      this.render();
    }
  }

  _handleDelete(event) {
    this.dispatchEvent(
      new CustomEvent("delete-note", {
        detail: {
          id: event.target.dataset.id,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  _handleArchive(event) {
    this.dispatchEvent(
      new CustomEvent("archive-note", {
        detail: {
          id: event.target.dataset.id,
          archived: !this._note.archived,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);

    const formattedDate = new Date(this._note.createdAt).toLocaleDateString();

    this._shadowRoot.innerHTML += `
      <h2>${this._note.title}</h2>
      <p>${this._note.body}</p>
      <div class="date">Created: ${formattedDate}</div>
      <div class="actions">
        <button class="archive-btn" data-id="${this._note.id}">
          ${this._note.archived ? "Unarchive" : "Archive"}
        </button>
        <button class="delete-btn" data-id="${this._note.id}">Delete</button>
      </div>
    `;

    this._shadowRoot.querySelector(".delete-btn").addEventListener("click", this._handleDelete.bind(this));
    this._shadowRoot.querySelector(".archive-btn").addEventListener("click", this._handleArchive.bind(this));
  }
}

customElements.define("note-item", NoteItem);
