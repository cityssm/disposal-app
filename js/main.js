/* global window, document, nanoajax */

(function() {
  "use strict";

  /*
   * SEARCH
   */

  const searchStrEle = document.getElementById("searchStr");
  const searchResultsEle = document.getElementById("container--searchResults");

  const searchResultsLimit = 9;

  function displaySearch() {

    const searchValue = searchStrEle.value.trim();

    if (searchValue === "") {
      searchResultsEle.innerHTML = "";
      return;
    }

    searchResultsEle.innerHTML = "<div class=\"center\">" +
      "Searching... <i class=\"fas fa-pulse fa-spinner\" aria-hidden=\"true\"></i>" +
      "</div>";

    nanoajax.ajax({
        url: "data/itemsJSON.asp?q=" + encodeURIComponent(searchStrEle.value),
        responseType: "json"
      },
      function(statusCode, json) {

        if (json.items.length === 0) {
          searchResultsEle.innerHTML = "<div class=\"center\">" +
            "Your search returned no results." +
            "</div>";

          return;
        }

        searchResultsEle.innerHTML = json.items.reduce(function(soFar, itemJSON, index) {

          if (index >= searchResultsLimit) {
            return soFar;
          }

          return soFar + ("<div class=\"sm-col sm-col-4 search-result\"" +
            ">" +
            "<a class=\"block border m1\" href=\"#" + itemJSON.itemKey + "\">" +
            "<span class=\"p1\">" + itemJSON.itemName + "</span>" +
            "<div class=\"image-wrapper\">" +
            "<div class=\"image\"" +
            (itemJSON.pictureURL === "" ? "" : " style=\"background-image:url('item-img/" + itemJSON.pictureURL + "');\"") +
            "></div></div>" +
            "</a>" +
            "</div>");
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
          "<div class=\"clearfix px1\">" +
          (itemJSON.pictureURL === "" ?
            "" :
            "<img class=\"right fit\" src=\"item-img/" + itemJSON.pictureURL + "\" alt=\"" + itemJSON.itemName + "\" />") +
          "<p>" + itemJSON.shortDescription + "</p>" +
          (itemJSON.longDescription === "" ? "" : "<p>" + itemJSON.longDescription + "</p>") +
          "</div>" +

          (itemJSON.reuseIdeas.length === 0 ?
            "" :
            "<h2 class=\"pb1 border-bottom\"><i class=\"fas fa-recycle\" aria-hidden=\"true\"></i> Reuse Ideas</h2>" +
            itemJSON.reuseIdeas.reduce(function(soFar, ideaJSON) {
              return soFar +
                ("<div class=\"clearfix px1 border\">" +
                  "<div class=\"left p2 mr1\">" +
                  "<i class=\"far fa-2x fa-lightbulb\" aria-hidden=\"true\"></i>" +
                  "</div>" +
                  "<h3>" +
                  ideaJSON.ideaName +
                  "</h3>" +
                  "<p>" + ideaJSON.ideaDescription + "</p>" +
                  (ideaJSON.websiteURL === "" ?
                    "" :
                    "<p><i class=\"fas fa-fw fa-link\"></i> <a class=\"bold\" href=\"" + ideaJSON.websiteURL + "\" target=\"_blank\">More Information on this Idea</a></p>") +
                  "</div>");

            }, "") +
            "") +

          (itemJSON.locations.length === 0 ?
            "" :
            "<h2 class=\"pb1 border-bottom\">Locations</h2>" +
            itemJSON.locations.reduce(function(soFar, locationJSON) {
              return soFar +
                "<div class=\"clearfix px2 mb1 border\">" +
                "<h3>" + locationJSON.locationName + "</h3>" +
                ("<div class=\"col md-col-6\">" +
                  "<p>" + locationJSON.shortDescription + "</p>" +
                  "<p>" + locationJSON.longDescription + "</p>" +
                  "</div>") +
                "<div class=\"col md-col-1\">&nbsp;</div>" +
                ("<div class=\"col md-col-5\">" +
                  (locationJSON.address === "" ?
                    "" :
                    "<p class=\"bold\"><i class=\"fas fa-fw fa-location-arrow\"></i> " + locationJSON.address + "</p>") +
                  (locationJSON.websiteURL === "" ?
                    "" :
                    "<p><i class=\"fas fa-fw fa-link\"></i> <a class=\"bold\" href=\"" + locationJSON.websiteURL + "\" target=\"_blank\">Visit " + locationJSON.locationName + " Website</a></p>") +
                  "</div>") +
                "</div>";
            }, ""));



      }, "json");
  }

  window.addEventListener("hashchange", displayItem);

  if (window.location.hash) {
    displayItem();
  }
}());
