import * as gulp from 'gulp';
import * as ts from 'gulp-typescript'
import * as sourcemaps from 'gulp-sourcemaps';
import * as del from 'del';
import browsersync from 'browser-sync';
import htmlmin from 'gulp-htmlmin';
import rollupStream from '@rollup/stream';
import rollupTypescript from '@rollup/plugin-typescript';
import source from 'vinyl-source-stream';
import buffer from 'gulp-buffer';
import gulpWrap from 'gulp-wrap';
import concat from 'gulp-concat';
import header from 'gulp-header';
import merge from 'merge-stream';
import flatmap from 'gulp-flatmap';
import path from 'path';
import nodemon from 'gulp-nodemon';

browsersync.create();

const include = require('gulp-include');
const mode = require('gulp-mode')();

const project = ts.createProject('./tsconfig.json')
const editorProject = ts.createProject('./tsconfig.editor.json')

gulp.task('clean', (done) => {
    del.sync(['dist/**']);
    del.sync('resources/editor.js');
    done();
});

gulp.task("editor-html", () => {
    const editor = gulp.src("src/**/editor.html")
        .pipe(flatmap((stream, file) => {
            const moduleName = path.basename(file.dirname);
            return stream.pipe(htmlmin({
                collapseWhitespace: false,
                minifyCSS: true,
            })).pipe(gulpWrap(
                '<script type="text/html" data-template-name="<%= data.type %>"><%= data.contents %></script>',
                { type: moduleName }, // additional variable, next to "contents", see https://github.com/adamayres/gulp-wrap#usage
                { variable: 'data' }, // The data object variable name, see https://lodash.com/docs/4.17.15#template
            ));
        }));

    const help = gulp.src("src/**/help.html")
        .pipe(flatmap((stream, file) => {
            const moduleName = path.basename(file.dirname);
            return stream.pipe(htmlmin({
                collapseWhitespace: false,
                minifyCSS: true,
            })).pipe(gulpWrap(
                '<script type="text/html" data-help-name="<%= data.type %>"><%= data.contents %></script>',
                { type: moduleName }, // additional variable, next to "contents", see https://github.com/adamayres/gulp-wrap#usage
                { variable: 'data' }, // The data object variable name, see https://lodash.com/docs/4.17.15#template
            ));
        }));

    return merge([editor, help])
        .pipe(concat('kube-red.html'))
        .pipe(header('<script type="text/javascript" src="resources/@kube-red/node-red-kube-red/editor.js"></script>')) // must match package name
        .pipe(gulp.dest('dist'));
});

gulp.task("build-node", () => {
    return gulp.src(["src/**/*.ts", "!gulpfile.ts", "!src/**/editor.ts"])
        .pipe(mode.development(sourcemaps.init()))
        .pipe(project())
        .pipe(mode.development(sourcemaps.write('.', {
            includeContent: false,
            sourceRoot: () => '.',
        })))
        .pipe(gulp.dest('./dist'));
});

gulp.task("build-editor", (done) => {
    return mode.development(rollupStream({
        input: 'src/editor.ts',
        output: {
            format: 'iife',
            sourcemap: true,
            sourcemapPathTransform: (relativePath, sourcemapPath) => {
                return relativePath.replace(/^\.\.\/src\//, "src/");
            }
        },
        plugins: [
            rollupTypescript({
                tsconfig: 'tsconfig.editor.json',
            }),
        ],
        external: [],
    }))
        .pipe(mode.production(rollupStream({
            input: 'src/editor.ts',
            output: {
                format: 'iife',
            },
            plugins: [
                rollupTypescript({
                    tsconfig: 'tsconfig.editor.json',
                }),
            ],
            external: [],
        })))
        .pipe(source('editor.js'))
        .pipe(buffer())
        .pipe(gulp.dest('resources'))
});

gulp.task("build", gulp.series(
    gulp.parallel(["build-node", "build-editor", "editor-html"]),
));

gulp.task("nodered", (done) => {
    nodemon({
        exec: "npm install --prefix .node-red . && node-red -u .node-red",
        watch: ["src"],
        tasks: ["build"],
        ext: "ts,html",
        env: {
            NODE_ENV: "development",
            KUBECONFIG: process.env.KUBECONFIG,
        },
        done: done
    })
})

gulp.task("all", gulp.series(["clean", "build"]));
