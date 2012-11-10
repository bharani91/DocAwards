
 window.DocAwards = {};
 window.DocAwards.UtilFunctions = {};
 window.DocAwards.UtilFunctions.render_options = function(result) { 
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

 window.DocAwards.UtilFunctions.autocomplete_select = function() {
  $('.chzn-search input').autocomplete({
    source: function( request, response ) {

      window.DocAwards.UtilFunctions.ajax('GET', "specialties/landing_page_autocomplete.json?term=" + request.term, 
        null, function( data ) {
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


          response( window.DocAwards.UtilFunctions.render_options(result) );
        });
    }
  });

}

window.DocAwards.UtilFunctions.autocomplete_ajax_chosen = function() {          

  $('.chzn-search input, .chzn-choices .search-field input').autocomplete({
    source: function( request, response ) {
      console.log("called");
      select_el = $(this['element'].parent().parent().parent().siblings('select'));
      servermodel = select_el.data('servermodel'); 
      if (!servermodel) {
        console.log("no model");
        return
      }
      ajaxopt = select_el.data('ajaxopt');
      relurl = servermodel+'/autocomplete.json?term='+request.term+(ajaxopt ? "&"+ajaxopt : "");
      window.DocAwards.UtilFunctions.ajax('GET', relurl, null, function( data ) {
          result = {};
          for(var key in data.data) {
            if (select_el.find('option[value='+key+']').length == 0) { 
              select_el.append($('<option>'+data.data[key]+'</option>').val(key));
              select_el.trigger("ajax_liszt:updated");
            }
          }
         });
      response (null); 
    }
  });
}

window.DocAwards.UtilFunctions.ajax = function(type, relurl, postdata, successcbk) {
  $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
    options.xhrFields = {
      withCredentials: true
    };
  });

  $.ajax({
    type: type,
    url: "http://docawards.com/api/"+relurl,
    data: postdata,
    dataType: 'json',
    success: successcbk, 
    error: function(xhr, status, error) {
      //Check if this is because we are logged out
      window.DocAwards.current_user.fetch();

      console.log(xhr);
      console.log(status);
      console.log(error);
      $(".alert-box.alert").text('Something went wrong.  Please ensure you are connected to the Internet, and logged in to DocAwards.  Error: '+status+': '+error).slideDown("slow").delay(5000).slideUp("slow");
    }
  });
}

window.DocAwards.UtilFunctions.setChosenVal = function (elem, value) {
  elem.val(value); 
  elem.trigger('liszt:updated')

  if (!elem.data("servermodel")) {
    console.log("ERROR: setChosenVal called with no servermodel set in data.  Returning");
    return;
  }

  // Now check if we need to get any ajax values
  var ids_to_get = [];
  for(var i = 0; i < value.length; i++) {
    var id = value[i];
    var opt = elem.find("option[value=" + id + "]");
    if(opt.length == 0) {
      console.log("Could not find", id);
      ids_to_get.push(id);
    }
  }
  if (ids_to_get.length) {
    window.DocAwards.UtilFunctions.ajax('GET', elem.data("servermodel") + '/autocomplete.json?search_by_id=' + ids_to_get.join(","), 
      null, function(data) {
        if(data.code == 200) {
          for(key in data.data) {
            opt += '<option value='+ key +'>' + data.data[key] + '</option>';  
          }
          elem.append(opt);
          elem.val(value); 
          elem.trigger('liszt:updated')
        }
    });
  }
}
