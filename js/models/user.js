define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone){
  var User = Backbone.Model.extend({
    initialize: function(options) {
      var that = this;
      this.fetch({
        success: function(model) {
          if (model.attributes.status == 1) {
            that.message = null;
            that.user = model.attributes.User;
            if (that.user.role == "Doctor") {
              that.doctor = model.attributes.Doctor;
            } else {
              that.doctor = null;
            }
          } else {
            that.user = null;
            that.doctor = null;
            that.message = model.attributes.name;
          }
          that.trigger('AuthChange');
        }
    });
    },

    url: function() {
      return "http://docawards.com/api/users/get_user.json"
    },

    sync: function(method, model, options){  
      $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
        options.xhrFields = {
          withCredentials: true
        };
      });
      return Backbone.sync(method, model, options);  
    }, 

    parse: function(response) {
      return response.data;
    },

    success_callback: function(model) {
      current_user = this.DocAwards.current_user;
      if (model.attributes.status == 1) {
        current_user.message = null;
        current_user.user = model.attributes.User;
        if (current_user.user.role == "Doctor") {
          current_user.doctor = model.attributes.Doctor;
        } else {
          current_user.doctor = null;
        }
      } else {
        current_user.user = null;
        current_user.doctor = null;
        current_user.message = model.attributes.name;
      }
      current_user.trigger('AuthChange');
    }, 
    isLoggedIn: function () {
      if (this.user) { 
        console.log(this.user);
        return true; 
      } else { 
        console.log("ret false");
        return false; 
      }
    }, 
    getUser: function () {
      return this.user;
    },

    isDoctor: function() {
      if (this.isLoggedIn() && 
        this.doctor) {
        return true;
      } else {
        return false;
      }
    }
  });
  return User;
});
