import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   * render the recieved recipe object to the dom
   * @param {object | [object]} data data tobe render
   * @param {boolean} [render=true] if it false it creates a string instead of rendering to the dom
   * @returns
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;

    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();

    this._parentEl.insertAdjacentHTML('afterBegin', markup);
  }

  update(data) {
    this._data = data;

    const newMarkup = this._generateMarkup();

    const newDom = document.createRange().createContextualFragment(newMarkup);

    const newElements = Array.from(newDom.querySelectorAll('*'));

    const currentElements = Array.from(this._parentEl.querySelectorAll('*'));

    // console.log(newElements);
    // console.log(currentElements);

    newElements.forEach((newEl, i) => {
      const currEl = currentElements[i];
      // console.log(currEl, newEl.isEqualNode(currEl));

      //// update changed text
      if (
        !newEl.isEqualNode(currEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log('***', newEl.firstChild.nodeValue.trim());
        currEl.textContent = newEl.textContent;
      }

      /// update changed attributes
      if (!newEl.isEqualNode(currEl))
        Array.from(newEl.attributes).forEach(attr =>
          currEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  _clear() {
    this._parentEl.innerHTML = ' ';
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
      </div>
      `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterBegin', markup);
  }

  renderError(message = this._ErrorMessage) {
    const markup = `
      <div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
      </div> 
      `;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
      </div> 
      `;

    this._clear();

    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
}
