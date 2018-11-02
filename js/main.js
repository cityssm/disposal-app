/* global window, document, nanoajax */

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

    searchResultsEle.innerHTML = "<div class=\"search-result center\">" +
      "Searching... <i class=\"fas fa-pulse fa-spinner\" aria-hidden=\"true\"></i>" +
      "</div>";

    nanoajax.ajax({
        url: "data/itemsJSON.asp?q=" + encodeURIComponent(searchStrEle.value),
        responseType: "json"
      },
      function(statusCode, json) {

        if (json.items.length === 0) {
          searchResultsEle.innerHTML = "<div class=\"search-result center\">" +
            "Your search returned no results." +
            "</div>";

          return;
        }

        searchResultsEle.innerHTML = "<ul class=\"list-reset\">" +
          json.items.reduce(function(soFar, itemJSON) {
            return soFar + ("<li><a class=\"block\" href=\"#" + itemJSON.itemKey + "\">" +
              itemJSON.itemName + "<br />" +
              "<small>" + itemJSON.shortDescription + "</small>" +
              "</a></li>");
          }, "") +
          "</ul>";

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

    itemContainerEle.innerHTML = "<p class=\"center text-muted\">" +
      "Loading item... <i class=\"fas fa-spinner fa-pulse\"></i>" +
      "</p>";

    nanoajax.ajax({
        url: "data/itemJSON.asp?k=" + encodeURIComponent(itemKey),
        responseType: "json"
      },
      function(statusCode, itemJSON) {

        if (!itemJSON.success) {
          itemContainerEle.innerHTML = "<div class=\"alert alert-info\">" +
            itemJSON.message +
            "</div>";

          return;
        }

        itemContainerEle.innerHTML =
          "<h1 class=\"h1 pb1 border-bottom\">" + itemJSON.itemName + "</h1>" +
          "<div class=\"clearfix\">" +
          (itemJSON.pictureURL === "" ?
            "" :
            "<img class=\"right\" src=\"item-img/" + itemJSON.pictureURL + "\" alt=\"" + itemJSON.itemName + "\" />") +
          "<p>" + itemJSON.shortDescription + "</p>" +
          (itemJSON.longDescription === "" ? "" : "<p>" + itemJSON.longDescription + "</p>") +
          "</div>" +
          "<h2 class=\"pb1 border-bottom\">Locations</h2>" +
          itemJSON.locations.reduce(function(soFar, locationJSON) {
            return soFar +
              "<h3>" + locationJSON.locationName + "</h3>" +
              "<p>" + locationJSON.shortDescription + "</p>";
          }, "");



      }, "json");
  }

  window.addEventListener("hashchange", displayItem);

  if (window.location.hash) {
    displayItem();
  }
}());
