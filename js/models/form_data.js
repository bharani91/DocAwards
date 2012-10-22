define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone){
  var FormData = Backbone.Model.extend({
    initialize: function(options) {
      this.url = options.url;
      var that = this;
    },

    sync: function(method, model, options) {
      console.log("Syncing", model.toJSON());
      $.ajax({
        type: 'POST',
        url: this.url,
        data: model.toJSON(),
        success: function(data) {
          console.log(this.url);
          //save Doctor ID
          if(this.url == "http://docawards.com/doctors/add") {
            console.log(data);
            console.log("Getting Doctor ID")
            var new_id = parseInt($(data).find("#content tr:last-child td:first-child").text());
            window.current_doctor = new User({id: new_id});
            app.navigate("#create_profile/specializations", true)
          }
        }
      });
    }
  });

  return FormData;
});


