module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		//combine user fless
		cssmin: {
			combine {
				files: {
					'src/css/main.css':['src/css/App.css','src/css/Bootstrap.css']
				}
			}
		},
		//Minify the js file
		uglify: {
			dist: {
				files: {
					'src/App.min.js':['src/App.js']
				}
			}
		},
		//Convert Sass to Css
		sass: {                             
			dist: {                            
			  options: {                       
				style: 'expanded'
			  },
			  files: {                         
				'src/css/fApp.css': 'src/css/App.scss'
			  }
			}
		  }
	});
	
	//Load the tasks
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-sass');
	
	
	grunt.registerTask('default',['cssmin']);
};