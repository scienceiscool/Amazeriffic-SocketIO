// current code doesn't work - no console output

var main = function () {
  "use strict";

  var toDos = [
    "Do homework",
    "Work on projects",
    "Watch Hawaii Five-0"
  ];

  $(".tabs a span").toArray().forEach(function (element) {
    // create a click handler for this element
    $(element).on("click", function () {
      // since we're using the jQuery version of element,
      // we'll go ahead and create a temporary variable
      // so we don't need to keep recreating it
      var $element = $(element),
        $content,
        $input,
        $button,
        $i;

      $(".tabs a span").removeClass("active");
      $element.addClass("active");
      $("main .content").empty();

      if ($element.parent().is(":nth-child(1)")) {
        // newest first, so we need to go through the array backwards
        $content = $("<ul>");
        for (i = toDos.length-1; i >= 0; i--) {
          $content.append($("<li>").text(toDos[i]));
        }
      } else if ($element.parent().is(":nth-child(2)")) {
        // oldest first, so we go through the array forwards
        $content = $("<ul>");
        toDos.forEach(function (todo) {
          $content.append($("<li>").text(todo));
        });
      } else if ($element.parent().is(":nth-child(3)")) {
        // input a new to-do
        $input = $("<input>");
        $button = $("<button>").text("+");

        $button.on("click", function() {
          if ($input.val() !== "") {
            toDos.push($input.val());
            $input.val("");
          }
        });
        $content = $("<div>").append($input).append($button);
        // alternatively append() allows multiple arugments so the
        // above can be done with:
        // $content = $("<div>").append($input, $button);
      }
      $("main .content").append($content);
      return false;
    });
  });
  $(".tabs a:first-child span").trigger("click");
};

$(document).ready(main);
