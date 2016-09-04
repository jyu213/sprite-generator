## sprite-generator
gulp task for creating a image sprite and stylesheets(with [spritesmith](https://github.com/Ensighten/spritesmith)).

### Dependence
you should install [npm](https://npmjs.org/package/gulp-sprite-generator), [gulp](http://gulpjs.com) first.

### Install
`npm install`

### Run
`gulp` or `gulp --path [imagePath] --name [outputSpriteName]`.

You can change `gulpfile.js` to build your own requirements.

### Example

```javascript
gulp.task('default', function() {
    let spriteOutput;

    spriteOutput = gulp.src('./images/*.png')
        .pipe(sprite('sprites.png', {
            baseUrl:         "/images",
            cssPath: '/dist',
            spriteSheetName: "sprites.png",
            spriteSheetPath: "/dist/image"
        })).pipe(gulp.dest('./dist/'));
});
```

### API
`sprite(sprite-name, options)`

#### sprite-name
The name of the sprite file.

#### options
options mix spritesmith options and plugin specific options.

you can find more spritesmith options [here](https://github.com/Ensighten/spritesmith).

##### algorithm
**default**: 'top-down'
**description**: Optional algorithm to pack images with

##### padding
**default**: '10'
**description**:  Padding to use between images

> Plugin options

##### cssFileName
**default**: 'style.css'
**description**: output css file name

### TODO

