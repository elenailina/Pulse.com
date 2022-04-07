const slider = tns({
    container: '.carousel__inner',
    items: 1,
    slideBy: 'page',
    autoplay: false,
    controls: false,
});

document.querySelector('.prev').addEventListener('click', function () {
    slider.goTo('prev');
});
document.querySelector('.next').addEventListener('click', function () {
    slider.goTo('next');
});

$(document).ready(function() {
    $('ul.catalog__tabs').on('click', 'li:not(.catalog__tab_active)', function() {
      $(this)
        .addClass('catalog__tab_active').siblings().removeClass('catalog__tab_active')
        .closest('div.container').find('div.catalog__content').removeClass('catalog__content_active')
        .eq($(this).index()).addClass('catalog__content_active');
    });
    
    function toggleSlide (item){
        $(item).each(function(i) {
            $(this).on('click',function(e){
                e.preventDefault();
                $('.catalog-item__content').eq(i).toggleClass('catalog-item__content_active');
                $('.catalog-item__list').eq(i).toggleClass('catalog-item__list_active');
            });
        });
    }

    toggleSlide('.catalog-item__link');
    toggleSlide('.catalog-item__back');

    //Modal

    $('[data-modal=consultation]').on('click', function() {
        $('.overlay, #consultation').fadeIn('slow');
    });
    $('.modal__close').on('click', function(){
        document.querySelectorAll('label.error').forEach((item) => {
            item.style.display = "none";
          });
          document.querySelectorAll('form input').forEach((item) => {
            item.classList.remove('error');
          })
        $('.overlay, #consultation, #thanks, #order, #error').fadeOut('slow');
    });
    $('.button_mini').on('click', function(){
        $('.overlay, #order').fadeIn('slow');
    });
    $('.button_mini').each(function(i){
        $(this).on('click', function(){
            $('#order .modal__descr').text($('.catalog-item__subtitle').eq(i).text());
        });
    });

    function validateForms(form){
        $(form).validate({
            rules: {
                name: "required",
                phone: "required",
                email: {
                    required: true,
                    email: true
                }
            },
            messages: {
                name: "Пожалуйста, введите свое имя",
                phone: "Пожалуйста, введите свой телефон",
                email: {
                  required: "Пожалуйста, введите свою почту",
                  email: "Неправильно введен адрес почты"
                }
            }
        });
    }

    validateForms('#consultation-form');
    validateForms('#consultation form');
    validateForms('#order form');
    
    $('input[name=phone]').mask("+7 (999) 999-99-99");

    $('form').submit(function(e) {
        e.preventDefault();
        var request = $.ajax({
            type: "POST",
            url: "mailer/smart.php",
            data: $(this).serialize()
        });
        request.done(function(){
            $('#consultation, #order').fadeOut();
            $('.overlay, #thanks').fadeIn();
            setTimeout(function () {
                $('.overlay , #thanks').fadeOut();
                }, 3000);
            $('form').trigger('reset');
        }),
        request.fail(function failForm() {
            $('#consultation, #order').fadeOut();
            $('.overlay, #error').fadeIn();
            setTimeout(function () {
                $('.overlay , #thanks').fadeOut();
              }, 3000);
            $('form').trigger('reset');
        });
            
        return false;
    });
});