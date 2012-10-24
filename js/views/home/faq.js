// Filename: views/home/faq
define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/home/faq.html',
  'views/shared/footer',
  'models/user'
], function($, _, Backbone, faqTemplate, FooterView, User ){

  var faqView = Backbone.View.extend({
    template: _.template(faqTemplate),
    initialize: function()  {
      this.render();
    },

    render: function()  {
      $(this.el).html(this.template());
      var that = this; 
      
      $(".wrapper").fadeOut("fast", function() {
        $(this).html(that.el);
        new FooterView();
      });

      $(".wrapper, .footer_wrapper").fadeIn("slow", function() {
        $(document).foundationAccordion();
      });
    }
  });
  return faqView;
});
