({
    appDir: "../",
    baseUrl: "js",
    dir: "../../DocAwards-build",
    optimizeCss: "standard",
    cssImportIgnore: null,

    paths: {
	    jquery: 'libs/jquery/jquery-min',
	    underscore: 'libs/underscore/underscore-min',
	    backbone: 'libs/backbone/backbone-optamd3-min',
	    utils: 'libs/utils/util',
	    text: 'libs/require/text',
	    templates: '../templates',
    },
    modules: [
        {
            name: "main"
        }
    ]
})