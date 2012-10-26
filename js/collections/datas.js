define([
  'jquery',
  'underscore',
  'backbone',
  'models/form_data'
], function($, _, Backbone, FormData){
  var Datas = Backbone.Collection.extend({
    model: FormData,
    // sync: function(method, model, options){  

    //   $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
    //     options.xhrFields = {
    //       withCredentials: true
    //     };
    //   });
      
    //   return Backbone.sync(method, model, options);  
    // }


  });

  return Datas;
});
