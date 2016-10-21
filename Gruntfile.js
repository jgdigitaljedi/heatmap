// Grunt tasks

module.exports = function (grunt) {
	"use strict";

	// Project configuration.
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),
		banner: '/*!\n' +
		'* <%= pkg.name %> - v<%= pkg.version %> - MIT LICENSE <%= grunt.template.today("yyyy-mm-dd") %>. \n' +
		'* @author <%= pkg.author %>\n' +
		'*/\n',

		open: {
	      	server: {
	        	url: 'http://localhost:<%= express.api.options.port %>'
	      	}
	    },

		jshint: {
			options: {
				jshintrc: '.jshintrc',
				smarttabs: true
			},
			gruntfile: {
				src: 'Gruntfile.js'
			},
			app: {
				src: ['app/*.js', 'app/**/*.js']
			}
		},

		connect: {
			server: {
				options: {
					keepalive: true,
					port: 4000,
					base: '.',
					hostname: 'localhost',
					debug: true,
					livereload: true,
					open: true
				}
			}
		},

		concurrent: {
			tasks: ['connect', 'watch'],
			options: {
				logConcurrentOutput: true
			}
		},

		watch: {
			app: {
				files: '<%= jshint.app.src %>',
				tasks: ['jshint:app'],
				options: {
					livereload: true,
					spawn: false
				}
			},
			styles: {
		        files: ['app/less/*.less', 'app/directives/*.less'],
		        tasks: ['less'],
		        options: {
		        	spawn: false,
		        	livereload: true
		        }
		    },
		    html: {
		    	files: ['index.html', 'app/views/*.html', 'app/directives/*.html'],
		    	options: {
		    		spawn: false,
		    		livereload: true
		    	}
		    },
		    utility: {
		    	files: ['Gruntfile.js'],
		    	options: {
		    		spawn: false,
		    		livereload: true
		    	}
		    }

		},

		less: {
		  development: {
		    options: {
		      paths: ['app/less/']
		    },
		    files: {
		      'result.css': 'less/main.less'
		    }
		  },
		  production: {
		    options: {
		      paths: ['app/less/'],
		      plugins: [
		        new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions"]})
		      ]
		    },
		    files: {
		      'result.css': 'app/less/main.less'
		    }
		  }
		},


		injector: {
			options: {},
			devJs: {
				files: {
					'index.html': [
						'bower.json',
						'app/*.js',
						'app/**/*.js'
					]
				},
				tasks: ['injector:js']
			},
			devCss: {
				files: {
					'index.html': [
						'result.css',
						'bower_components/angular-material/angular-material.min.css'
					]
				}
			},
			production: {
				files: {
					'index.html': [
						'dist/concatted.js'
					]

				},tasks: ['injector:css']
			}
		},

		uglify: {
			app: {
				options: {
					mangle: true
				},
				files: {
					'dist/<%= pkg.name %>-appbundle.js': 'min-safe/application.js'
				}
			}
		},

		cssmin: {
			target: {
				files: {
					'result.css': ['result.css']
				}
			}
		},

		// copy: {
		// 	main: {
		// 		files: [
		// 			{
		// 				expand: true,
		// 				src: 'node_modules/font-awesome/fonts/*',
		// 				dest: 'app/assets/fonts/',
		// 				flatten: true
		// 			}
		// 		]
		// 	}
		// },

		express: {
			api: {
				options: {
					script: 'server.js',
					port: 3000
				}
			}
		}
	});

	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);

	// Making grunt default to force in order not to break the project if something fail.
	grunt.option('force', true);

	// Register grunt tasks
	grunt.registerTask("build", [
		"jshint",
		"copy",
		"less",
		"exec",
		"uglify",
		"cssmin",
		"injector:production",
		"concurrent",
		"clean"
	]);

	// Development task(s).
	grunt.registerTask('dev', ['jshint', 'injector:devJs', 'injector:devCss', 'express', 'less', 'concurrent', 'open']);

};