define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var Doctor = Backbone.Model.extend({
    initialize: function (options) {
      this.id = options.id;  
    },

    url: function() {
      return "http://docawards.com/api/doctors/get_doctors.json?doctor_id=" + this.id
    },

    parse: function(response) {
      return response.data[0];
    },

    sync: function(method, model, options){  
      $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
        options.xhrFields = {
          withCredentials: true
        };
      });
      return Backbone.sync(method, model, options);  
    }  

  });
  return Doctor;

});
