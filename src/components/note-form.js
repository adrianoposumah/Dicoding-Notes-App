class NoteForm extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");
    this._shadowRoot.appendChild(this._style);
    this._updateStyle();
  }

  connectedCallback() {
    this.render();
    this._setupEventListeners();
  }

  _setupEventListeners() {
    const form = this._shadowRoot.querySelector("form");
    const titleInput = this._shadowRoot.querySelector("#title");
    const bodyInput = this._shadowRoot.querySelector("#body");

    form.addEventListener("submit", this._handleSubmit.bind(this));

    titleInput.addEventListener("input", this._validateInput.bind(this, titleInput, 5, 50));
    bodyInput.addEventListener("input", this._validateInput.bind(this, bodyInput, 10, 300));
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

  _handleSubmit(event) {
    event.preventDefault();

    const titleInput = this._shadowRoot.querySelector("#title");
    const bodyInput = this._shadowRoot.querySelector("#body");
    const dateInput = this._shadowRoot.querySelector("#date");

    // Tampilkan pesan "wajib diisi" jika input kosong
    [titleInput, bodyInput].forEach((input) => {
      const errorElement = input.nextElementSibling;
      if (!input.value.trim()) {
        errorElement.textContent = "Wajib diisi.";
        input.setCustomValidity("Wajib diisi.");
      }
    });

    if (!titleInput.checkValidity() || !bodyInput.checkValidity()) {
      alert("Periksa kembali input yang wajib diisi.");
      return;
    }

    const newNote = {
      id: `notes-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: titleInput.value.trim(),
      body: bodyInput.value.trim(),
      createdAt: dateInput.value,
      archived: false,
    };

    this.dispatchEvent(
      new CustomEvent("add-note", {
        detail: { note: newNote },
        bubbles: true,
        composed: true,
      })
    );

    titleInput.value = "";
    bodyInput.value = "";
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
        margin-bottom: 20px;
      }
      
      .form-container {
        background-color: #f5f5f5;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      
      h2 {
        margin-top: 0;
        color: #333;
      }
      
      form {
        display: grid;
        gap: 15px;
      }
      
      .form-group {
        display: flex;
        flex-direction: column;
      }
      
      label {
        font-weight: bold;
        margin-bottom: 5px;
        color: #555;
      }
      
      input, textarea {
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-family: inherit;
        font-size: 1rem;
      }
      
      textarea {
        min-height: 120px;
        resize: vertical;
      }
      
      input:focus, textarea:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
      }
      
      input:invalid, textarea:invalid {
        border-color: #e74c3c;
      }
      
      .error {
        color: #e74c3c;
        font-size: 0.9rem;
        min-height: 20px;
        margin-top: 5px;
      }
      
      button {
        padding: 12px;
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.2s;
      }
      
      button:hover {
        background-color: #2980b9;
      }
      
      button:disabled {
        background-color: #bdc3c7;
        cursor: not-allowed;
      }
    `;
  }

  render() {
    const today = new Date().toISOString().split("T")[0];
    this._shadowRoot.innerHTML += `
      <div class="form-container">
        <h2>Tambah Notes Baru</h2>
        <form>
          <div class="form-group">
            <label for="title">Judul</label>
            <input type="text" id="title" placeholder="Masukkan judul catatan" minlength="5" maxlength="50" required />
            <div class="error"></div>
          </div>
          <div class="form-group">
            <label for="body">Isi Catatan</label>
            <textarea id="body" placeholder="Masukkan isi catatan" minlength="10" maxlength="300" required></textarea>
            <div class="error"></div>
          </div>
          <input type="date" id="date" value="${today}" hidden />
          <button type="submit">Tambah Catatan</button>
        </form>
      </div>
    `;
  }
}

customElements.define("note-form", NoteForm);
