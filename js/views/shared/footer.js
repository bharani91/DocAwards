// Filename: views/home/main
define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/shared/footer.html'
], function($, _, Backbone, footerTemplate){

  var FooterView = Backbone.View.extend({
     template: _.template(footerTemplate),
    initialize: function()  {
      this.render();
    },

    render: function()  {
      $(".footer_wrapper").html(this.template());
    } 
  });
  return FooterView;
});
