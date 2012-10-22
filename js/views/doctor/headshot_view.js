// Filename: views/projects/list
define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/doctor/feed_entry.html'

], function($, _, Backbone, feedEntry){
  var DoctorHeadShotView = Backbone.View.extend({
    className: "feed_entry doctor_list six columns",
    template: _.template(feedEntry),
    initialize: function() {
      this.render();
    },

    render:function () {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },

  });

  return DoctorHeadShotView;
});
