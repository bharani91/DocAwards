define([
  'jquery',
  'underscore',
  'backbone',
  'collections/doctor_list'
], function($, _, Backbone, DoctorList){
  var DiseaseDoctorList = DoctorList.extend({
    initialize: function(options) {
      this.id = options.id;
    },

    url: function() {
      return "http://docawards.com/api/doctors/get_doctors.json?brief=1&disease_id=" + this.id 
    },
  });

  return DiseaseDoctorList;
});
