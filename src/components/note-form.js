import { showNotification } from "../script/utils/notification.js";
import Swal from "sweetalert2";

class NoteForm extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this._setupEventListeners();
  }

  _setupEventListeners() {
    const form = this.querySelector("form");
    const titleInput = this.querySelector("#title");
    const bodyInput = this.querySelector("#body");

    form.addEventListener("submit", this._handleSubmit.bind(this));

    titleInput.addEventListener(
      "input",
      this._validateInput.bind(this, titleInput, 5, 50),
    );
    bodyInput.addEventListener(
      "input",
      this._validateInput.bind(this, bodyInput, 10, 300),
    );
  }

  _validateInput(inputElement, minLength, maxLength) {
    const errorElement = inputElement.nextElementSibling;
    const value = inputElement.value.trim();

    if (value.length < minLength) {
      errorElement.textContent = `Minimal ${minLength} karakter.`;
      inputElement.setCustomValidity(`Minimal ${minLength} karakter.`);
    } else if (value.length > maxLength) {
      errorElement.textContent = `Maksimal ${maxLength} karakter.`;
      inputElement.setCustomValidity(`Maksimal ${maxLength} karakter.`);
    } else {
      errorElement.textContent = "";
      inputElement.setCustomValidity("");
    }

    inputElement.reportValidity();
  }

  async _handleSubmit(event) {
    event.preventDefault();

    const titleInput = this.querySelector("#title");
    const bodyInput = this.querySelector("#body");

    [titleInput, bodyInput].forEach((input) => {
      const errorElement = input.nextElementSibling;
      if (!input.value.trim()) {
        errorElement.textContent = "Wajib diisi.";
        input.setCustomValidity("Wajib diisi.");
      }
    });

    if (!titleInput.checkValidity() || !bodyInput.checkValidity()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please check your inputs and try again.",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    const submitButton = this.querySelector("button[type='submit']");
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = "Adding...";
    submitButton.disabled = true;

    try {
      const newNote = {
        title: titleInput.value.trim(),
        body: bodyInput.value.trim(),
      };

      this.dispatchEvent(
        new CustomEvent("add-note", {
          detail: { note: newNote },
          bubbles: true,
          composed: true,
        }),
      );

      titleInput.value = "";
      bodyInput.value = "";
    } catch (error) {
      showNotification("Failed to add note: " + error.message, "error");
    } finally {
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
    }
  }

  render() {
    const today = new Date().toISOString().split("T")[0];
    this.innerHTML = `
      <div class="bg-gray-100 rounded-lg p-5 shadow mb-5">
        <h2 class="text-lg font-bold text-gray-800 mt-0 mb-4">Tambah Notes Baru</h2>
        <form class="grid gap-4">
          <div class="flex flex-col">
            <label for="title" class="font-semibold mb-1 text-gray-700">Judul</label>
            <input type="text" id="title" placeholder="Masukkan judul catatan" minlength="5" maxlength="50" required 
                  class="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
            <div class="text-red-500 text-sm h-5 mt-1"></div>
          </div>
          <div class="flex flex-col">
            <label for="body" class="font-semibold mb-1 text-gray-700">Isi Catatan</label>
            <textarea id="body" placeholder="Masukkan isi catatan" minlength="10" maxlength="300" required
                     class="p-2 border border-gray-300 rounded min-h-[120px] resize-y focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"></textarea>
            <div class="text-red-500 text-sm h-5 mt-1"></div>
          </div>
          <button type="submit" 
                 class="py-3 bg-blue-500 text-white border-none rounded text-base cursor-pointer transition-colors hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
            Tambah Catatan
          </button>
        </form>
      </div>
    `;
  }
}

customElements.define("note-form", NoteForm);
