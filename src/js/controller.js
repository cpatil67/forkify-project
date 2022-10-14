import * as model from './module.js';
import recipeView from './view/recipeView.js';
import searchView from './view/searchView.js';
import resultsView from './view/resultsView.js';
import paginationView from './view/paginationView.js';
import bookmarkView from './view/bookmarkView.js';
import addRecipeView from './view/addRecipeView.js';
import { MODEL_CLOSE_SEC } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    // console.log(id);

    if (!id) return;

    recipeView.renderSpinner();

    /// 0.updates result view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    ///1. update bookmarks view
    bookmarkView.update(model.state.bookmarks);

    /// 2. loading recipe ///
    await model.loadRecipe(id);

    /// 3. rendering recipe ///
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    /// 1. get query ///
    const query = searchView.getQuery();
    if (!query) return;

    /// 2. get search results ///
    await model.loadSearchResult(query);

    /// 3. render results ///
    resultsView.render(model.getSearchResultsPage());

    ///4. render intial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  console.log(goToPage);
  /// 3. render new  results ///
  resultsView.render(model.getSearchResultsPage(goToPage));

  ///4. render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  /// update servings data in state
  model.updateServings(newServings);

  /// render servings in recipeview
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  /// 1. add/remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // console.log(model.state.recipe);
  /// 2. update recipe view
  recipeView.update(model.state.recipe);

  /// 3.render bookmarks
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmark = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarkView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const newfeature = function () {
  console.log('Welcome to the application ! for git tutorial');
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpadateServings(controlServings);
  recipeView.addhandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView._addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newfeature();
};

init();
