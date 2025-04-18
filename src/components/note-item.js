import Swal from "sweetalert2";
import { showNotification } from "../script/utils/notification.js";

class NoteItem extends HTMLElement {
  _note = null;

  constructor() {
    super();
  }

  set note(note) {
    this._note = note;
    this.render();
  }

  _emptyContent() {
    this.innerHTML = "";
  }

  connectedCallback() {
    if (this._note) {
      this.render();
    }
  }

  _handleDelete(event) {
    const noteId = event.target.dataset.id;

    Swal.fire({
      title: "Apakah akan menghapus note ini?",
      text: "Setelah dihapus Note tidak akan bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus sekarang!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.dispatchEvent(
          new CustomEvent("delete-note", {
            detail: { id: noteId },
            bubbles: true,
            composed: true,
          }),
        );
      }
    });
  }

  _handleArchive(event) {
    const noteId = event.target.dataset.id;
    const willArchive = !this._note.archived;

    const actionText = willArchive ? "Arsip" : "Tampilkan";

    Swal.fire({
      title: `${willArchive ? "Arsipkan" : "Tampilkan"} Note ini?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Ya, ${actionText} Note ini!`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.dispatchEvent(
          new CustomEvent("archive-note", {
            detail: {
              id: noteId,
              archived: willArchive,
            },
            bubbles: true,
            composed: true,
          }),
        );
      }
    });
  }

  render() {
    this._emptyContent();

    const formattedDate = new Date(this._note.createdAt).toLocaleDateString();

    this.innerHTML = `
      <div class="bg-white rounded-lg shadow p-4 transition transform hover:-translate-y-1 hover:shadow-md">
        <h2 class="mt-0 text-gray-800 text-lg font-medium">${this._note.title}</h2>
        <p class="text-gray-600 mb-2 break-words">${this._note.body}</p>
        <div class="text-xs text-gray-500 mt-auto">Created: ${formattedDate}</div>
        <div class="flex justify-end gap-2 mt-3">
          <button class="text-blue-500 py-1 px-2 rounded text-sm transition hover:bg-blue-50" 
                 data-id="${this._note.id}">
            ${this._note.archived ? "Unarchive" : "Archive"}
          </button>
          <button class="text-red-500 py-1 px-2 rounded text-sm transition hover:bg-red-50" 
                 data-id="${this._note.id}">Delete</button>
        </div>
      </div>
    `;

    this.querySelector(".text-red-500").addEventListener(
      "click",
      this._handleDelete.bind(this),
    );
    this.querySelector(".text-blue-500").addEventListener(
      "click",
      this._handleArchive.bind(this),
    );
  }
}

customElements.define("note-item", NoteItem);
