import View from './View.js';
import icons from 'url:../../img/icons.svg';

class paginationView extends View {
  _parentEl = document.querySelector('.pagination');

  _addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      console.log(btn);

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;

    const numPages = Math.ceil(
      this._data.results.length / this._data.resultPerPage
    );
    // console.log(numPages);

    //  we are on first page and there are other pages
    if (currentPage === 1 && numPages > 1) {
      return `
      <button data-goto = '${
        currentPage + 1
      }' class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
      </button>
      `;
    }

    //we are on last page
    if (currentPage === numPages && numPages > 1) {
      return `
    <button data-goto = '${
      currentPage - 1
    }' class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${currentPage - 1}</span>
    </button>`;
    }

    // we are on other pages
    if (currentPage < numPages) {
      return `
    <button data-goto = '${
      currentPage - 1
    }' class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${currentPage - 1}</span>
    </button>
    <button data-goto = '${
      currentPage + 1
    }' class="btn--inline pagination__btn--next">
        <span>Page ${currentPage + 1}</span>
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
        </svg>
    </button>
      `;
    }

    // we are on first page and there are no other pages
    return '';
  }
}

export default new paginationView();
