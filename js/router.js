define([
  'jquery',
  'underscore',
  'backbone',
  'views/shared/header',
  'views/shared/footer',
  'views/home/main',
  'models/doctor',
  'views/doctor/main',
  'collections/disease_doctor_list',
  'collections/speciality_doctor_list',
  'views/doctor/list',
  'views/doctor/create_profile',
  'views/doctor/profile_form',
  'models/form_data',
  'models/user',
  'views/home/faq',
  'collections/datas',
  'views/doctor/upload_picture'

], function($, _, Backbone, HeaderView, FooterView, mainHomeView, Doctor, DoctorView, DiseaseDoctorList, SpecialityDoctorList, DoctorListView, CreateProfileView, ProfileFormView, FormData, User, FaqView, DataCollection, UploadPicture){
  var AppRouter = Backbone.Router.extend({
    routes: {
      ""                    :       "home",
      "doctor/:id"          :       "doctorProfile",
      "disease/:id"         :       "diseaseListing",
      "speciality/:id"      :       "specialityListing",
      "create_profile"      :       "createProfile",
      "create_profile/:id"  :       "createProfileTab",
      "upload_picture"     :       "uploadProfilePicture",
      "faq"                 :       "faq"
      
    },

    initialize: function() {
    },

    home: function(){

      var home_view = new mainHomeView();
      // hide regular header
      $(".header_wrapper").hide();
      // if(window.location.search.indexOf("?") >= 0) {
      //   var queries = {};
      //   $.each(window.location.search.substr(1).split('&'),function(c,q){
      //     var i = q.split('=');
      //     queries[i[0].toString()] = i[1].toString();
      //   });

      //   window.DocAwards.current_user = new User({id: queries["user_id"]});
      //   window.location.search = "";
      // } 
      
    },

    doctorProfile: function(id)  {
      var doctor = new Doctor({id: id});
      var doctor_view = new DoctorView({model: doctor});
    },

    diseaseListing: function(id) {
      var doctor_list_view = new DoctorListView({collection: new DiseaseDoctorList({ id: id })});
    },

    specialityListing: function(id) {
      var doctor_list_view = new DoctorListView({collection: new SpecialityDoctorList({ id: id })});
    },

    createProfile: function() {
      var header_view = new HeaderView();
      $(".header_wrapper").fadeIn("slow");

      //Authentication Check
      // if (!window.DocAwards.current_user.isLoggedIn()) {
      //   $(".alert-box.alert").text("Please log-in or create a new account to access this location").slideDown("slow").delay(3000).slideUp("slow");
      //   return;
      // } else {
      //   if (window.DocAwards.current_user.getUser().role != 'Doctor') {
      //     $(".alert-box.alert").text("Sorry, this page is accessable to Doctors only.").slideDown("slow").delay(3000).slideUp("slow");
      //     return;
      //   }
      // }

      window.form_data = [];
      
      var create_profile_view = new CreateProfileView();

      $(".wrapper").hide().fadeIn("slow", function() {

        window.datas = new DataCollection();

        var form_view = new ProfileFormView({ collection: window.datas, url: "personal_details", el: "li#personal_detailsTab", template: "personal_details_template"});
        //Datepicker
        $( ".datepicker" ).datepicker({
            changeMonth: true,
            changeYear: true,
            yearRange: "1910:2012",
            defaultDate: "-10y",
            dateFormat: 'dd-mm-yy'
        });
        $( ".timepicker" ).timepicker({
          showPeriod: true,
          showLeadingZero: true
        });

        $(".chosen_simple").chosen();
      });
      

    },

    createProfileTab: function(id) {
      var header_view = new HeaderView(),
          create_profile_view = new CreateProfileView();
      var el = "li#" + id + "Tab",
          template = id + "_template";

      if (window.datas == undefined) window.datas = new DataCollection();

      var form_view = new ProfileFormView({collection: window.datas, url: id, el: el, template: template});

      var $tab = $('a[href="#create_profile/' + id + '"]').parent('dd'),
          $activeTab = $tab.closest('dl').find('dd.active');

      var contentLocation = "#" + id + 'Tab';
      //Show Tab Content
      $(contentLocation).closest('.tabs-content').children('li').removeClass('active').hide();
      $(contentLocation).css('display', 'block').addClass('active');
      
      $activeTab.removeClass('active');
      $tab.addClass('active');

      var footer_view = new FooterView();
    },

    uploadProfilePicture: function() {
      var iframe = new UploadPicture();
    },

    faq: function() {
      //load up accordian
      

      var faq_view = new FaqView();
      // hide regular header
      $(".header_wrapper").hide();
    }

  });

  var initialize = function(){
    window.app = new AppRouter;
    Backbone.history.start();
  };
  return {
    initialize: initialize
  };
});
