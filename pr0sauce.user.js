// ==UserScript==
// @name pr0sauce
// @version     1.0.1
// @author      Helix
// @description Display information from pr0sauce as small text below the post
// @include     /^https?://pr0gramm.com/.*$/
// @run-at      document-idle
// @icon        https://pr0gramm.com/media/pr0gramm-favicon.png
// @updateURL   https://github.com/Pacerino/pr0sauce_userscript/raw/master/pr0sauce.user.js
// @downloadURL https://github.com/Pacerino/pr0sauce_userscript/raw/master/pr0sauce.user.js
// ==/UserScript==

function main() {
  window.p.View.Stream.Item = window.p.View.Stream.Item.extend({
    show: function (rowIndex, itemData, defaultHeight, jumpToComment) {
      this.parent(rowIndex, itemData, defaultHeight, jumpToComment);
      if (itemData.video && itemData.audio) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var graphql = JSON.stringify({
          query: "query UserScript($itemID: bigint!) {\r\n  pr0music_items(where: {item_id: {_eq: $itemID}}) {\r\n    id\r\n    url\r\n    artist\r\n    title\r\n  }\r\n}\r\n",
          variables: { "itemID": itemData.id }
        })
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: graphql,
          redirect: 'follow'
        };

        fetch("https://gql.pr0sauce.info/v1/graphql", requestOptions)
          .then(response => response.json())
          .then(ret => {
            if (ret.data.pr0music_items.length > 0) {
              if (ret.data.pr0music_items[0].title.length > 0) {
                $(".item-details").append(
                  `<a href="${ret.data.pr0music_items[0].url}" target="_blank">Musik: ${ret.data.pr0music_items[0].title} von ${ret.data.pr0music_items[0].artist}</a>`
                );
              } else {
                $(".item-details").append("<span>Keine Musik gefunden</span>");
              }
            } else {
              $(".item-details").append("<span>@Sauce noch nie markiert</span>");
            }
          })
          .catch(error => console.log('error', error));
      }
    },
  });
  window.p.View.Stream.Item.TARGET = {
    NOTHING: 0,
    SEEK_CONTROLS: 1,
    VOLUME_CONTROLS: 2,
  };
}

var script = document.createElement("script");
script.appendChild(document.createTextNode("(" + main + ")();"));
(document.body || document.head || document.documentElement).appendChild(
  script
);
