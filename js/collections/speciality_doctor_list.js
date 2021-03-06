define([
  'jquery',
  'underscore',
  'backbone',
  'collections/doctor_list'
], function($, _, Backbone, DoctorList){
  var SpecialityDoctorList = DoctorList.extend({
    initialize: function(options) {
       this.id = options.id;
     },

    url: function() {
      return "http://docawards.com/api/doctors/get_doctors.json?brief=1&specialty_id=" + this.id
    },
    parse: function(response) {
      return response.data;
    }

  });

  return SpecialityDoctorList;
});