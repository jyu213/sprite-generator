'use strict';

const gulp = require('gulp');
const sprite = require('./index.js');

let imagePath = gulp.env.path || './images/*.png';
let spriteName = gulp.env.name || 'sprites.png';

gulp.task('default', function() {
    let spriteOutput;

    spriteOutput = gulp.src(imagePath)
        .pipe(sprite(spriteName, {
        })).pipe(gulp.dest('./dist/'));
});