/**
 * css sprite
 */
'use strict';

const path = require('path');
const fs = require('fs');
const File = require('vinyl');
const Spritesmith = require('spritesmith');
const gutil = require('gulp-util');
const through = require('through2');
const Readable = require('stream').Readable;

const PLUGIN_NAME = 'sprite-generator';

/**
 * css sprite create
 * @param  {String} fileName   create image name
 * @param  {Object} options generator config
 */
module.exports = (fileName, options) => {
    let stream;
    if(!fileName) {
        throw new gutil.PluginError(PLUGIN_NAME, 'missing filename option');
    }

    options = Object.assign({}, {
        src: [],
        // engine: 'pixelsmith',
        algorithm: 'top-down',
        padding: 10,
        engineOpts: {},
        exportOpts: {
        },
        imgOpts: {
            timeout: 30000
        },

        cssFileName: 'style.css'
    }, options);

    let sprites = [];
    let bufferStream = (file, enc, done) => {
        let that = stream;

        if (file.isNull()) {
            that.push(file);
            return done();
        }
        if (file.isStream()) {
            that.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Stream is not support'));
            return done();
        }

        sprites.push(file.path);
        done();

        return null;
    };
    let endStream = (done) => {
        const that = stream;
        const spritesmith = new Spritesmith();
        spritesmith.createImages(sprites, function handleImages(err, images) {
            if (err) {
                that.emit('error', new gutil.PluginError(PLUGIN_NAME, 'sprite error: ' + err));
                return false;
            }
            const result = spritesmith.processImages(images, options);
            const sprite = new File({
                path: fileName,
                contents: result.image
            });

            let styleSheet = '';
            let styleType2Sheet = '';

            if (sprites.length === 0) {
                that.emit('error', new gutil.PluginError(PLUGIN_NAME, 'there was no image found'));
                return done();
            }
            sprites.forEach((item, i) => {
                const basename = path.basename(item);
                const coordinates = result.coordinates[item];
                const cssClass = basename.split('.')[0];
                const coordinatesX = coordinates.x === 0 ? coordinates.x : `-${coordinates.x}px`;
                const coordinatesY = coordinates.y === 0 ? coordinates.y : `-${coordinates.y}px`;
                // type1 style
                let template = `.${cssClass} {\n    width: ${coordinates.width}px;\n    height: ${coordinates.height}px; \n    background: url('${fileName}') no-repeat ${coordinatesX} ${coordinatesY};\n}\n`;
                styleSheet += template;
                // type2 style
                let template2 = `.${fileName.split('.')[0] + i.toString()} {\n    width: ${coordinates.width}px;\n    height: ${coordinates.height}px;\n    background-image: url('${fileName}');\n    background-position: ${coordinatesX} ${coordinatesY};\n}\n`;
                styleType2Sheet += template2;
            });
            const cssFile = new File({
                path: options.cssFileName,
                contents: new Buffer(`${styleSheet}\n\n\n\n${styleType2Sheet}`)
            });
            stream.push(sprite);
            stream.push(cssFile);
            done();
        });
    };
    stream = through.obj(bufferStream, endStream);

    return stream;
}
