define([
  'jquery',
  'underscore',
  'backbone',
  'models/form_data'
], function($, _, Backbone, FormData){
  var Datas = Backbone.Collection.extend({
    model: FormData,

    initialize: function (options) {
      if(window.DocAwards.current_user.getDoctor().id) {
        this.id = window.DocAwards.current_user.getDoctor().id;
      } else {
        window.DocAwards.current_user.bind('AuthChange', this.setID);  
      }

      

      // Initialize all field counts to zero
      this.field_count = {
        "qualification_field" : -1,
        "experience_field" : -1,
        "experience_field" : -1,
        "consultation_field" : -1,
        "contact_field" : -1,
      }; 

      // Mappings

        this.mappings = {
          "Docspeclink": "specializations",
          "Docconsultlocation": "consultation",
          "DoctorContact": "contact",
          "Experience": "experiences",
          "Qualification": "qualifications",
          "Doctor": "personal_details"
        };

    },

    setID: function() {
      this.id = window.DocAwards.current_user.getDoctor().id;
    },

    url: function() {
      return "http://docawards.com/api/doctors/get_doctors.json?doctor_id=" + this.id
    },

    parse: function(response) {
      return response.data[0];
    },

    fetch_from_server: function() {
      var that = this;
      this.fetch({
        success: function(collection) {
          console.log("SERVER DATA", collection.toJSON());
          that.parse_doctor_data(collection.toJSON()[0]);
        }
      });
    },

    
    // Parse the received JSON into a simple object with appropropriate 'name' field
    parse_doctor_data: function(model) {

      var data = {};
      console.log("MODEL", model);
      for(var obj in model) {
        // Nested Data eg: Consult locations, experiences
        if(model[obj].constructor == Array) {
          // Set the initial partial fields counter
          var field = obj.toLowerCase() + "_field";

          if(this.field_count[field]) this.field_count[field] = model[obj].length - 1;

          // Fill Consult Locations separately because of difference in names
          if(obj == 'Docconsultlocation') this.field_count['consultation_field'] = model['Docconsultlocation'].length - 1

          // Fill Consult Locations separately because of difference in names
          if(obj == 'DoctorContact') this.field_count['contact_field'] = model['DoctorContact'].length - 1


          // Separate out the DocSpecLinks to use in Multiple-select Chosen
          if(obj == 'Docspeclink' && model[obj].length) {
            var temp = "";
            var temp_data = {};
            
            for(var i = 0; i < model[obj].length; i++) {
              temp += (model[obj][i]['specialty_id'] + ", ");
            }

            // Complete collection
            data["data[Docspeclink]"] = temp;

            // Per instance
            temp_data["data[Docspeclink]"] = temp;
            
            var m = new FormData(temp_data);
            m.set({ "form_type": this.mappings[obj] });
            
            var field = this.mappings[obj];
            this.add(m)


          } else {
            var temp_data = {};

            for(var i = 0; i < model[obj].length; i++) {
              for(key in model[obj][i]) {
                if(typeof model[obj][i][key] != 'object') {
                  data[ 'data[' + obj + '][' + i + '][' + key + ']' ] = model[obj][i][key];
                  temp_data[ 'data[' + obj + '][' + i + '][' + key + ']' ] = model[obj][i][key];
                }
              } 
            }  

            var m = new FormData(temp_data);
            m.set({ "form_type": this.mappings[obj] });
            
            var field = this.mappings[obj];
            this.add(m)


          }
          
        } else if(model[obj].constructor == Object) {
          // Doctor Profile
          var temp_data = {}
          for(key in model[obj]) {
            data[ 'data[' + obj + '][' + key + ']' ] = model[obj][key];
            temp_data[ 'data[' + obj + '][' + key + ']' ] = model[obj][key];
          }

          var m = new FormData(temp_data);
          m.set({ "form_type": "personal_details" });
          this.add(m);
        }
      }

      this.trigger("fetched_from_server", data);


    },

    sync: function(method, model, options){  

      $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
        options.xhrFields = {
          withCredentials: true
        };
      });
      
      return Backbone.sync(method, model, options);  
    }


  });

  return Datas;
});
