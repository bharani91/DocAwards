// Filename: views/home/main
define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/home/main.html',
  'views/shared/footer',
  'models/doctor'
], function($, _, Backbone, mainHomeTemplate, FooterView, Doctor ){

  var mainHomeView = Backbone.View.extend({
    template: _.template(mainHomeTemplate),
    initialize: function()  {
      this.render();
      console.log(window.DocAwards.current_user);
      window.DocAwards.current_user.bind('AuthChange', this.updateAuth(this));
    },

    events: {
      "submit #signup_form": "signup",
      "submit #login_form": "login"
    },

    updateAuth: function (that) {
      if (window.DocAwards.current_user.isLoggedIn()) {
        that.$(".login").hide();
        that.$(".logout").show();
      } else {
        that.$(".login").show();
        that.$(".logout").hide();
      }
    },
    
    render: function()  {
      $(this.el).html(this.template());
      var that = this; 
      $(".wrapper").fadeOut("fast", function() {
        $(this).html(that.el);
        that.updateAuth(that); 
        

        $(".chzn-select").chosen();
        window.DocAwards.UtilFunctions.autocomplete_select();
        new FooterView();


        $("#landing-page-slider").orbit({
          animation: "horizontal-push",
          animationSpeed: 1000,
          timer: true,
          directionalNav: false,
          pauseOnHover: false, 
          captions: false, 
          fluid: true
        });
      });

      $(".wrapper, .footer_wrapper").fadeIn("slow", function() {
        $('.signup').on("click", function() {
          $('#signup_modal').reveal();
        });

        $('.login').on("click",function() {
          $('#login_modal').reveal();
        });

        
        $('#carousel').elastislide({
          imageW  : 180,
          minItems  : 5
        });


        // Select Chosen Entry
        $("#search_btn").live("click", function() {
          var selected = $(".chzn-select option:selected"),
              type = selected.data("type"),
              id = selected.data("id");

          if(!selected) {
            alert("Please select a term!");
            return false;
          } else if(type == "doctor") {
            window.app.navigate("#doctor/" + id, true)
            return false;
          } else if(type == "disease") {
            window.app.navigate("#disease/" + id, true)
            return false;
          } else if(type == "speciality") {
            window.app.navigate("#speciality/" + id, true);
            return false;
          }
          
        })

      });
    },

    signup: function() {
      var $form = this.$("#signup_modal").find("form"),
          form_data = $form.serializeFormJSON();

      console.log(JSON.stringify(form_data));

      
      $.ajax({
        type: 'POST',
        url: "http://docawards.com/api/users/add",
        data: form_data,
        success: function(response) {
          var new_id = parseInt($(response).find("#content table tr:last td:first").text()),
              new_username = $(response).find("#content table tr:last td:nth-child(2)").text(),
              user = new Doctor({id: new_id})

          window.DocAwards.current_user = user;

          console.log(window.DocAwards.current_user);
          window.app.navigate("#create_profile", true);
        }
      });

      //COMMENT OUT AFTER TESTING
      //window.app.navigate("#create_profile", true);
      
      
    },

    login: function(evt) {
      var $form = this.$("#login_modal").find("form"),
          form_data = $form.serializeFormJSON();
      ajax_successful = false; 
      var that = this; 

      if (this.ajax_successful) {
        //Post the form (no ajax) and get cookie, if ajax has already 
        // been successful. 
        // We use ajax to verfity that the entered user/pass is valie
        // so user can correct any errors, then once ajax has validated input
        // we send the users broser to do the form post in order to get the 
        // auth cookie
        return true;
      }

      console.log(JSON.stringify(form_data));

      $.ajax({
        type: 'POST',
        url: "http://docawards.com/api/users/ajax_login.json",
        data: form_data,
        dataType: 'json',
        success: function(response) {
          if (response.status == 1) {
            that.ajax_successful = true;
            $form.submit();
          } else {
            $('small.error').remove();
            $('input[name="data[User][username]"]').removeClass('error');
            $('input[name="data[User][Password]"]').removeClass('error');

            if (response.error_type == 'user') {
              $('input[name="data[User][username]"]').addClass('error').parent().append('<small class="error">Not Found! Please enter a valid email address.</small>');
            } else {
              $('input[name="data[User][password]"]').addClass('error').parent().append('<small class="error">Incorrect Password.  Please re-enter the correct password.</small>');
            }
          }
        }
      });
      return false;
    }
  });
  return mainHomeView;
});
