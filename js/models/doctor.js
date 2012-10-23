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
    },

    sync: function(method, model, options){  
      // options.dataType =  "jsonp";
      // options.jsonpCallback = "cbck";
      $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
        options.xhrFields = {
          withCredentials: true
        };
      });
      // options.beforeSend = function(xhr){
      //   xhr.withCredentials = true;
      // };

      // options.xhrFields['withCredentials'] = true;

      return Backbone.sync(method, model, options);  
    }  

  });
  return Doctor;

});
