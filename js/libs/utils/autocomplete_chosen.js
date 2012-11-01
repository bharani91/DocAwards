 window.render_options = function(result) { 

  $.map( result.doctors, function( item ) {  
    if ($('.chzn-select optgroup.doctors option[data-id='+item.id+']').length == 0) {
      $('.chzn-select optgroup.doctors').append($('<option></option>').val(item.label).attr("data-type", item.type).attr("data-id", item.id).html(item.value));
    }
  })

  $.map( result.diseases, function( item ) {  
    if ($('.chzn-select optgroup.diseases option[data-id='+item.id+']').length == 0) {
     $('.chzn-select optgroup.diseases').append($('<option></option>').val(item.label).attr("data-type", item.type).attr("data-id", item.id).html(item.value));
    }
  })

  $.map( result.specialities, function( item ) {  
    if ($('.chzn-select optgroup.specialties option[data-id='+item.id+']').length == 0) {    
      $('.chzn-select optgroup.specialties').append($('<option></option>').val(item.label).attr("data-type", item.type).attr("data-id", item.id).html(item.value));
    }
  })

  $(".chzn-select").trigger("ajax_liszt:updated");
}

 window.autocomplete_select = function() {
  $('.chzn-search input').autocomplete({
    source: function( request, response ) {
      console.log("source fn called");
      $.ajax({
        url: "http://docawards.com/api/specialties/autocomplete.json?term=" + request.term,
        dataType: "json",
        data: {
            featureClass: "P",
            style: "full",
            maxRows: 12,
        },
        
        beforeSend: function(){
        },
        success: function( data ) {
          result = {};
          result.doctors = []; result.diseases = []; result.specialities = [] 
          $.map(data.data.doctors, function(item) {
              doc = item.Doctor;
              result.doctors.push({
                  label: doc.first_name + " " + doc.last_name,
                  value: doc.first_name + " " + doc.last_name,
                  id: doc.id,
                  type: "doctor"
              });
          });

          $.map(data.data.diseases, function(item) {
              disease = item.Disease;
              result.diseases.push({
                  label: disease.name,
                  value: disease.name,
                  id: disease.id,
                  type: "disease"
              });
          });

          $.map(data.data.specialties, function(item) {
              speciality = item.Specialty;
              result.specialities.push({
                  label: speciality.name,
                  value: speciality.name,
                  id: speciality.id,
                  type: "speciality"
              });
          });


          response( render_options(result) )

          
        }

      })
    }
  });

}

window.autocomplete_ajax_chosen = function() {          

  $('.chzn-search input, .chzn-choices .search-field input').autocomplete({
    source: function( request, response ) {
      console.log("called");
      select_el = $(this['element'].parent().parent().parent().siblings('select'));
      servermodel = select_el.data('servermodel'); 
      if (!servermodel) {
        console.log("no model");
        return
      }
      url = 'http://docawards.com/api/'+servermodel+'/autocomplete.json';
      ajaxopt = select_el.data('ajaxopt');
      $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
        options.xhrFields = {
          withCredentials: true
        };
      });

      $.ajax({
        url: url+"?term=" + request.term + (ajaxopt ? "&"+ajaxopt : ""),
        dataType: "json",
        data: {
            featureClass: "P",
            style: "full",
            maxRows: 12,
        },
        beforeSend: function(){
        },
        success: function( data ) {
          result = {};
          for(var key in data.data) {
            if (select_el.find('option[value='+key+']').length == 0) { 
              select_el.append($('<option>'+data.data[key]+'</option>').val(key));
              select_el.trigger("ajax_liszt:updated");
            }
          }
         }
      });
      response (null); 
    }
  });
}
