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
    },

    render: function()  {
      $(".header_wrapper").html(this.template());
      if(window.current_user) {
        $("li.logout").show();
      } else {
        $("li.logout").hide();
      }

      
    } 

  });
  return HeaderView;
});
