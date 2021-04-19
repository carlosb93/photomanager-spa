const mix = require('laravel-mix');
var path = require('path');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */
mix.webpackConfig({
   resolve: {
      alias: {
         '@': path.resolve(__dirname, 'resources/js'),
         '~': path.resolve(__dirname, 'resources/sass')
      }
   }
});

mix.js('resources/js/main.js', 'public/js/app.js').vue()
   .sass('resources/sass/app.scss', 'public/css');
