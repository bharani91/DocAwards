define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/doctor/upload_picture.html',
  'views/shared/header',
  'views/shared/footer'

], function($, _, Backbone, uploadPicTemplate, HeaderView, FooterView){
  var UploadPicture = Backbone.View.extend({
    tagName: "section",
    className: "upload doctor_profile",
    template: _.template(uploadPicTemplate),
    initialize: function() {
      this.render();
    },

    render:function () {
      var that = this;
      $(this.el).html(this.template());
      
      $(".wrapper").fadeOut("fast", function() {
        $(this).html(that.el);
        new HeaderView();
        new FooterView();

      });

      $(".wrapper, .footer_wrapper").fadeIn("slow");

      return this;
    },

  });

  return UploadPicture;
});
