$(document).ready(function() {
    console.log('Built with love for my wonderful sister. -Kirk');
    $('.arc-text').circleType({radius: 850});

    
    $(window).bind("load resize scroll",function(e) {
        var y = $(window).scrollTop();
          
        $(".par-image-wrapper").each(function(){
            var par_offset = $(this).parent().offset().top - y;

            if ( ( $(this).offset().top < (y + $(window).height()) ) && ( $(this).offset().top + $(this).height() > y )  ){
              $(this).css('top', parseInt( - par_offset / 6) + 'px');
            }
        });
    });
  
    $('#nav-button').click(function() {
        if($(this).hasClass('close')){
            $('#navigation').animate({opacity: 0}, 500, function() {
                $('header').removeClass('close');
                $(this).hide();
                $(document).unbind('touchmove');
            });              
        }else{
            $('header').addClass('close');
            $('#navigation').css('opacity','0').css('display','table');
                $('#navigation').animate({opacity: 1}, 500, function() {
                $(document).bind('touchmove', function(e) { e.preventDefault(); });
            });
        }
        $('#nav-button').toggleClass('close');
        $('body').toggleClass('blur');
    });

    //modernizr
    $(window).resize(mod);
    // Call once on initial load
    mod();


    //scroll to functions
    $(document).on("scroll", onScroll);
    
    $('a[href^="#"].scroll').on('click', function (e) {
        e.preventDefault();
        $(document).off("scroll");

        if($('header').hasClass('close')){
            $('body').toggleClass('blur');
            $('#navigation').animate({opacity: 0}, 500, function() {
                $('header, #nav-button').removeClass('close');
                $(this).hide();
                $(document).unbind('touchmove');
            }); 
        }
        
        $('a').each(function () {
            $(this).removeClass('active');
        })
        $(this).addClass('active');
      
        var target = this.hash,
            menu = target;
        $target = $(target);

        if($('#nav-button').is(":visible")){
            var scrollTopDist = $target.offset().top+2-$('#nav-button').outerHeight();
            //console.log(scrollTopDist);
        }else{
            var scrollTopDist = $target.offset().top+2;
            //console.log(scrollTopDist);
        }

        $('html, body').stop().animate({
            'scrollTop': scrollTopDist
        }, 700, 'swing', function () {
            window.location.hash = target;
            $(document).on("scroll", onScroll);
        });
    });

    $('a#readmore').click(function(e){
        e.preventDefault();
        $('.story-col.xs-hide').slideToggle(300);
        var text = $(this).html();
        //($(this).html() === "Read More") ? $(this).html("Hide") : $(this).html("Read More&hellip;");
        $(this).html(text == "Read More" ? "Hide" : "Read More");
    });
   
    //Form hide/show areas.
    $('input[name="attend"]').click(function() {
        if($('#attend_yes').is(':checked')) { 
            $('#guest, input[name="email"]').fadeIn();
            $('#comments').attr('placeholder', 'Comments');
            $('input[name="email"]').attr('placeholder', 'E-Mail *');
        }else{
            $('#guest, #rsvp_guest_info, #rsvp_song, input[name="email"]').fadeOut();
            $('#comments_sec').fadeIn();
            $('#comments').val('').attr('placeholder', 'Regrets');
            $('input[name="guest"]').prop('checked', false);
            $('#rsvp_guest_info input[type="text"], #rsvp_guest_info input[type="email"], #rsvp_song input[type="text"]').val('');
        }

        $('input[name="guest"]').click(function() {
            $('#rsvp_song, #comments_sec').fadeIn();
            
            if($('#guest_yes').is(':checked')) { 
                $('#rsvp_guest_info').fadeIn();
            }else{
                $('#rsvp_guest_info').fadeOut();
                $('#rsvp_guest_info input[type="text"], #rsvp_guest_info input[type="email"]').val('');
            }
        });
    });



    //Form Validation & AJAX.
    $('#rsvp_form').submit(function(event) {
        var attending = $("input[name='attend']:checked").val();
        var val_err_msg = '';

        // Stop the browser from submitting the form.
        event.preventDefault();

        var proceed = true;  
        if (  ($("input[name='attend']").is(':checked'))  &&  (attending == 'yes') && (!$("input[name='guest']").is(':checked')) ){
                val_err_msg += '<li>Please select if you are bringing a guest.</li>'; 
                proceed = false; //set do not proceed flag
        } 

        if (!$("input[name='attend']").is(':checked')) {
            val_err_msg += '<li>Please select whether or not you will be attending.</li>'; 
             proceed = false; //set do not proceed flag
        }    
        if(!$.trim($('#rsvp_form input[name=first_name]').val())){ //if this field is empty 
            $('#rsvp_form input[name=first_name]').addClass('error'); //change border color to red 
            val_err_msg += '<li>Please enter your First Name</li>';  
            proceed = false; //set do not proceed flag
        }    
        if(!$.trim($('#rsvp_form input[name=last_name]').val())){ //if this field is empty 
            $('#rsvp_form input[name=last_name]').addClass('error'); //change border color to red 
            val_err_msg += '<li>Please enter your Last Name.</li>';  
            proceed = false; //set do not proceed flag
        }


       
        if(proceed !== false){
            $.ajax({
                beforeSend: function(){
                    $('#loading').show();
                    $('#submit').attr('value', 'loading').prop('disabled', true);
                },
                type: "POST",
                url: $('#rsvp_form').attr('action'),
                dataType: "json",
                data: $('#rsvp_form').serialize()
            }).done(function(response) {
                //console.log(response.type);
                    $('#loading').hide();
                    if(response.type == 'error'){ //load json data from server and output message     
                        output = '<div class="error">'+response.text+'</div>';
                         $("#message").hide().html(output).slideDown();
                    }else{
                        //output = '<div class="success">'+response.text+'</div>';
                        if(attending == 'yes'){
                            $('.mes_yes').show();
                        }
                        if(attending == 'no'){
                            $('.mes_no').show();
                        }
                        $('#success').animate({opacity: 1}, 500).css('position', 'relative');
                        $('#rsvp_form').fadeOut(500);
                        $('#submit').attr('value', 'Submit').prop('disabled', false);
                        $("#message").hide();
                    }
            }).fail(function(response) {
                //console.log(response.text);
                    $('#loading').hide();
                    $('#submit').attr('value', 'Submit').prop('disabled', false);
                    output = '<div class="error">There was an ajax error.</div>';
                    $("#message").hide().html(output).slideDown();
            });
        }else{
            $('#submit').attr('value', 'Submit').prop('disabled', false);
          output = '<div class="error">'+val_err_msg+'</div>';
            $("#message").hide().html(output).slideDown();  
        }
    });
    
    //reset previously set border colors and hide all message on .keyup()
    $("#contact_form  input[required=true], #contact_form textarea[required=true]").keyup(function() { 
        $(this).css('border-color',''); 
        $("#result").slideUp();
    });

    $(window).bind("load scroll resize", function() {
        var banner = $('#banner');
         if (isElementInViewport(banner) == false){
            $('header#nav, #nav-button').addClass('withbg');
         }else{
            $('header#nav, #nav-button').removeClass('withbg');
         }
    });
});



function isElementInViewport (el) {
    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }
    var rect = el.getBoundingClientRect();
    return (rect.bottom >= 0 && rect.right >= 0 && rect.top <= (window.innerHeight || document.documentElement.clientHeight) && rect.left <= (window.innerWidth || document.documentElement.clientWidth));
}

function onScroll(event){
    var scrollPos = $(document).scrollTop();
    $('#navigation a').each(function () {
        var currLink = $(this);
        var header = $('header');
        var refElement = $(currLink.attr("href"));
        if (refElement.position().top - header.outerHeight() <= scrollPos && refElement.position().top + refElement.outerHeight()  > scrollPos - header.outerHeight() ) {
            $('#navigation ul li a').removeClass("active");
            currLink.addClass("active");
        }
        else{
            currLink.removeClass("active");
        }
    });
    //$('#intro').css('background-position', 'left ' + ((scrollPos)) + 'px');
}

//modernizr functions
var mod = function(){
    if (Modernizr.mq('only screen and (max-width : 480px)')) {
        $('.shorten object:not(.sm)').each(function(){
            $(this).attr('data', $(this).attr('data').replace(".svg","_mobile.svg")).addClass('sm');
        });
    } else {
        $('.shorten object.sm').each(function(){
            $(this).attr('data', $(this).attr('data').replace("_mobile.svg",".svg")).removeClass('sm');
        });
    }

    if (Modernizr.mq('only screen and (max-width : 768px)')) {
        $('.behind_image img:not(.sm)').each(function(){
            $(this).attr('src', $(this).attr('src').replace(".jpg","_mobile.jpg")).addClass('sm');
        });
    } else {
        $('.behind_image img.sm').each(function(){
            $(this).attr('src', $(this).attr('src').replace("_mobile.jpg",".jpg")).removeClass('sm');
        });
    }
}






