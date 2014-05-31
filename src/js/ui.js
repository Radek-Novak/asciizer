var char_size = {
    w: 8,
    h: 16
};

$('.controls input.preview').on("click", function() {
    var orig = $('.original-image'),
        drawing = $('.drawing'),
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

/*$(".resizable").resizable({
    grid: [char_size.w, char_size.h],

    resize: function(event, ui) {
        var $drawing = $(ui.element[0]).find('.drawing pre'),
            drawing = {
                w: $drawing.width(),
                h: $drawing.height()
            },
            text = $drawing.text(),
            lines = text.split('\n'),
            line_width = lines[0].length,
            os = ui.originalSize,
            s = ui.size,
            i = 0;

        if (os.width !== s.width) {
            var newwidth = Math.floor(drawing.w / char_size.w);

            if (line_width > newwidth) {
                for (i = 0; i < lines.length; i++) {
                    lines[i] = lines[i].substring(0, newwidth);
                }
            } else {
                for (i = 0; i < lines.length; i++) {
                    // http://stackoverflow.com/a/1877479
                    var spaces = Array(newwidth - line_width + 1).join(" ");

                    lines[i] += spaces;
                }
            }
            $('.indicator .width').text(newwidth);
        }

        if (os.height !== s.height) {
            var newheight = Math.floor(drawing.h / char_size.h);

            if (lines.length > newheight) {
                lines.remove(newheight, Infinity);
            } else {
                for (i = 0; i < newheight - lines.length; i++) {
                    lines.push(Array(line_width + 1).join(" "));
                }
            }
            $('.indicator .height').text(newheight);
        }

        $drawing.text(lines.join('\n'));
    },
    stop: function(event, ui) {
        var max = 0,
            i,
            cur_line,
            spaces,
            $text = $(ui.element[0]).find('.drawing pre'),
            lines = $text.text().split('\n');

        for (i = 0; i < lines.length; i++) {
            cur_line = lines[i].length;
            max = max < cur_line ? cur_line : max;
        }
        for (i = 0; i < lines.length; i++) {
            cur_line = lines[i];

            if (cur_line.length < max) {
                spaces = Array(max - cur_line.length + 1).join(" ");
                lines[i] += spaces;
            }
        }
        $text.text(lines.join('\n'));
    }
});
*/