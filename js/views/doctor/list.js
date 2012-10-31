// Filename: views/projects/list
define([
  'jquery',
  'underscore',
  'backbone',
  'views/doctor/headshot_view',
  'views/shared/footer',
  'views/shared/jumbotron',
  'views/shared/header'

], function($, _, Backbone, DoctorHeadShotView, FooterView, JumbotronView, HeaderView){
    var DoctorListView = Backbone.View.extend({
      className: "row doctor_list_view",
      id: "content",
      initialize: function() {
        var that = this;
        this.collection.fetch({
          success: function(collection) {
            that.render();
          }
        })
      },

      render: function() {
        var that = this;
        _.each(this.collection.models, function(doctor) {
          var profile = new DoctorHeadShotView({model: doctor});
          $(that.el).append(profile.el);
        });

        $(this.el).find(".feed_entry").wrapInChunks('<div class="row" />', 2).appendTo($(this.el));
        var that = this;
        $(".wrapper").fadeOut("fast", function() {
          $(this).html(that.el);
          // Initialize footer
          new HeaderView();
          new JumbotronView();
          new FooterView();
          $(document).foundationTooltips();
        });

        $(".header_wrapper, .wrapper, .footer_wrapper").fadeIn("slow");
        
        




        


        $(document).foundationButtons();
      }

    })

  return DoctorListView;
});
