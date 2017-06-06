'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

module.exports = function(options) {
    gulp.task('partials', function() {
        return gulp.src([
                options.src + '/app/**/*.html',
                options.tmp + '/serve/app/**/*.html'
            ])
            .pipe($.minifyHtml({
                empty: true,
                spare: true,
                quotes: true
            }))
            .pipe($.angularTemplatecache('templateCacheHtml.js', {
                module: 'app',
                root: 'app'
            }))
            .pipe(gulp.dest(options.tmp + '/partials/'));
    });

    gulp.task('html', ['inject', 'partials'], function() {
        var partialsInjectFile = gulp.src(options.tmp + '/partials/templateCacheHtml.js', { read: false });
        var partialsInjectOptions = {
            starttag: '<!-- inject:partials -->',
            ignorePath: options.tmp + '/partials',
            addRootSlash: false
        };

        var htmlFilter = $.filter('*.html');
        var jsFilter = $.filter('**/*.js', '!' + options.src + '/**/scktool-*.js');
        var cssFilter = $.filter('**/*.css');
        var assets;

        return gulp.src(options.tmp + '/serve/*.html')
            .pipe($.inject(partialsInjectFile, partialsInjectOptions))
            .pipe(assets = $.useref.assets())
            .pipe($.rev())
            .pipe(jsFilter)
            .pipe($.ngAnnotate())
            .pipe($.uglify({ preserveComments: $.uglifySaveLicense })).on('error', options.errorHandler('Uglify'))
            .pipe(jsFilter.restore())
            .pipe(cssFilter)
            .pipe($.csso())
            .pipe(cssFilter.restore())
            .pipe(assets.restore())
            .pipe($.useref())
            .pipe($.revReplace())
            .pipe(htmlFilter)
            .pipe($.minifyHtml({
                empty: true,
                spare: true,
                quotes: true,
                conditionals: true
            }))
            .pipe(htmlFilter.restore())
            .pipe(gulp.dest(options.dist + '/'))
            .pipe($.size({ title: options.dist + '/', showFiles: true }));
    });

    // Only applies for fonts from bower dependencies
    // Custom fonts are handled by the "other" task
    gulp.task('fonts', function() {
        return gulp.src($.mainBowerFiles())
            .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
            .pipe($.flatten())
            .pipe(gulp.dest(options.dist + '/fonts/'));
    });

    gulp.task('other', function() {
        return gulp.src([
                options.src + '/**/*',
                '!' + options.src + '/**/*.{html,css,js,scss}'
            ])
            .pipe(gulp.dest(options.dist + '/'));
    });


    gulp.task('clean', function(done) {
        $.del([options.dist + '/', options.tmp + '/'], done);
    });

    gulp.task('external-assets', function() {
        return gulp.src(['bower_components/leaflet/dist/images/**',
                'bower_components/leaflet-draw/dist/images/**',
                'bower_components/mapbox.js/images/**'
            ])
            .pipe(gulp.dest(options.dist + '/styles/images'));
    });

    gulp.task('datatables-assets', function() {
        return gulp.src(['bower_components/datatables/media/images/**'])
            .pipe(gulp.dest(options.dist + '/images'));
    });

    gulp.task('jsoneditor-assets', function() {
        return gulp.src(['bower_components/jsoneditor/dist/img/**'])
            .pipe(gulp.dest(options.dist + '/styles/img'));
    });

    gulp.task('build', ['html', 'fonts', 'other', 'external-assets', 'datatables-assets', 'jsoneditor-assets']);
};