/* global document */

(function() {
  "use strict";

  const searchStrEle = document.getElementById("searchStr");
  const searchResultsEle = document.getElementById("searchResults");

  function displaySearch() {

    const searchValue = searchStrEle.value.trim();

    if (searchValue === "") {
      searchResultsEle.innerHTML = "";
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
}());
