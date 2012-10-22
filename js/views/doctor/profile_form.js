define([
  'jquery',
  'underscore',
  'backbone',
  'models/form_data',
  'text!templates/doctor/personal_details.html',
  'text!templates/doctor/specializations.html',
  'text!templates/doctor/qualifications.html',
  'text!templates/doctor/experiences.html',
  'text!templates/doctor/consultation.html',
  'text!templates/doctor/contact_details.html',
], function($, _, Backbone, FormData, personal_details_template, specializations_template, qualifications_template, experiences_template, consultation_template, contact_details_template){
    var ProfileFormView = Backbone.View.extend({
      initialize: function(options) {
        var urls = {
          "personal_details" : "http://docawards.com/doctors/add",
          "specializations" : "http://docawards.com/docspeclinks/add",
          "qualifications" : "http://docawards.com/qualifications/add",
          "experiences" : "http://docawards.com/experiences/add",
          "consultation" : "http://docawards.com/docconsultlocations/add",
          "contact_details" : "http://docawards.com/doctor_contacts/add",

        };
        this.model_url = urls[options.url];
        this.el = options.el;
        this.template = _.template(eval(options.template));
        this.render();
        console.log(this.model);
      },

      events: {
        "click .next" : "submit_form" 
      },

      render: function() {
        $(this.el).html(this.template(this.model.toJSON()));
      },

      submit_form: function() {
        var data = new FormData({url: this.model_url});
        data.set($(this.el).find("form").serializeFormJSON());

        console.log(data);
        // data.save();
        // if(!window.current_doctor) {
        //   return false;  
        // }
      }
    })

  return ProfileFormView;
});
