 $(document).ready(function(){
    var step            = $('section.quiz .questions .box');
    var question_holder = $('section.quiz .questions');
    var quiz_holder     = question_holder.parent();
    var progress_bar    = $('section.quiz .progress');
    var step_images     = $('section.quiz .questions .steps.doImage');
    var progress_links  = progress_bar.find('a');
    var delay           = 400;
    var body            = $('body');
    var loader          = $('.quiz-loader');
    var radio_btn       = $('input[type=radio]');
    var click_access    = true;

    //RESETING ALL RADIO BUTTONS BEGIN

    radio_btn.prop("checked", false);

    //RESETING ALL RADIO BUTTONS END

    step.on('click', function(){
        var parent      = $(this).parent().parent();
        var next_step   = parent.next().attr('id');
        var main_parent = parent.parent();
        var sex         = $(this).attr('data-sex');
        var final       = $(this).parent().parent().next().hasClass('final');

        if(click_access === true){
            parent.fadeOut();
            click_access = false;
        }
        else{return;}

        if(sex === "male" || sex === "female"){
            question_holder.delay('1000').queue(function(i){
                $(this).addClass('male');
                i();
            });
            body.addClass('no_images');
        }

        if(sex === 'male-bg'){
            body.addClass('male-bg').removeClass('female-bg');
        }

        if(sex === 'female-bg'){
            body.addClass('female-bg').removeClass('male-bg');
        }

        if(question_holder.hasClass('started') != true){
            body.addClass('no_scroll');
            loader.fadeIn();
            setTimeout(function(){
                $("html, body").animate({ scrollTop: 0 }, "slow");
                if(body.hasClass('no_images') != true){
                    console.log('obj');
                    updateImages(sex);
                }
                body.addClass('started');
                progress_bar.delay('700').slideDown();
                loader.delay('700').fadeOut();
                body.removeClass('no_scroll');
            },500);
        }

        $(this).find('input[type=radio]').prop("checked", false);
        $(this).parent().find('.selected').removeClass('selected');

        $(this).addClass('selected');
        $(this).find('input[type=radio]').prop("checked", true);

        if(question_holder.hasClass('started') === false){
            setTimeout(function(){
                $("html, body").animate({ scrollTop: 0 }, "slow");
            },500);
        }
        else{
            $("html, body").animate({ scrollTop: 0 }, "slow");
        }

        question_holder.addClass('started');

        progress_bar.find('.active').removeClass('active');

        progress_bar.find('#' + next_step).addClass('active').removeClass('disabled');

        main_parent.find('#' + next_step).delay(delay).fadeIn().addClass('open');

        setTimeout(function(){
            click_access = true;
        },600);

        if(final === true){
            progress_bar.find('a.last').addClass('done');
        }

        if(!next_step) {
            window.location = '../';
        }

    });

    progress_links.on('click', function(e){
        e.preventDefault();

        if($(this).hasClass('active') === true){
            return;
        }

        else if(body.hasClass('started') === true){
            var item_id = $(this).attr('id');

            progress_links.removeClass('active');

            $(this).addClass('active');

            question_holder.find('.open').fadeOut();

            question_holder.find('#' + item_id).delay(delay).fadeIn().addClass('open');
        }
        else{
            alert('Please chose sex.');
        }
    });

    //SUB MENU BEGIN

    var sub_menus = $('.navigation li.has_sub_menu');
    var inner_sub = sub_menus.find('ul.sub-menu');
    var sub_open  = false;


    $('.navigation li.has_sub_menu > a').on('mouseover', function(){
        $(this).parent().find('ul.sub-menu').stop().slideDown('200');
        $(this).parent().addClass('ok open');
    });

    $('.navigation li.has_sub_menu > a').on('mouseout', function(){
        var element = $(this).parent();
        setTimeout(function(){
            element.removeClass('ok');
        },500);
        setTimeout(function(){
            if(element.hasClass('ok') === false && sub_open === false){
                element.find('ul.sub-menu').stop().slideUp('200');
        }
        },600);
    });



    inner_sub.hover(function () {
        sub_open = true;
    },
    function () {
        sub_open = false;
        $(this).stop().slideUp();
    });


    //SUB MENU END

    //RESPONSIVE MENU BEGIN

    var menu_icon    = $('.mobile-menu-icon');
    var menu_overlay = $('.menu-overlay');
    var navigation   = $('section.main .navigation');

    menu_icon.on('click', function(){
        openMenu();
    });

    menu_overlay.on('click', function(){
        closeMenu();
    });

    function openMenu(){
        navigation.addClass('transition open');
        menu_overlay.fadeIn();
        body.addClass('no_scroll');
    }

    function closeMenu(){
        navigation.removeClass('open');
        menu_overlay.fadeOut();
        body.removeClass('no_scroll');
    }

    var menu_with_submenu = navigation.find('li.has_sub_menu');
    var menu_back_btn     = menu_with_submenu.find('li.back-menu');

    menu_with_submenu.on('click', function(){
        $(this).find('ul.sub-menu').addClass('open');
    });

    menu_back_btn.on('click', function(){
        $(this).parent().delay('100').queue(function(i){
            $(this).removeClass('open');
            i();
        });
    });

    $(window).on('resize', function(){
        if(menu_icon.is(':visible') === false){
            closeMenu();
        }
    });

    //RESPONSIVE MENU END

    //TRIGGER QUIZ ON ELEMENT BEGIN

    var quiz_trigger = $('.trigger_quiz');

    quiz_trigger.on('click', function(e){
        e.preventDefault();

        var start_quiz = $('.questions #step0 .box');

        start_quiz.click();


    });

    //TRIGGER QUIZ ON ELEMENT END

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    // X-VERIFY

    $( 'form' ).on( 'submit', function( e )
    {
        e.preventDefault();

        body.addClass('no_blur');

        var user_points        = $('.points .selected input[type=radio]');
        var final_result       = 0;
        var input_final_result = $('input.final_result');

        user_points.each(function(){
            var temp_result = parseInt($(this).attr('value'));

            final_result = final_result + temp_result;
        });

        input_final_result.attr('value', final_result);

        var frm = $( this );

        loader.fadeIn();

        if( ! validateEmail( frm.find( 'input[type="email"]' ).val() ) )
        {
            frm.find( 'input[type="email"]' ).addClass( 'error' );
            loader.fadeOut();
            return false;
        }

        var data = {
            'action' : 'check_x_mail',
            'mail'   : frm.find( 'input[type="email"]' ).val()
        };

        $.ajax({
            url     : 'xcheckmail.php',
            type    : 'POST',
            data    : data,

            success : function( data )
            {
                data = $.parseJSON( data );

                if( data.status )
                {
                    frm.find( 'input[type="email"]' ).removeClass( 'error' );
                    frm.off('submit');
                    frm.submit();
                }else{
                    frm.find( 'input[type="email"]' ).addClass( 'error' );
                    loader.fadeOut();
                }
            },
        });

             
    });

    $('.final-box input[type=email]').on('keydown', function(){
        $(this).removeClass('error');
    });

    // END X-VERIFY

    });