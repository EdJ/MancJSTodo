(function () {
    var deleteLink = $('<a />').attr('href', '#').html('[x]').on('click', function () {
        var parentLi = $(this).parents('li').first();
        var id = parentLi.attr('id');

        $.post('/delete', { id: id }, function (data) {
            parentLi.remove();
        });

        return false;
    });

    var makeNewListItem = function (task) {
        var newListItem = $('<li />').attr('id', task.id).html(task.todo).append(deleteLink.clone(true));

        $('#todoList').append(newListItem);
    };

    $('#addTask').on('submit', function () {
        var task = $(this).find('input[type=text]').val();

        $.post('/add', { todo: task }, function (data) {
            var item = JSON.parse(data);
            makeNewListItem(item);
        });

        return false;
    });

    $(function () {
        $.get('/getAll', function (data) {
            var list = JSON.parse(data);

            $.each(list, function (i, v) {
                console.log(v);

                if (v.done) {
                    return;
                }

                makeNewListItem(v);
            });
        });
    });
})();