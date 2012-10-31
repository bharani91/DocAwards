define([
  'jquery',
  'underscore',
  'backbone',
  'models/form_data',
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
  'text!templates/partials/add_specializations_modal.html'

], function($, _, Backbone, FormData, personal_details_template, specializations_template, qualifications_template, experiences_template, consultation_template, contact_details_template, qualification_field, experience_field, consultation_field, contact_field, add_location_modal, add_specializations_modal){
    var ProfileFormView = Backbone.View.extend({
      initialize: function(options) {
        this.el = options.el;
        this.form_type = options.template.split("_template")[0];
        this.template = _.template(eval(options.template));
        
        // Initialize all field counts to zero
        this.field_count = {
          "qualification_field" : 0,
          "experience_field" : 0,
          "experience_field" : 0,
          "consultation_field" : 0,
          "contact_field" : 0,
        }; 

        this.render();
        add_location_template = _.template(add_location_modal);
        add_specializations_template = _.template(add_specializations_modal);
        $(this.el).append(add_location_template).append(add_specializations_template);
      },

      events: {
        "click .prev"                   :              "prev",
        "click .next"                   :              "next",
        "click .submit"                 :              "submit",
        "submit .add_new_specialization":              "add_new_speciality",
        "submit .add_new_location"      :              "add_new_location",
        "click .add_another"            :              "add_another_field"  
      },

      render: function() {
        this.preload_tab_data(this.form_type);
        $(this.el).append(this.template());
        this.form = $(this.el).find(".primary");
      },
      prev: function(evt) {
      },

      next: function(evt) {
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
        var data = {};
        _.each(this.collection.models, function(model) {
          var type = model.get("form_type"), m = model.toJSON();
          console.log(m)
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

        // Replace with current user
        data["data[Doctor][user_id]"] = 1;
        data["data[Doctor][image]"] = "temp.jpg";

        console.log("DATA", data);
        window.temp_data = data;

        $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
          options.xhrFields = {
            withCredentials: true
          };
        });

        $.ajax({
          type: 'POST',
          url: "http://docawards.com/api/doctors/ws_add.json",
          data: data,
          success: function(data) {
            console.log(data);
            alert("Saved!");
          }
        });

      },

      put_into_form: function(type) {
        var that = this;
        setTimeout(function() {
          $this = $(that.el).parent().find("li.active form.primary");
          for(key in type) {
            $this.find("input[name='" + key + "']").val(type[key]);
            //console.log("key is "+key);
            //console.log("val to put is "+type[key]);
            //console.log($this.find("select[name='"+key+"']"));
            $this.find("select[name='"+key+"']").val(type[key]);
            $this.find("select[name='"+key+"']").trigger('liszt:updated');
            //console.log($this.find("select[name='"+key+"']").val());
          }
        }, 100);
      },
      preload_tab_data: function(type) {
        //Preload the form for the next tab if a model exists for it
        //Model would exist if the user has saved something then clicked next
        var form_type = type;
        model = this.collection.filter(function(model){
          return model.attributes.form_type == form_type;
        });
        if (model && model[0]) {
          this.put_into_form(model[0].toJSON());
        }
      },
      add_new_speciality: function(evt) {
        var $form = $(evt.target),
            data = $form.serializeFormJSON();

        var select = $(this.el).find(".chosen_simple.multiple_select"),
            last_option = parseInt(select.find("option:last-child").val()),
            opt = "<option value=" + (++last_option) + ">" + data["data[Specialty][name]"] + "</option>";

        select.append(opt);
        $("#add_specialization").find(".close-reveal-modal").trigger("click");
        select.trigger("liszt:updated");


        $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
          options.xhrFields = {
            withCredentials: true
          };
        });

        $.ajax({
          type: 'POST',
          url: "http://docawards.com/api/specialties/add",
          data: data,
          success: function(data) {
            console.log(data);
            alert("Saved!");
          }
        });
        return false;
      },

      add_new_location: function(evt) {
        var $form = $(evt.target),
            data = $form.serializeFormJSON();

        console.log(data);
        

        $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
          options.xhrFields = {
            withCredentials: true
          };
        });

        $.ajax({
          type: 'POST',
          url: "http://docawards.com/api/locations/add.json",
          data: data,
          beforeSend: function() {
            console.log("Sending", data)
          },
          success: function(data) {
            console.log(data);
            var opt = "";
            window.temp_locations = data;
            for(var i in data["result"]) {
              console.log(data["result"][i])
              opt += "<option value=" + i + ">" + data["result"][i] + "</option>"
            }

            var select = $(".primary").find(".location_select");
            // last_option = parseInt(select.find("option:last-child").val()),
            // opt = "<option value=" + (++last_option) + ">" + data["data[Location][name]"] + "</option>";
            select.empty().append(opt);
            $("#add_location").find(".close-reveal-modal").trigger("click");
            select.trigger("liszt:updated");


          }
        });
    
        return false;
      },

      add_another_field: function(evt) {
        var elem = $(evt.target).data("elem"), 
            tmpl = _.template(eval(elem));



        var inserted = $(tmpl({ id: (++this.field_count[elem]) })).attr("class", "field").insertBefore($(evt.target).parent().parent()).show();
        inserted.find(".chosen_temp").removeClass("chosen_temp").addClass("chosen_simple").chosen();
        window.autocomplete_ajax_chosen();

        console.log(inserted.find(".datepicker"))
        inserted.find(".datepicker_temp").removeClass("datepicker_temp").datepicker({
          changeMonth: true,
          changeYear: true,
          yearRange: "1910:1999",
          defaultDate: "-30y",
          dateFormat: 'dd-mm-yy'
        });
        return false;
      },

    });

  return ProfileFormView;
});
