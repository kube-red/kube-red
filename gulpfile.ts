const { watch, src, dest, parallel, series, task } = require('gulp')
const nodemon = require('nodemon');
const ts = require('gulp-typescript');
const run = require('gulp-run');
const browserSync = require('browser-sync');

const project = ts.createProject('./tsconfig.json')

let nodemonInstance;
let browserSyncInstance;

// nodemon and browser-sync code modified from
// https://github.com/connio/node-red-contrib-connio/blob/master/gulpfile.js
function runNodemonAndBrowserSync(done: () => void) {
    run('npm install --prefix .node-red .').exec();
    nodemonInstance = nodemon(`nodemon --ignore **/* --exec node-red -u .node-red`);

    nodemon
        .once('start', () => {
            browserSyncInstance = browserSync.create();
            browserSyncInstance.init({
                ui: false,
                proxy: {
                    target: 'http://localhost:1880',
                    ws: true,
                },
                ghostMode: false,
                open: false,
                reloadDelay: 4000,
            });
        })
        .on('quit', () => process.exit(0));

    done();
}


task("build", () => {
    return src(["src/*.ts"])
        .pipe(project())
        .pipe(dest('dist'))
})

task("server", series(["build", runNodemonAndBrowserSync]))