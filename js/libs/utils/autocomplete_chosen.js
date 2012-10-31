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
      $.ajax({
        url: "http://docawards.com/api/specialties/autocomplete.json?term=" + request.term,
        dataType: "json",
        data: {
            featureClass: "P",
            style: "full",
            maxRows: 12,
        },
        
        beforeSend: function(){
          // $('.chzn-select').empty();
          // $('ul.chzn-results').empty();

          
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