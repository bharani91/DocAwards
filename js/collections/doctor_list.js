define([
  'jquery',
  'underscore',
  'backbone',
  'models/doctor_headshot'
], function($, _, Backbone, DoctorHeadShot){
  var DoctorList = Backbone.Collection.extend({
    model: DoctorHeadShot,


    sync: function(method, model, options){  
      // options.dataType =  "jsonp";
      // options.jsonpCallback = "cbck";
      // options.beforeSend = function(xhr){
      //   xhr.withCredentials = true;
      // };

      $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
        options.xhrFields = {
          withCredentials: true
        };
      });

      // options.beforeSend = function() {
      //   withCredentials: true;
      // }; 
      return Backbone.sync(method, model, options);  
    }

  });

  return DoctorList;
});
