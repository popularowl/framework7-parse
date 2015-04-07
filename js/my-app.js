// Initialize your app
var myApp = new Framework7({
    animateNavBackIcon:true,
    template7Pages: true,
    precompileTemplates: true
});

// Export selectors engine
var $$ = Dom7;

// Add main View
var mainView = myApp.addView('.view-main', {
    // Enable dynamic Navbar
    dynamicNavbar: true,
    // Enable Dom Cache so we can use all inline pages
    domCache: true
});

// @TODO Parse.com credentials
// Setup your Parse.com applicationId and API key 
var applicationId = 'xxx';
var restApiKey = 'yyy';


// Funcion to handle Cancel button on Login page
$$('#cancel-login').on('click', function () {
	// Clear field values
	$$('#login-email').val('');
	$$('#login-password').val('');
});

// Funcion to handle Submit button on Login page
$$('#submmit-login').on('click', function () {
    
    var username = $$('#login-email').val();
    var password = $$('#login-password').val();

    console.log('Submit clicked');
    console.log('username: ' +username);
    console.log('password: ' +password);

    var query = 'https://api.parse.com/1/login?username='+username+'&password='+password; 
    myApp.showIndicator();

    // Using Ajax for communication with Parse backend
    // Note mandatory headers with credentials required
    // by Parse. HTTP communication responses are handled
    // in success / error callbacks
	$$.ajax({
		url: query,
		headers: {"X-Parse-Application-Id":applicationId,"X-Parse-REST-API-Key":restApiKey},
	    type: "GET",
	    // if successful response received (http 2xx)
	    success: function(data, textStatus ){
	   		
	    	// We have received response and can hide activity indicator
	   		myApp.hideIndicator();
		
	   		data = JSON.parse(data);
	   		if (!data.username) {return}

	   		var username = data.username;		
			
			// Will pass context with retrieved user name 
			// to welcome page. Redirect to welcome page
			mainView.router.load({
				template: Template7.templates.welcomeTemplate,
				context: {
					name: username
				}
			});
	    },
	    error: function(xhr, textStatus, errorThrown){    	
	    	// We have received response and can hide activity indicator
	    	myApp.hideIndicator();		
			myApp.alert('Login was unsuccessful, please verify username and password and try again');

			$$('#login-email').val('');
			$$('#login-password').val('');
	    }
	});
});


// Function to handle Submit button on Register page
$$('#submmit-register').on('click', function () {
    
    var username = $$('#register-username').val();
    var email = $$('#register-email').val();
    var password = $$('#register-password').val();

    console.log('Submit clicked');
    console.log('username: ' +username+ 'and password: '+password+ 'and email: '+email);

    if (!username || !password || !email){
    	myApp.alert('Please fill in all Registration form fields');
    	return;
    }

   	// Methods to handle speciffic HTTP response codes
	var success201 = function(data, textStatus, jqXHR) {
		
		// We have received response and can hide activity indicator
	   	myApp.hideIndicator();

	   	console.log('Response body: '+data);				
			
		// Will pass context with retrieved user name 
		// to welcome page. Redirect to welcome page
		mainView.router.load({
			template: Template7.templates.welcomeTemplate,
			context: {
				name: username
			}
		});
	};

	var notsuccess = function(data, textStatus, jqXHR) {	
		// We have received response and can hide activity indicator
	    myApp.hideIndicator();		
		myApp.alert('Login was unsuccessful, please try again');
	};

    var query = 'https://api.parse.com/1/users';
    var postdata = {};
    postdata.username = username;
    postdata.password = password;
    postdata.email = email;

    myApp.showIndicator();

    // Using Ajax for communication with Parse backend
    // Note mandatory headers with credentials required
    // by Parse. HTTP communication responses are handled
    // based on HTTP response codes
	$$.ajax({
		url: query,
		headers: {"X-Parse-Application-Id":applicationId,"X-Parse-REST-API-Key":restApiKey},
	    type: "POST",
	    contentType: "application/json",
	    data: JSON.stringify(postdata),

	    statusCode: {
	    	201: success201,
	    	400: notsuccess,
	    	500: notsuccess
	    }
	});

});



