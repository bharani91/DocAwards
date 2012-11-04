// Filename: views/home/main
define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/shared/header.html'
], function($, _, Backbone, headerTemplate){

  var HeaderView = Backbone.View.extend({
    template: _.template(headerTemplate),
    initialize: function()  {
      this.render();
      window.DocAwards.current_user.bind('AuthChange', this.loginLogoutShow);
    },

    render: function()  {
      $(".header_wrapper").html(this.template());
      this.loginLogoutShow();
    }, 

    loginLogoutShow: function() {
      if(window.DocAwards.current_user.isLoggedIn()) {
        $("li.logout").show();
      } else {
        $("li.logout").hide();
      }       
    }

  });
  return HeaderView;
});
