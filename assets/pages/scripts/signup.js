var Register = function() {

    var handleRegister = function() {

        $('.signup-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                username: {
                    required: true
                },
                password: {
                    required: true
                },
                email: {
                    required: true
                }
            },

            messages: {
                username: {
                    required: "Username is required."
                },
                password: {
                    required: "Password is required."
                },
                email: {
                    required: "E-mail is required."
                }
            },

            invalidHandler: function(event, validator) { //display error alert on form submit
                $('.alert-danger', $('.signup-form')).show();
            },

            highlight: function(element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function(error, element) {
                error.insertAfter(element.closest('.input-icon'));
            },

            submitHandler: function(form) {
                console.log($('form.signup-form').serialize());
                $.post(config.signup_url, $('form.signup-form').serialize(), function(data) {
                    if(data.id) {
                        window.location.pathname = "/login.html";
                    }
                });
                return false;
            }
        });

        $('.signup-form input').keypress(function(e) {
            if (e.which == 13) {
                if ($('.signup-form').validate().form()) {
                    $('.signup-form').submit(); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    };



    return {
        //main function to initiate the module
        init: function() {

            handleRegister();

        }

    };

}();

jQuery(document).ready(function() {
    Register.init();
});
