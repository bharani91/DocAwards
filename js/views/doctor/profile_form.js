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
  'text!templates/partials/add_specializations_modal.html',
  'text!templates/partials/add_degree_modal.html'

], function($, _, Backbone, FormData, personal_details_template, specializations_template, qualifications_template, 
            experiences_template, consultation_template, contact_details_template, qualification_field, experience_field, 
            consultation_field, contact_field, add_location_modal, add_specializations_modal, add_degrees_modal){
    var ProfileFormView = Backbone.View.extend({
      initialize: function(options) {
        this.el = options.el;
        this.form_type = options.template.split("_template")[0];
        this.template = _.template(eval(options.template));

        // Initialize all field counts to zero
        this.field_count = {
          "qualification_field" : -1,
          "experience_field" : -1,
          "experience_field" : -1,
          "consultation_field" : -1,
          "contact_field" : -1,
        }; 

        this.render();
        add_location_template = _.template(add_location_modal);
        add_specializations_template = _.template(add_specializations_modal);
        add_degrees_template = _.template(add_degrees_modal);
        $(this.el).append(add_location_template).append(add_specializations_template).append(add_degrees_template);
      },

      events: {
        "click .prev"                   :              "prev",
        "click .next"                   :              "next",
        "click .submit"                 :              "submit",
        "submit .add_new_entry"         :              "add_new_entry",
        "click .add_another"            :              "add_another_field"  
      },

      render: function() {
        this.preload_tab_data(this.form_type);
        $(this.el).append(this.template());
        this.form = $(this.el).find(".primary");
        
        // Check if the string ends with s, if not just append _field
        var form_type = this.form_type.split("_")[0],
            field = (form_type.charAt(form_type.length - 1) == "s") ? form_type.slice(0, -1) + "_field" : form_type + "_field",
            count = this.field_count[field];        
        console.log(field);
        if(count == -1) {
          this.add_another_field(field);
        }
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
              alert("Saved!");
              select = $($form.data('targetselect'));
              for(var key in data.data) {
                select.append('<option selected="selected" value='+key+'>'+data.data[key]+'</option>');
              }
              select.trigger("liszt:updated");
              $form.parent().siblings('.close-reveal-modal').trigger('click');
            }
          }
        });
        return false;
      },

      add_another_field: function(evt) {
        // Check Type to see if the function is called on 'click' or on load
        if(typeof evt == "string") {
          var elem = evt,
          target = $("a[data-elem='" + elem + "']");
        } else {
          var elem = $(evt.target).data("elem"),
              target = $(evt.target);
        }
         
        var tmpl = _.template(eval(elem));



        var inserted = $(tmpl({ id: (++this.field_count[elem]) })).attr("class", "field").insertBefore(target.parent().parent()).show();
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

        inserted.find(".timepicker_temp").removeClass("timepicker_temp").timepicker({
          showPeriod: true,
          showLeadingZero: true
        });

        return false;
      },

    });

  return ProfileFormView;
});
