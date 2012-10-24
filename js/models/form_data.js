define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone){
  var FormData = Backbone.Model.extend({
    initialize: function(options) {
      // var urls = {
      //   "personal_details" : "http://docawards.com/api/doctors/add",
      //   "specializations" : "http://docawards.com/api/docspeclinks/add",
      //   "qualifications" : "http://docawards.com/api/qualifications/add",
      //   "experiences" : "http://docawards.com/api/experiences/add",
      //   "consultation" : "http://docawards.com/api/docconsultlocations/add",
      //   "contact_details" : "http://docawards.com/api/doctor_contacts/add",

      // };
      // this.model_url = urls[options.url];
      //this.bind("change", this.prepopulate, this);
      this.url = options.url;
      this.id = options.id;
    },

    prepopulate: function() {
      alert("prepolulating")
    },

    sync: function(method, model, options) {
      window.form_data.push(model.toJSON());
      // $.ajax({
      //   type: 'POST',
      //   url: this.url,
      //   data: model.toJSON(),
      //   success: function(data) {
      //     console.log(this.data);
          //save Doctor ID
          // if(this.url == "http://docawards.com/api/doctors/add") {
          //   console.log(data);
          //   console.log("Getting Doctor ID")
          //   var new_id = parseInt($(data).find("#content tr:last-child td:first-child").text());
          //   window.current_doctor = new User({id: new_id});
          //   app.navigate("#create_profile/specializations", true)
          // }
      //   }
      // });
    }
  });

  return FormData;
});


