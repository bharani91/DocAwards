// Filename: views/projects/list
define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/doctor/profile.html',
  'views/shared/header',
  'views/shared/footer',

], function($, _, Backbone, doctorTemplate, HeaderView, FooterView){
  var DoctorView = Backbone.View.extend({
    className: "row doctor_profile",
    id: "content",
    template: _.template(doctorTemplate),
    initialize: function()  {
      var that = this;
      this.model.fetch({
        success: function(model) {
          // render headshot
          console.log(model);
          that.render();
        }
      })
    },

    render: function()  {
      var model = this.model.toJSON()
      console.log(model["Docconsultlocation"]);
      $(this.el).append(this.template({
        headshot: model["Doctor"],
        specializations: model["Docspeclink"],
        qualifications: model["Qualification"],
        experiences: model["Experience"],
        contacts: model["DoctorContact"],
        consultations: model["Docconsultlocation"]
      }));

      var that = this;
      $(".wrapper").fadeOut("fast", function() {
        new HeaderView();
        new FooterView();
        $(this).html(that.el);
      })

      $(".wrapper").fadeIn("slow", function() {
        var heights = [];
        $(that.el).find(".about_doc").each(function() {
          heights.push($(this).height());
        });
        $(".about_doc").height(Math.max.apply(null, heights));

        var latlng = [];
        _.each(model["Docconsultlocation"], function(consultation) {
          var temp = {};
          temp["lat"] = consultation["Location"]["lat"];
          temp["long"] = consultation["Location"]["long"];
          temp["name"] = consultation["Location"]["name"] + ', ' + 
            consultation["Location"]["neighborhood"] + ', ' +
            consultation["Location"]["City"]["name"];
          latlng.push(temp);
        });
        window.initialize_map(latlng);
      });

      $(".header_wrapper, .footer_wrapper").fadeIn("slow");


      
    },

  });
  return DoctorView;
});
