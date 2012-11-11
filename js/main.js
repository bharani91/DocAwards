require.config({
  paths: {
    jquery: 'libs/jquery/jquery-min',
    underscore: 'libs/underscore/underscore-min',
    backbone: 'libs/backbone/backbone-optamd3-min',
    utils: 'libs/utils/util',
    text: 'libs/require/text',
    templates: '../templates',
  }, 
  shim: {
    "foundation/jquery.foundation.accordion": ['jquery'],
    "foundation/jquery.foundation.alerts": ['jquery'],
    "foundation/jquery.foundation.buttons": ['jquery'],
    "foundation/jquery.foundation.forms": ['jquery'],
    "foundation/jquery.foundation.mediaQueryToggle": ['jquery'],
    "foundation/jquery.foundation.navigation": ['jquery'],
    "foundation/jquery.foundation.orbit": ['jquery'],
    "foundation/jquery.foundation.reveal": ['jquery'],
    "foundation/jquery.foundation.tabs": ['jquery'],
    "foundation/jquery.foundation.tooltips": ['jquery'],
    "foundation/jquery.foundation.topbar": ['jquery'],
    "foundation/jquery.placeholder": ['jquery'],
    "foundation/app": ['jquery'],
    "vendor/jquery-ui": ['jquery'],
    "vendor/jquery.elastislide": ['jquery'],
    "vendor/chosen.jquery.min": ['jquery'],
    "libs/utils/jquery.ui.timepicker": ['jquery'],
    "vendor/jquery.wrapinbox": ['jquery'],
    "libs/utils/serialize": ['jquery']
  }
});

require([
  'app',
  'models/user',
  'libs/utils/docawards_util',
  "foundation/jquery.foundation.accordion",
  "foundation/jquery.foundation.alerts",
  "foundation/jquery.foundation.buttons",
  "foundation/jquery.foundation.forms",
  "foundation/jquery.foundation.mediaQueryToggle",
  "foundation/jquery.foundation.navigation",
  "foundation/jquery.foundation.orbit",
  "foundation/jquery.foundation.reveal",
  "foundation/jquery.foundation.tabs",
  "foundation/jquery.foundation.tooltips",
  "foundation/jquery.foundation.topbar",
  "foundation/jquery.placeholder",
  "foundation/app",
  "vendor/jquery-ui",
  "vendor/jquery.elastislide",
  "vendor/chosen.jquery.min",
  "libs/utils/jquery.ui.timepicker",
  "vendor/jquery.wrapinbox",
  "libs/utils/serialize"
], function(App, User){
  window.DocAwards.current_user = new User(); 
  App.initialize();
});
