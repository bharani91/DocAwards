define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone){
  var User = Backbone.Model.extend({
    initialize: function(options) {
      this.id = options.id,
      this.username = options.username
    },
  });
  return User;
});
