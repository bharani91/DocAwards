// Filename: views/home/main
define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/home/main.html',
  'views/shared/footer'
], function($, _, Backbone, mainHomeTemplate, FooterView ){

  var mainHomeView = Backbone.View.extend({
    template: _.template(mainHomeTemplate),
    initialize: function()  {
      this.render();
    },

    events: {
      "submit #signup_form": "signup"
    },

    render: function()  {
      $(this.el).html(this.template());
      var that = this; 
      $(".wrapper").fadeOut("fast", function() {
        $(this).html(that.el);
        new FooterView();
      });

      $(".wrapper, .footer_wrapper").fadeIn("slow", function() {
        $('.signup').on("click", function() {
          $('#signup_modal').reveal();
        });

        $('.login').on("click",function() {
          $('#login_modal').reveal();
        });

        $(".chzn-select").chosen();
        window.autocomplete_select();

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

      // UNCOMMENT AFTER TESTING

      // $.ajax({
      //   type: 'POST',
      //   url: "http://docawards.com/users/add",
      //   data: form_data,
      //   success: function(response) {
      //     var new_id = parseInt($(response).find("#content table tr:last td:first").text()),
      //         new_username = $(response).find("#content table tr:last td:nth-child(2)").text(),
      //         user = new User({id: new_id})

      //     window.current_user = user;

      //     console.log(window.current_user);
      //     window.app.navigate("#create_profile", true);
      //   }
      // });

      // COMMENT OUT AFTER TESTING
      window.app.navigate("#create_profile", true);
      
      return false;
    }
  });
  return mainHomeView;
});
