define([
  'jquery',
  'underscore',
  'backbone',
  'models/form_data',
  'models/doctor',
  'text!templates/doctor/personal_details.html',
  'text!templates/doctor/specializations.html',
  'text!templates/doctor/qualifications.html',
  'text!templates/doctor/experiences.html',
  'text!templates/doctor/consultation.html',
  'text!templates/doctor/contact_details.html',
  'text!templates/partials/qualification_field.html',
  'text!templates/partials/experience_field.html',
  'text!templates/partials/consultation_field.html',
  'text!templates/partials/contact_field.html',
  'text!templates/partials/add_location_modal.html',
  'text!templates/partials/add_specializations_modal.html',
  'text!templates/partials/add_degree_modal.html',
  'text!templates/partials/add_city_modal.html',
  'text!templates/partials/add_country_modal.html',
  'text!templates/partials/add_pin_code_modal.html'

], function($, _, Backbone, FormData, Doctor, personal_details_template, specializations_template, qualifications_template, 
            experiences_template, consultation_template, contact_details_template, qualification_field, experience_field, 
            consultation_field, contact_field, add_location_modal, add_specializations_modal, add_degrees_modal, 
            add_cities_modal, add_countries_modal, add_pin_code_modal){

    var ProfileFormView = Backbone.View.extend({
      initialize: function(options) {
        this.el = options.el;
        this.form_type = options.template.split("_template")[0];
        //HACK! Since Contact Details is a two word think unlike other tabs
        if (this.form_type == 'contact_details') { this.form_type = 'contact'; }
        this.template = _.template(eval(options.template));

        if(this.collection.models.length == 0 && 
          window.DocAwards.current_user.isLoggedIn() && 
          window.DocAwards.current_user.getDoctor()) {
          this.collection.fetch_from_server();

          var that = this;
          this.collection.bind("fetched_from_server", function(data) {
            console.log(that.collection)
            that.render();
          });
        } else {
          this.render();
        }

        var add_location_template = _.template(add_location_modal),
            add_specializations_template = _.template(add_specializations_modal),
            add_degrees_template = _.template(add_degrees_modal),
            add_cities_template = _.template(add_cities_modal),
            add_countries_template = _.template(add_countries_modal),
            add_pin_codes_template = _.template(add_pin_code_modal);
        
        $(this.el).append(add_location_template).append(add_specializations_template).append(add_degrees_template).append(add_cities_template).append(add_countries_template).append(add_pin_codes_template);
      },

      events: {
        "click .prev"                   :              "prev",
        "click .next"                   :              "saveTab",
        "click .submit"                 :              "submit",
        "submit .add_new_entry"         :              "add_new_entry",
        "click .add_another"            :              "add_another_field",
        "click .delete_entry"           :              "delete_field"
      },

      render: function() {


        $(this.el).append(this.template());
        this.form = $(this.el).find(".primary");
        
        // Check if the string ends with s, if not just append _field
        var form_type = this.form_type,
            field = (form_type.charAt(form_type.length - 1) == "s") ? form_type.slice(0, -1) + "_field" : form_type + "_field",
            count = this.collection.field_count[field];        

        // If doctor is creating a profile, show only one field otherwise show n-fields
        if(count == -1) {
          this.add_another_field(field);
        } else {
          for(var i = 0; i <=  count && count >= 0 ; i++) {  
            this.add_another_field(field, i);
          }
        }
               // Datepicker
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
        window.DocAwards.UtilFunctions.autocomplete_ajax_chosen();

        $(".open_modal").live("click", function() {
          var elem = $(this).data("modal")
          $("#" + elem).reveal();
          return false;
        });


        this.preload_tab_data(form_type);
      },

      prev: function(evt) {
      },

      saveTab: function(evt) {
        var model = new FormData($(this.form).serializeFormJSON());
        model.set({"form_type": this.form_type});
        
        //delete preivously created model (if any)
        var that = this;
        old_model = this.collection.filter(function(model){ 
          return model.attributes.form_type === that.form_type; 
        });
        this.collection.remove(old_model);

        //save this model data        
        this.collection.add(model);
      },

      submit: function() {
        // Add the last section to the collection
        this.saveTab();

        var data = {};
        _.each(this.collection.models, function(model) {
          var type = model.get("form_type"), m = model.toJSON();
          if(type == "personal_details") {
            for(key in m) {
              if (key == "form_type") return;
              data[key] = m[key]; 
            }

          } else if(type == "specializations") {
            _.each(m["data[Docspeclink][0][specialty_id]"], function(spec_link, index) {
              data["data[Docspeclink][" + index +"][specialty_id]"] = spec_link;
            });
          } else {
            _.extend(data, m)
          }
        });

        for(key in data) {
          if((_.isArray(data[key])) || (_.isObject(data[key]))) {
            delete data[key];
          }
        }

        // REMOVE AFTER TESTING
        console.log("DATA", data);
        window.temp_data = data;

        window.DocAwards.UtilFunctions.ajax('POST', 'doctors/ws_add.json', data, function(data) {
            console.log(data);
            $(".alert-box.success").text("Saved your profile successfully").slideDown("slow");
            window.app.navigate('#upload_picture', true);
          });

        return false;
      },

      put_into_form: function(type, form) {

        var form_type = (form ? form.split("_")[0] : this.form_type.split("_")[0]),
            field = (form_type.charAt(form_type.length - 1) == "s") ? form_type.slice(0, -1) + "_field" : form_type + "_field",
            $form = $(this.el).parent().find("form.primary");

        if(form_type == "specializations") {
          var val_to_set = [];

          if(type['data[Docspeclink]']) {
            val_to_set = type['data[Docspeclink]'].split(", ");
          } else {
            if(type['data[Docspeclink][0][specialty_id]']) {
              for(var i = 0; i <= type['data[Docspeclink][0][specialty_id]'].length; i++) {
                val_to_set.push(type['data[Docspeclink][0][specialty_id]'][i]);
              }
            }
          }
          window.DocAwards.UtilFunctions.setChosenVal($(".multiple_select"), val_to_set);
        } else {
          var options = [],
              opt = "";
          for(key in type) {
            if((key.indexOf('location_id') > -1)) {
              window.DocAwards.UtilFunctions.setChosenVal($form.find("select[name='" + key + "']"), type[key]);
            } else {
              $form.find("input[name='" + key + "']").val(type[key]);
              $form.find("select[name='"+key+"']").val(type[key]);
              $form.find("select[name='"+key+"']").trigger('liszt:updated');
            }
          }
        }  
      },

      preload_tab_data: function(type) {
        //Preload the form for the next tab if a model exists for it
        //Model would exist if the user has saved something then clicked next
        var form_type = type;
        model = this.collection.filter(function(model){
          return model.attributes.form_type == form_type;
        });
        if (model && model[0]) {
          this.put_into_form(model[0].toJSON(), form_type);
        }

        var form_type = type,
            field = (form_type.charAt(form_type.length - 1) == "s") ? form_type.slice(0, -1) + "_field" : form_type + "_field",
            count = this.collection.field_count[field];


      },

      add_new_entry: function(evt) {
        var $form = $(evt.target),
            data = $form.serializeFormJSON();
        $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
          options.xhrFields = {
            withCredentials: true
          };
        });

        $.ajax({
          type: 'POST',
          url: "http://docawards.com/api/"+$form.data('servermodel')+"/ws_add.json",
          data: data,
          success: function(data) {
            console.log(data);
            if (data.code = '200') {
              $(".alert-box.success").text("Added field successfully").slideDown("slow").delay(2000).slideUp("slow");
              select = $($form.data('targetselect'));
              for(var key in data.data) {
                select.append('<option selected="selected" value='+key+'>'+data.data[key]+'</option>');
              }
              select.trigger("liszt:updated");
              $form.parent().siblings('.close-reveal-modal').trigger('click');

            } else {
              $(".alert-box.alert").text("Failed to add field. Please try again").slideDown("slow").delay(2000).slideUp("slow");
            }
          }
        });
        return false;
      },

      add_another_field: function(evt, i) {
        
        // Check Type to see if the function is called on 'click' or on load
        if(typeof evt == "string") {
          var elem = evt,
          target = $("a[data-elem='" + elem + "'].button");
        } else {
          var elem = $(evt.target).data("elem"),
              target = $(evt.target);
        }
         

        var tmpl = _.template(eval(elem));



        var id = (i != undefined) ? i : (++this.collection.field_count[elem]);

        console.log(target, elem);

        var inserted = $(tmpl({ id: id })).attr("class", "field").insertBefore(target.parent().parent()).show();
        inserted.find(".chosen_temp").removeClass("chosen_temp").addClass("chosen_simple").chosen();
        window.DocAwards.UtilFunctions.autocomplete_ajax_chosen();


        inserted.find(".datepicker_temp").removeClass("datepicker_temp").datepicker({
          changeMonth: true,
          changeYear: true,
          yearRange: "1910:2020",
          defaultDate: "-30y",
          dateFormat: 'dd-mm-yy'
        });

        inserted.find(".timepicker_temp").removeClass("timepicker_temp").timepicker({
          showPeriod: true,
          showLeadingZero: true
        });

        return false;
      },

      delete_field: function(evt) {
        button = $(evt.target).parent();
        var elem = button.data("elem");
        --this.collection.field_count[elem];
        $(evt.target).parent().parent().parent().remove();
        $('.tooltip').hide(); // Dont know why it doesnt autohide, so doing manually
        return false;
      },

      // Check if a doctor with the given ID exists
      check_existing_doctor: function() {
        var doctor = new Doctor({id: window.DocAwards.current_user.getUser().id});
            that = this;
        doctor.fetch({
          success: function(model) {
            that.parse_doctor_data(model.toJSON());
          }
        });

      },

      // Parse the received JSON into a simple object with appropropriate 'name' field
      parse_doctor_data: function(model) {
        var data = {};
        for(var obj in model) {
          // Nested Data eg: Consult locations, experiences
          if(model[obj].constructor == Array) {
            
            // Set the initial partial fields counter
            var field = obj.toLowerCase() + "_field";
            if(this.collection.field_count[field]) this.collection.field_count[field] = model[obj].length;

            // Fill Consult Locations separately because of difference in names
            if(obj == 'Docconsultlocation') this.collection.field_count['consultation_field'] = model['Docconsultlocation'].length


            // Separate out the DocSpecLinks to use in Multiple-select Chosen
            if(obj == 'Docspeclink' && model[obj].length) {
              var temp = ""
              for(var i = 0; i < model[obj].length; i++) {
                temp += (model[obj][i]['specialty_id'] + ", ");
              }

              data["data[Docspeclink]"] = temp;

            } else {
              for(var i = 0; i < model[obj].length; i++) {
                for(key in model[obj][i]) {
                  if(typeof model[obj][i][key] != 'object') {
                    data[ 'data[' + obj + '][' + i + '][' + key + ']' ] = model[obj][i][key];
                  }
                } 
              }  
            }
            
          } else if(model[obj].constructor == Object) {
            // Doctor Profile
            for(key in model[obj]) {
              data[ 'data[' + obj + '][' + key + ']' ] = model[obj][key];
            }
          }
        }
      },



    

    });

  return ProfileFormView;
});
