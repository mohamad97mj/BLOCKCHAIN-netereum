
$(function() {
    new WOW().init();
});

$(function() {
    $("#work").magnificPopup({
        delegate: 'a',
        type: 'image',
        gallery: {
            enabled: true
        }
    })
});

$(function() {
    $("#team-members").owlCarousel({
        items: 3,
        autoplay: true,
        smartSpeed: 700,
        loop: true,
        autoplayHoverPause: true,

    });
});

$(function() {
    $("#customers-testimonials").owlCarousel({
        items: 1,
        autoplay: true,
        smartSpeed: 700,
        loop: true,
        autoplayHoverPause: true,

    });
});

$(function () {
   $(".counter").counterUp({
       delay: 10,
       time: 2500
   })
});

$(function() {
    $("#our-clients").owlCarousel({
        items: 6,
        autoplay: true,
        smartSpeed: 700,
        loop: true,
        autoplayHoverPause: true,
    });
});

$(function () {
   $(window).scroll(function() {
       if ($(this).scrollTop() < 50) {
          //hide
          $("#logged-out-content nav").removeClass("navbar-transparent");
          $("#back-to-top").fadeOut();
      }
      else {
          //show
          $("nav").addClass("navbar-transparent");
          $("#back-to-top").fadeIn();
      }
   });
});

$(function () {
   $("a.smooth-scroll").click(function (event) {
       event.preventDefault();

       var section = $(this).attr("href");
       $('html, body').animate({
          scrollTop: $(section).offset().top - 127
       }, 1500, "easeInOutExpo");
   });
});



