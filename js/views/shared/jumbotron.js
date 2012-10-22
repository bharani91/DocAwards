// Filename: views/home/main
define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/shared/jumbotron.html'
], function($, _, Backbone, jumbotronTemplate){

  var Jumbotron = Backbone.View.extend({
    template: _.template(jumbotronTemplate),
    initialize: function()  {
      this.render();
    },

    render: function()  {
      $(".header_wrapper").append(this.template());
    } 

  });
  return Jumbotron;
});


