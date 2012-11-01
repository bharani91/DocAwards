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
  'collections/datas'

], function($, _, Backbone, HeaderView, FooterView, mainHomeView, Doctor, DoctorView, DiseaseDoctorList, SpecialityDoctorList, DoctorListView, CreateProfileView, ProfileFormView, FormData, User, FaqView, DataCollection){
  var AppRouter = Backbone.Router.extend({
    routes: {
      ""                    :       "home",
      "doctor/:id"          :       "doctorProfile",
      "disease/:id"         :       "diseaseListing",
      "speciality/:id"      :       "specialityListing",
      "create_profile"      :       "createProfile",
      "create_profile/:id"  :       "createProfileTab",
      "faq"                 :       "faq"
    },

    initialize: function() {
      console.log("Get user id");
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

      //   window.current_user = new User({id: queries["user_id"]});
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

      window.form_data = [];
      
      var create_profile_view = new CreateProfileView();

      $(".wrapper").hide().fadeIn("slow", function() {
        // TEMPORARY - CHANGE AFTER IMPLEMENTING SIGNUP

        window.datas = new DataCollection();

        
        var form_view = new ProfileFormView({ collection: window.datas, url: "personal_details", el: "li#personal_detailsTab", template: "personal_details_template"});

        // Datepicker
        // $( ".datepicker" ).datepicker({
        //     changeMonth: true,
        //     changeYear: true,
        //     yearRange: "1910:2012",
        //     defaultDate: "-10y",
        //     dateFormat: 'dd-mm-yy'
        // });
        // $( ".timepicker" ).timepicker({
        //   showPeriod: true,
        //   showLeadingZero: true
        // });
      
        $(".chosen_simple").chosen();
      });
      

    },

    createProfileTab: function(id) {
      var header_view = new HeaderView(),
          create_profile_view = new CreateProfileView();
      
      var el = "li#" + id + "Tab",
          template = id + "_template";



      //UNCOMMENT AFTER IMPLEMENTING SIGNUP
      //var user_model = (id != "personal_details") ? window.current_doctor : window.current_user;

      if (!window.datas) window.datas = new DataCollection();
      var form_view = new ProfileFormView({collection: window.datas, url: id, el: el, template: template});

      var $tab = $('a[href="#create_profile/' + id + '"]').parent('dd'),
          $activeTab = $tab.closest('dl').find('dd.active');

      var contentLocation = "#" + id + 'Tab';
      //Show Tab Content
      $(contentLocation).closest('.tabs-content').children('li').removeClass('active').hide();
      $(contentLocation).css('display', 'block').addClass('active');
      
      $activeTab.removeClass('active');
      $tab.addClass('active');

       // Datepicker
      // $( ".datepicker" ).datepicker({
      //     changeMonth: true,
      //     changeYear: true,
      //     yearRange: "1910:2012",
      //     defaultDate: "-10y",
      //     dateFormat: 'dd-mm-yy'
      //   });

      // $( ".timepicker" ).timepicker({
      //     showPeriod: true,
      //     showLeadingZero: true
      // });

      $(".chosen_simple").chosen();
      window.autocomplete_ajax_chosen();

      $(".open_modal").live("click", function() {
        var elem = $(this).data("modal")
        $("#" + elem).reveal();
        return false;
      });

      var footer_view = new FooterView();
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
