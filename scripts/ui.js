var char_size = {w: 8, h: 16};

$('.menu input.preview').on("click", function() {
    var orig = $('#original-image'),
        label = $('[for="preview"]');
    if (!$(this).is(':checked')) {
        orig.hide(200);
        label.text('show original pic');
    } else {
        orig.show(300);
        label.text('hide original pic');
    }
});

function getGridWidth() {
    return $('#pic-w').val();
}

$('.recalc').click(function() {
    last.calculate(getGridWidth());
});

$(".draggable").draggable({
    grid: [char_size.w, char_size.h],
    containment: "parent",
    cancel: '.inner-box',
    stack: ".draggable"
});

$(".resizable").resizable({
    grid: [char_size.w, char_size.h]
});