define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/doctor/create_profile.html'
], function($, _, Backbone, CreateProfileTemplate){

  var CreateProfileView = Backbone.View.extend({
    className: "row create_profile",
    id: "content",
    template: _.template(CreateProfileTemplate),

    initialize: function() {
      this.urls = {
        "specializations" : "http://docawards.com/docspeclinks/add",
        "qualifications" : "http://docawards.com/qualifications/add",
        "experiences" : "http://docawards.com/experiences/add",
        "consultation" : "http://docawards.com/docconsultlocations/add",
        "contact_details" : "http://docawards.com/doctor_contacts/add",

      };
      this.render();
    },

    render: function() {
      $(this.el).html(this.template());
      $(".wrapper").empty().html(this.el);
    },

  });
  return CreateProfileView;
});
