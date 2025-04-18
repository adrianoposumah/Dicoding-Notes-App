class Loader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._visible = false;
    this._init();
  }

  _init() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(255, 255, 255, 0.8);
          z-index: 9999;
          justify-content: center;
          align-items: center;
          transition: opacity 0.3s ease;
          opacity: 0;
          pointer-events: none;
        }
        
        :host(.visible) {
          opacity: 1;
          pointer-events: all;
          display: flex !important;
        }
        
        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid rgba(59, 130, 246, 0.3);
          border-radius: 50%;
          border-top-color: #3b82f6;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        .message {
          position: absolute;
          bottom: calc(50% - 50px);
          font-family: 'Poppins', sans-serif;
          color: #1f2937;
          font-weight: 500;
          margin-top: 1rem;
        }
      </style>
      <div class="spinner"></div>
      <div class="message">Loading...</div>
    `;
  }

  connectedCallback() {
    if (this.hasAttribute("auto-show")) {
      this.showLoading();
    }
  }

  /**
    @param {string} message 
    @returns {Loader} 
   */
  showLoading(message = "Memuat...") {
    this._visible = true;
    this.shadowRoot.querySelector(".message").textContent = message;
    this.shadowRoot.host.classList.add("visible");
    return this;
  }

  /**
    @param {number} delay
    @returns {Loader}
   */
  hideLoading(delay = 0) {
    setTimeout(() => {
      this._visible = false;
      this.shadowRoot.host.classList.remove("visible");
    }, delay);
    return this;
  }

  /**
    @param {Function} callback 
    @returns {Loader}
   */
  finally(callback) {
    if (typeof callback === "function") {
      if (!this._visible) {
        callback();
      } else {
        const observer = new MutationObserver((mutations) => {
          if (!this.shadowRoot.host.classList.contains("visible")) {
            callback();
            observer.disconnect();
          }
        });

        observer.observe(this.shadowRoot.host, {
          attributes: true,
          attributeFilter: ["class"],
        });
      }
    }
    return this;
  }

  /**
   * Sets the loading message
   * @param {string} message - Message to display
   * @returns {Loader} - Returns this for method chaining
   */
  setMessage(message) {
    this.shadowRoot.querySelector(".message").textContent = message;
    return this;
  }
}

customElements.define("app-loader", Loader);
