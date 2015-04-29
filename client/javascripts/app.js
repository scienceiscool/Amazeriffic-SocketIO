var main = function (toDoObjects) {
    "use strict";

    console.log("SANITY CHECK");

    var toDos = toDoObjects.map(function (toDo) {
          // we'll just return the description
          // of this toDoObject
          return toDo.description;
    });

    $(".tabs a span").toArray().forEach(function (element) {
        var $element = $(element);

        // create a click handler for this element
        $element.on("click", function () {
            var $content,
                $input,
                $button,
                i;

            $(".tabs a span").removeClass("active");
            $element.addClass("active");
            $("main .content").empty();

            if ($element.parent().is(":nth-child(1)")) {
                $content = $("<ul>");
                for (i = toDos.length-1; i >= 0; i--) {
                    $content.append($("<li>").text(toDos[i]));
                }
            } else if ($element.parent().is(":nth-child(2)")) {
                $content = $("<ul>");
                toDos.forEach(function (todo) {
                    $content.append($("<li>").text(todo));
                });

            } else if ($element.parent().is(":nth-child(3)")) {
                var tags = [];

                toDoObjects.forEach(function (toDo) {
                    toDo.tags.forEach(function (tag) {
                        if (tags.indexOf(tag) === -1) {
                            tags.push(tag);
                        }
                    });
                });
                console.log(tags);

                var tagObjects = tags.map(function (tag) {
                    var toDosWithTag = [];

                    toDoObjects.forEach(function (toDo) {
                        if (toDo.tags.indexOf(tag) !== -1) {
                            toDosWithTag.push(toDo.description);
                        }
                    });

                    return { "name": tag, "toDos": toDosWithTag };
                });

                console.log(tagObjects);

                tagObjects.forEach(function (tag) {
                    var $tagName = $("<h3>").text(tag.name),
                        $content = $("<ul>");


                    tag.toDos.forEach(function (description) {
                        var $li = $("<li>").text(description);
                        $content.append($li);
                    });

                    $("main .content").append($tagName);
                    $("main .content").append($content);
                });

            } else if ($element.parent().is(":nth-child(4)")) {
                var $inputLabel = $("<p>").text("Description: "),
                    $tagInput = $("<input>").addClass("tags"),
                    $tagLabel = $("<p>").text("Tags: ");
                
                $input = $("<input>").addClass("description");
                $button = $("<span>").text("+");

                $button.on("click", function () {
                    var description = $input.val(),
                        tags = $tagInput.val().split(","),
                        newToDo = {
                            "description":description,
                            "tags":tags
                        };

                    $.post("todos", newToDo, function (result) {
                        console.log(result);

                        //toDoObjects.push(newToDo);
                        toDoObjects = result;

                        // update toDos
                        toDos = toDoObjects.map(function (toDo) {
                            return toDo.description;
                        });

                        // Following line inspired by: https://github.com/yashchheda/Assignment_9_Socket_Io_Amazeriffic/blob/master/client/javascripts/app.js
                        socket.emit("addTodo", newToDo);
                        $input.val("");
                        $tagInput.val("");
                    });
                });

                $content = $("<div>").append($inputLabel)
                                     .append($input)
                                     .append($tagLabel)
                                     .append($tagInput)
                                     .append($button);
            }

            $("main .content").append($content);

            return false;
        });
    });

    $(".tabs a:first-child span").trigger("click");

    // Following inspired by: https://github.com/yashchheda/Assignment_9_Socket_Io_Amazeriffic/blob/master/client/javascripts/app.js
    var socket = io();

    socket.on("addTodo", function (content) {
        var $newList = $("#newList"),
            $oldList = $("#oldList"),
            $tagList = $("#tagList"),
            $description = content.description,
            $tag = content.tags,
            // preparing for the slide down
            $newTodo = $("<li>").text($description).hide();

        if ($newList.length > 0) {
            $newList.prepend($newTodo);
            $newTodo.slideDown(350);
        } else if ($oldList.length > 0) {
            $oldList.append($newTodo);
            $newTodo.slideDown(350);
        } else if ($tagList.length > 0) {
            $("main .content").append($("<h3>").text($tag));
            $("main .content").append($newTodo);
            $newTodo.slideDown(350);
        }

        $.getJSON("todos.json", function (newToDoObjects) {
            toDoObjects = newToDoObjects;
            toDos = newToDoObjects.map(function (taskItem) {
                return taskItem.description;
            });
        });
    });
};

$(document).ready(function () {
    $.getJSON("todos.json", function (toDoObjects) {
        main(toDoObjects);
    });
});
