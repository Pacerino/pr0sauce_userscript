// ==UserScript==
// @name pr0sauce
// @version     1.0.0
// @author      Helix
// @description Display information from pr0sauce as small text below the post
// @include     /^https?://pr0gramm.com/.*$/
// @run-at      document-idle
// @icon        https://pr0gramm.com/media/pr0gramm-favicon.png
// ==/UserScript==

function main() {
  window.p.View.Stream.Item = window.p.View.Stream.Item.extend({
    show: function (rowIndex, itemData, defaultHeight, jumpToComment) {
      this.parent(rowIndex, itemData, defaultHeight, jumpToComment);
      if (itemData.video && itemData.audio) {
        $.get("https://api.pr0sauce.info/find/" + itemData.id, function (data) {
          if (data.id != 0) {
            if (data.title.length > 0) {
              $(".item-details").append(
                `<a href="${data.url}" target="_blank">Musik: ${data.title} von ${data.artist}</a>`
              );
            } else {
              $(".item-details").append("<span>Keine Musik gefunden</span>");
            }
          }
        });
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
