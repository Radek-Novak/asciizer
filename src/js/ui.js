var char_size = {
    w: 8,
    h: 16
};

$('.js-preview-toggle').on("click", function() {
    var orig = $('.box__subbox--original'),
        drawing = $('.box__subbox--drawing'),
        label = $('[for="preview"]');

    drawing.fadeToggle(0);
    orig.fadeToggle(0);
});

function getGridWidth() {
    return $('pre')[0].innerText.length;
}

$('.recalc').click(function() {
    last.calculate(getGridWidth());
});

$('.js-drawing-clear').click(drawing.clear);

$('.palette li').click(function (event) {
    var $this = $(this),
        coordX = event.pageX - $this.parent().offset().left,
        charIndex = Math.floor((coordX / 8));

    $this
        .siblings('li')
            .removeClass('active')
            .end()
        .addClass('active');

    drawing.changeChar($this.text());
});

$('.plus, .minus').click(function() {
    var $this = $(this),
        plus = $this.hasClass('plus'),
        $input = $this.siblings('.input-number'),
        value = parseInt($input.val(), 10);

    if (plus) {
        $input.val(value + 1);
    } else if (value > 1 && !plus) {
        $input.val(value - 1);
    }
});

// jQuery ui initializations
$(".draggable").draggable({
    grid: [char_size.w, char_size.h],
    containment: "parent",
    cancel: '.box__subbox--drawing, .controls',
    stack: ".draggable"
});

$('.js-controls-tabs').tabs();
