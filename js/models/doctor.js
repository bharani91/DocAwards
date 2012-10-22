define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var Doctor = Backbone.Model.extend({
    initialize: function (options) {
      this.id = options.id;  
    },

    url: function() {
      return "http://docawards.com/doctors/get_doctors.json?doctor_id=" + this.id
    },

    parse: function(resp) {
      return resp[0]
    }

  });
  return Doctor;

});
