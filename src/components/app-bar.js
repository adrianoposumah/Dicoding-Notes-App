class AppBar extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["brand-name"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "brand-name") {
      this.render();
    }
  }

  _emptyContent() {
    this.innerHTML = "";
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this._emptyContent();

    const brandName = this.getAttribute("brand-name") || "Notes App";

    this.innerHTML = `      
      <div class="w-full bg-blue-500 text-white shadow-md">
        <div class="px-5 py-6">
          <h1 class="text-2xl font-bold m-0">${brandName}</h1>
        </div>
      </div>
    `;
  }
}

customElements.define("app-bar", AppBar);
