require.config({
  paths: {
    jquery: 'libs/jquery/jquery-min',
    underscore: 'libs/underscore/underscore-min',
    backbone: 'libs/backbone/backbone-optamd3-min',
    utils: 'libs/utils/util',
    text: 'libs/require/text',
    templates: '../templates'
  }

});

require([
  'app'
], function(App){
  App.initialize();
});
