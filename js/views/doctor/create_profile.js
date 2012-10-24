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
        "specializations" : "http://docawards.com/api/docspeclinks/add",
        "qualifications" : "http://docawards.com/api/qualifications/add",
        "experiences" : "http://docawards.com/api/experiences/add",
        "consultation" : "http://docawards.com/api/docconsultlocations/add",
        "contact_details" : "http://docawards.com/api/doctor_contacts/add",

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
