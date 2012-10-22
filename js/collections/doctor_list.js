define([
  'jquery',
  'underscore',
  'backbone',
  'models/doctor_headshot'
], function($, _, Backbone, DoctorHeadShot){
  var DoctorList = Backbone.Collection.extend({
    model: DoctorHeadShot,
  });

  return DoctorList;
});
