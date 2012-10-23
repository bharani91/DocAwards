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
        this.el = options.el;
        this.template = _.template(eval(options.template));
        this.render();

        console.log(this.model);
      },

      events: {
        "click .next" : "next",
        "click .submit": "submit"
      },

      render: function() {
        $(this.el).html(this.template(this.model.toJSON()))
      },

      next: function() {
        this.model.set($(this.el).find("form").serializeFormJSON());
        this.model.save();

      },

      submit: function() {
        //console.log(window.form_data);
        var data = {};
        $.each(window.form_data, function(index, obj) {
          for(key in obj) {
            data[key] = obj[key];
          }
        });

        console.log("DATA", data);

        $.ajax({
          type: 'POST',
          url: "http://docawards.com/doctors/ws_add.json",
          data: data,
          success: function(data) {
            console.log(data);
            alert("Saved!");
          }
        });

      }
    })

  return ProfileFormView;
});
