$("#aboutproject").click(function() {
    $('html, body').animate({
        scrollTop: $("#about").offset().top
    }, 750);
});

$("#mainhelp").click(function() {
    $('body').fadeOut(500, function(){
        window.location.href='app';
    });
});
