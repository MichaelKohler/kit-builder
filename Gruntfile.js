module.exports = function(grunt) {
	grunt.initConfig({
// running `grunt less` will compile once
less: {
	development: {
		options: {
			paths: ["./asset/css"],
			yuicompress: true
		},
		files: {
			"./asset/css/style.css": "./asset/less/style.less"
		}
	}
},
// running `grunt watch` will watch for changes
watch: {
	files: "./asset/less/*.less",
	tasks: ["less"]
}
});
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['less']);
};