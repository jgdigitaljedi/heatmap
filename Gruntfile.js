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
				src: ['js/*.js']
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
		        files: ['less/*.less'],
		        tasks: ['less'],
		        options: {
		        	spawn: false,
		        	livereload: true
		        }
		    },
		    html: {
		    	files: ['index.html'],
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
		      paths: ['less/']
		    },
		    files: {
		      'result.css': 'less/main.less'
		    }
		  },
		  production: {
		    options: {
		      paths: ['less/'],
		      plugins: [
		        new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions"]})
		      ]
		    },
		    files: {
		      'result.css': 'less/main.less'
		    }
		  }
		},


		injector: {
			options: {},
			dev: {
				files: {
					'index.html': [
						'bower.json',
						'js/*.js',
						'bower_components/jquery/dist/jquery.min.js'
					]
				}
			},
			production: {
				files: {
					'index.html': [
						'app/assets/css/**/*.css',
						'app/assets/js/*.js'
					]

				}
			}
		},

		uglify: {
			app: {
				options: {
					mangle: true
				},
				files: {
					'app/assets/js/<%= pkg.name %>-appbundle.js': 'min-safe/application.js'
				}
			}
		},

		cssmin: {
			target: {
				files: {
					'app/assets/css/result.css': ['app/assets/css/result.css'],
					'app/assets/css/angular-material/angular-material.css': ['app/assets/css/angular-material/angular-material.css'],
					'app/assets/css/angular-material-icons/angular-material-icons.css': ['app/assets/css/angular-material-icons/angular-material-icons.css']
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
	grunt.registerTask('dev', ['jshint', 'injector:dev', 'express', 'less', 'concurrent', 'open']);

};