// VARIABLES & PATHS

let preprocessor = 'scss', // Preprocessor (sass, scss, less, styl)
	fileswatch = 'html,htm,txt,json,md,woff2', // List of files extensions for watching & hard reload (comma separated)
	imageswatch = 'jpg,jpeg,png,webp,svg', // List of images extensions for watching & compression (comma separated)
	baseDir = 'app', // Base directory path without «/» at the end
	online = true // If «false» - Browsersync will work offline without internet connection

let paths = {

	scripts: {
		src: [
			'node_modules/jquery/dist/jquery.min.js', // npm vendor example (npm i --save-dev jquery)
			// 'node_modules/smooth-scrollbar/dist/smooth-scrollbar.js', // npm vendor example (npm i --save-dev jquery)
			'node_modules/typed.js/lib/typed.min.js',
			'node_modules/imask/dist/imask.js', // npm vendor example (npm i --save-dev jquery)
			'node_modules/gsap/dist/gsap.min.js', // npm vendor example (npm i --save-dev jquery)
			// 'node_modules/scrollmagic/scrollmagic/minified/ScrollMagic.min.js', // npm vendor example (npm i --save-dev jquery)
			// 'node_modules/scrollmagic/scrollmagic/minified/plugins/animation.gsap.min.js', // npm vendor example (npm i --save-dev jquery)
			// 'node_modules/scrollmagic/scrollmagic/minified/plugins/animation.velocity.min.js', // npm vendor example (npm i --save-dev jquery)
			// 'node_modules/scrollmagic/scrollmagic/minified/plugins/debug.addIndicators.min.js', // npm vendor example (npm i --save-dev jquery)
			// baseDir + '/js/owl.carousel.js',
			// baseDir + '/js/debug.addIndicators.js',
			// baseDir + '/js/protip.min.js',
			baseDir + '/js/app.js' // app.js. Always at the end
		],
		dest: baseDir + '/js',
	},

	styles: {
		src: baseDir + '/' + preprocessor + '/main.*',
		dest: baseDir + '/css',
	},

	tailwind: {
		src: baseDir + '/tailwind/*.css',
		dest: baseDir + '/css'
	},

	images: {
		src: baseDir + '/images/src/**/*',
		dest: baseDir + '/images/dest',
	},

	deploy: {
		hostname: 'username@yousite.com', // Deploy hostname
		destination: 'yousite/public_html/', // Deploy destination
		include: [/* '*.htaccess' */], // Included files to deploy
		exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excluded files from deploy
	},

	cssOutputName: 'app.min.css',
	jsOutputName: 'app.min.js',

}

// LOGIC

const { src, dest, parallel, series, watch } = require('gulp')
const sass = require('gulp-sass')
const scss = require('gulp-sass')
const less = require('gulp-less')
const cleancss = require('gulp-clean-css')
const concat = require('gulp-concat')
const browserSync = require('browser-sync').create()
const uglify = require('gulp-uglify-es').default
const autoprefixer = require('gulp-autoprefixer')
const imagemin = require('gulp-imagemin')
const newer = require('gulp-newer')
const rsync = require('gulp-rsync')
const del = require('del')
const postcss = require('gulp-postcss')

function browsersync() {
	browserSync.init({
		server: { baseDir: baseDir + '/' },
		notify: false,
		online: online
	})
}

function scripts() {
	return src(paths.scripts.src)
		.pipe(concat(paths.jsOutputName))
		.pipe(uglify())
		.pipe(dest(paths.scripts.dest))
		.pipe(browserSync.stream())
}

function tailwind() {
	return src(paths.tailwind.src)
		.pipe(postcss())
		.pipe(dest(paths.tailwind.dest))
		.pipe(browserSync.stream())
}

function styles() {
	return src(paths.styles.src)
		.pipe(eval(preprocessor)())
		.pipe(postcss())
		.pipe(concat(paths.cssOutputName))
		// .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
		.pipe(cleancss({ level: { 1: { specialComments: 0 } },/* format: 'beautify' */ }))
		.pipe(dest(paths.styles.dest))
		.pipe(browserSync.stream())
}

function images() {
	return src(paths.images.src)
		.pipe(newer(paths.images.dest))
		.pipe(imagemin())
		.pipe(dest(paths.images.dest))
}

function cleanimg() {
	return del('' + paths.images.dest + '/**/*', { force: true })
}

function deploy() {
	return src(baseDir + '/')
		.pipe(rsync({
			root: baseDir + '/',
			hostname: paths.deploy.hostname,
			destination: paths.deploy.destination,
			include: paths.deploy.include,
			exclude: paths.deploy.exclude,
			recursive: true,
			archive: true,
			silent: false,
			compress: true
		}))
}

function startwatch() {
	watch(baseDir + '/' + preprocessor + '/**/*', { usePolling: true }, styles)
	watch(baseDir + '/' + preprocessor + '/**/*', { usePolling: true }, tailwind)
	watch(baseDir + '/images/src/**/*.{' + imageswatch + '}', { usePolling: true }, images)
	watch(baseDir + '/**/*.{' + fileswatch + '}', { usePolling: true }).on('change', browserSync.reload)
	watch([baseDir + '/js/**/*.js', '!' + paths.scripts.dest + '/*.min.js'], { usePolling: true }, scripts)
}

exports.browsersync = browsersync
// exports.assets      = series(cleanimg, styles, tailwind, scripts, images);
exports.assets = series(cleanimg, styles, scripts, images)
exports.styles = styles
exports.scripts = scripts
exports.images = images
exports.cleanimg = cleanimg
exports.deploy = deploy
// exports.default     = parallel(images, styles, scripts, tailwind, browsersync, startwatch);
exports.default = parallel(images, styles, scripts, browsersync, startwatch)
