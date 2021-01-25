//----------------------------------------------------------------------------//
// Adding videos based on mobile detection                                    //
//----------------------------------------------------------------------------//
$(function()
{

	var isMobile = function () {
		if ($('.jc-mobile-detect').is(':visible'))
			return true;
	}

	if(isMobile()) {
		$('.jc-hero .jc-iframe-container').prepend('<iframe class="jc-iframe" src="https://player.vimeo.com/video/498397802?controls=0&autoplay=1&muted=1&loop=0" frameborder="0" allow="autoplay; fullscreen" muted autoplay></iframe>');
		$('.jc-coming-soon .jc-iframe-container').prepend('<iframe class="jc-iframe" src="https://player.vimeo.com/video/498397595?background=1" frameborder="0" allow="autoplay; fullscreen" muted autoplay></iframe>');
	}
	else {
		$('.jc-hero .jc-iframe-container').prepend('<iframe class="jc-iframe" src="https://player.vimeo.com/video/482804389?controls=0&autoplay=1&muted=1&loop=0" frameborder="0" allow="autoplay; fullscreen" muted autoplay></iframe>');
		$('.jc-coming-soon .jc-iframe-container').prepend('<iframe class="jc-iframe" src="https://player.vimeo.com/video/490151498?background=1" frameborder="0" allow="autoplay; fullscreen" muted autoplay></iframe>');
	}

});

//----------------------------------------------------------------------------//
// Owl Carousels                                                              //
//----------------------------------------------------------------------------//
$(function()
{
	
	// $('.jc-carousel').owlCarousel({
	// 	dots: true,
	// 	loop: true,
	// 	nav: true,
	// 	items: 1
	// });

});

//----------------------------------------------------------------------------//
// Register Form                                                              //
//----------------------------------------------------------------------------//

$(function()
{

	function gtag_report_conversion(url) {
		var callback = function () {
			if (typeof(url) != 'undefined') {
				window.location = url;
			}
		};
		gtag('event', 'conversion', {
			'send_to': 'AW-440098687/SYk2CIWD0vEBEP--7dEB',
			'event_callback': callback
		});
		return false;
	}

	$('.jc-select').on('change',function() {

		var value = $(this).val();

		$('.jc-select-choice').html(value);
	});

	$('.jc-form-toggle-option').on('click', function() {

		var value = $(this).attr('data-value');
		var parent = $(this).parent('.jc-form-toggle');

		console.log(value);

		parent.children('input').attr('value', value);

	});


	$('.jc-form-check-span').on('click', function() {

		var parent = $(this).parent('.form-check');

		parent.children('input').trigger('click');

	});


	////////////////////////////////////////////////////////////////////////////////

	var $form              = $('#jc-register-form');
	var $inputs            = $form.find ('.form-control');
	var $checkboxes        = $form.find ('.form-check-input');
	var $email             = $form.find ('.form-control[name=Email]');
	var $postal            = $form.find ('.form-control[name=PostalCode]');
	var $button            = $form.find ('.jc-btn-submit');
	var errorState         = false;

	////////////////////////////////////////////////////////////////////////////////

	function isEmail(email) {

		var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

		if(!regex.test(email))
		{
			return false;
		}

		else
		{
			return true;
		}
	}

	$inputs.blur (function()
	{
		if (!$(this).val())
		{
			$(this).removeClass ('is-valid').addClass ('is-invalid');
		}

		else
		{
			$(this).removeClass ('is-invalid').addClass ('is-valid');
		}
	});

	$email.blur (function()
	{
		if (!isEmail ($(this).val()))
		{
			$(this).removeClass ('is-valid').addClass ('is-invalid');
		}

		else
		{
			$(this).removeClass ('is-invalid').addClass ('is-valid');
		}

	});

	$postal.blur (function()
	{
		var ca = new RegExp(/([ABCEGHJKLMNPRSTVXY]\d)([ABCEGHJKLMNPRSTVWXYZ]\d){2}/i);
		var postalCode = $(this).val();

		if (!ca.test(postalCode.toString().replace(/\W+/g, '')))
		{
			$(this).removeClass ('is-valid').addClass ('is-invalid');
		}

		else
		{
			$(this).removeClass ('is-invalid').addClass ('is-valid');
		}

	});

	$form.submit (function(e)
	{
		// prevent duplicate submissions
		$form.find('.jc-btn-submit').prop('disabled', true);

		// prevent default submit behaviour
		e.preventDefault();

		// reset error state
		errorState = false;

		// check for empty fields
		$inputs.each (function()
		{
			if (!$(this).val())
			{
				$(this).removeClass ('is-valid').addClass ('is-invalid');
				errorState = true;
			}

			else
			{
				$(this).removeClass ('is-invalid').addClass ('is-valid');
			}
		});

		// check whether email is valid
		if (!isEmail ($email.val()))
		{
			$email.removeClass ('is-valid').addClass ('is-invalid');
			errorState = true;
		}

		else
		{
			$email.removeClass ('is-invalid').addClass ('is-valid');
		}

		// check for checked checkboxes
		$checkboxes.each (function()
		{
			if ($(this).prop("checked") == false)
			{
				$(this).removeClass ('is-valid').addClass ('is-invalid');
				errorState = true;
			}

			else
			{
				$(this).removeClass ('is-invalid').addClass ('is-valid');
			}
		});

		// if form has errors
		if (errorState) {

			// unlock disable button
			$form.find('.jc-btn-submit').prop('disabled', false);

			return false;

		}

		// now we do ajax
		// get form
		var form = $('#jc-register-form')[0];

		// create an FormData object 
		var data = new FormData(form);

		// do a barrel roll
		$.ajax({
			type: "POST",
			enctype: 'multipart/form-data',
			url: "/register.php",
			data: data,
			processData: false,
			contentType: false,
			cache: false,
			timeout: 800000,
			success: function (datatxt) {
				responseData = JSON.parse(datatxt);
				if (responseData.id)
				{
					try 
					{
						jtrack_match(responseData.id);
					}
					catch (ex)
					{
						console.log("Unable to match user");
					}
				}
				$form.addClass('jc-success');
				window.location.replace('#form-success');

				// report conversion

				fbq('track', "CompleteRegistration");
				gtag('event', "Signup", {'event_category': "Conversions", 'event_label': "CompleteRegistration", 'value': 0});
				gtag('event', 'conversion', {'send_to': 'AW-440098687/SYk2CIWD0vEBEP--7dEB'});

			},
			error: function (e) {

				console.log("ERROR : ", e);

				$form.addClass('jc-error');
				window.location.replace('#form-error');

			}
		});

	});

});