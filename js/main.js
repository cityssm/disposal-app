/* global window, document */

(function() {
  "use strict";

  /*
   * SEARCH
   */

  const searchStrEle = document.getElementById("searchStr");
  const searchResultsEle = document.getElementById("container--searchResults");

  function displaySearch() {

    const searchValue = searchStrEle.value.trim();

    if (searchValue === "") {
      searchResultsEle.innerHTML = "";
      return;
    }

    searchResultsEle.innerHTML = "<div class=\"list-group-item\">" +
      "Searching... <i class=\"fas fa-pulse fa-spinner\" aria-hidden=\"true\"></i>" +
      "</div>";

    $.get("data/itemsJSON.asp", {
        q: searchStrEle.value
      },
      function(json) {

        if (json.items.length === 0) {
          searchResultsEle.innerHTML = "<div class=\"list-group-item list-group-item-info text-center\">" +
            "Your search returned no results." +
            "</div>";

          return;
        }

        searchResultsEle.innerHTML = json.items.reduce(function(soFar, itemJSON) {
          return soFar + ("<a class=\"list-group-item\" href=\"#" + itemJSON.itemKey + "\">" +
            itemJSON.itemName + "<br />" +
            "<small>" + itemJSON.shortDescription + "</small>" +
            "</a>");
        }, "");

      }, "json");
  }

  searchStrEle.addEventListener("keyup", displaySearch);

  /*
   * ITEM VIEW
   */

  const itemContainerEle = document.getElementById("container--item");

  function displayItem(hashChangeEvent) {

    if (hashChangeEvent) {
      hashChangeEvent.preventDefault();
      searchResultsEle.innerHTML = "";
    }

    const itemKey = window.location.hash.substring(1);

    $.get("data/itemJSON.asp", {
        k: itemKey
      },
      function(itemJSON) {

        if (!itemJSON.success) {
          itemContainerEle.innerHTML = "<div class=\"alert alert-info\">" +
            itemJSON.message +
            "</div>";

          return;
        }

        itemContainerEle.innerHTML =
          "<h1>" + itemJSON.itemName + "</h1>" +
          "<p><strong>" + itemJSON.shortDescription + "</strong></p>" +
          "<p>" + itemJSON.longDescription + "</p>" +
          "<h2>Locations</h2>" +
          itemJSON.locations.reduce(function(soFar, locationJSON) {
            return soFar +
            "<h3>" + locationJSON.locationName + "</h3>" +
            "<p><strong>" + locationJSON.shortDescription + "</strong></p>";
          }, "");



      }, "json");
  }

  window.addEventListener("hashchange", displayItem);

  if (window.location.hash) {
    displayItem();
  }
}());
