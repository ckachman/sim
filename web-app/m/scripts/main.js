/**
<pre>
.-.   .-.
|  `.'  |  TARGET CANADA 
| |\ /| |  MOBILE HANDHELD APPLICATION
`-' ` `-'
*************************************************************************************
*************************************************************************************

This Javascript file creates the m object, the object to which our main app space is 
scoped. The m.init() function is called on document.ready, which loads the main.html 
buttons and internationalization strings.

Clicking on an app button calls that app's js file and creates a new app object 
unless one already exists in which case the app's toggleIn() function is called. The 
app is responsible for loading itself.

When the toggle (or currently, home as well) button is clicked, the current app's 
toggleOut() function is called, which will save its current state to the server (or 
retaining itself in browser memory). The m framework hides the app.

Be careful when adding event handlers in the app page functions. These get called 
every time the app toggles, so if you add a button click without removing previous 
button clicks first (using button.unbind('click') for example), that button click 
event fires multiple times.

ADDING A NEW APP:
	* First, add the HTML templates. Each one should have one .appfrag, named the same as the variable name (e.g. 'Backstock').
	* Within the appfrag, add each page's pagefrag with the pagefrag id = the page name (e.g. 'BCK001').
	* If a pagefrag's form has an 'action' attribute, that's what ajax will try to load automatically. 
	* Create the app variable (copy Backstock or Home) and add the required and optional code blocks for each page ([optional]):
		BCK001: function(data) { add code here to set up HTML components and page config info }
		[, BCK001_submit(form) { add code here to validate and submit the form; return m.doAjaxFormSubmit(form) to do a standard serialize() and submit via ajax. }]
		[, BCK001_success() { add code here to process the returned data. Omitting this will simply load the 'page' page and config data that the server returns. }]
	* Change the view to instead return a JSON object; test JSON object using JSONLint.com.
	* The first page of any app must return a 'strings' object that contains all of the internationalization strings for any overall buttons or text the entire app will use:
		"strings": {
		"appName":			"Backstock",
		"page":				"Page",
		"of":				"of",
		"close":			"Close",
		"enter":			"Enter"
	}

	* Successful JSON objects should include the following basic objects (in addition to any custom objects the page will need like grid table data):
		"status":		"success",
		"page":			"BCK002",
		"config": {
			"appLabel":			"Backstock",
			"leftURL":			"ajax/ajax_Home.chtm",
			"homeURL":			"ajax/ajax_Home.chtm",
			"toggleURL":		"ajax/ajax_Home.chtm",
			"showKeyboard":		true,
			"line_1":			"",
			"line_2":			"490581002089",
			"line_3":			"Men's Denim Shorts",
			"fill_group":		"Fill group: Mens",
			"fieldLabel":		"<b>Scan</b>/<b>Key</b> location",
			"fieldID":			"txtLocationScan",
			"formID":			"formBCK002"
		},
		"gridTable":	{
			"header": [ "Location", "Group", "Qty"],
			"data": [
				[ "1xA232A32", "Open Stock", "NQ" ],
				[ "2xD145S01", "Open Stock", "NQ" ]
			]
		}
	* Unsuccessful JSON objects should include the following basic objects (status = error, info):
		"status":		"error",
		"message":		"Error message to be displayed goes here.",
		"redirect":		"URL to redirect rather than display error",
		"redirectViaAjax": false,
		"redirectOnOK":	false,
		"redirectAjaxData":	{ "message_back_to_server": "any kind of object we want can go here" }
		
		redirectOnOk = true will not automatically redirect to the redirect URL, instead waiting for user approval. If redirect is missing, the error will pop up but stay on the same page. redirectViaAjax = true will cause the redirect to call the server via ajax rather than refreshing the entire page. The redirectAjaxData will send a payload back to the server.
	
	
	


TODO:
	create in-page dialogs? -- replace current page with error message, 
		and cancel should back current page content. Popup already does this.
	check if device has arrow keys for pagination?
	add more apps and html components
	finalize config format, update JSON files to be Views.
		

mIE6 caveats: 
	use .on('click', 'selector', function) rather than just .click(function) 
	as it prevents memory leaks automatically using delegation.
	(typeof curGridPage != 'undefined') or $('#div').length -- rather 
	than (curGridPage)
	POST ajax type doesn't appear to work
	.submit() form handling in jquery doesn't work (need an onsubmit="function ()" 
	in the form attributes in HTML)
	make sure MIME type for json files are set on INQS to application/json
	['submitted: ', input].join('') instead of 'submitted: ' + input -- join() 
	is faster than concatenation
	use named functions rather than closures to increase speed and prevent memory leaks
	using pseudo-selectors in IE6 jquery for things is iffy (':visible', 'input:text', etc.)
	Processing time on the device for JS execution is very slow.


RhoElements caveats:
	To get the correct viewport size, add a meta tag: &lt;META HTTP-Equiv="zoom" Content="page:2.0"&gt;
	scanner.enable() and scanner.disable() take up to 3 seconds each. Do this in JS 
		
	
VARIABLES:
m.curApp							stores a reference to the currently active app
m.currentTextField					stores a reference to the currently visible text field
m.currentForm						stores a reference to the currently active form

m.apps[appname]							each app instantiates into m's scope. [appname] is Home, Pull, Backstock, etc. Created by loadAppFromServer().
</pre>

@class m */

/*global $:true, u:true, window:true, document:true, pageload:true */

var m = {};
m.mainAppIsLoaded = false; /** Shows whether the mainApp has been loaded or not. */

/**
Create a dialog box with msg as text. type determines the icon (error, alert, info). NOTE: only one box will appear. Multiple calls will appear in the dialog box text serially. m.hideError() hides the error/alert dialog box.

@function m.popError
@param {string} msg The message to display.
@param {string} [type] The type of error message. Determines the icon/styles to use.
@param {boolean} [inpage] Whether the dialog appears as a popup or on the page itself.
*/
m.popError = function (msgbody, msgheader, type, beepCount, inpage) {
	var mytype = type || 'info';//, tmpmsg = $('.errorAlert .errorDisplayMessage').html();
	
	var icon = $("<div class='icon icon_"+mytype+"' />");
	$('.errorAlert .errorDisplayMessage h3').html(msgheader);
	$('.errorAlert .errorDisplayMessage p').html(msgbody);
	
	$('.errorAlert .icon').attr('class', 'icon icon_' + mytype);
	$('.errorAlert').removeClass().addClass('errorAlert');
	if (inpage) {
		$('#ErrorIdMask, #ErrorId').show();
	} else {
		$('#ErrorIdMask, #ErrorId').show();
		$('#ErrorId .infoBox .btnEnterQty').focus();
		$('.errorAlert').addClass('errorAlert_' + type)
	}
	u.beeper(beepCount);
};

/**
Create a completely blank dialog box with msg as text but no formatting or icons. m.hideError() hides the error/alert dialog box.

@function m.popBlankError
@param {string} msg The message to display.
*/
m.popBlankError = function (msg) {
	$('#blankErrorId .infoBox').html(msg);
	$('#ErrorIdMask, #blankErrorId').show();
	u.beeper();
}
/**
Hide the common error popup

@function m.hideError
*/
m.hideError = function () {
	u.isSubmitting = false;
	m.getCurrentTextField().val('');
	$('.errorAlert, #ErrorIdMask').hide();
	$('.errorAlert .errorDisplayMessage h3, .errorAlert .errorDisplayMessage p').html('');
	m.setDefaultFocus();
};

/**
The centralized ajax function for all calls. Mostly just a wrapper to consolidate functions.

@function m.ajax
@param {object} obj The configuration object.
@config {string} url The ajax url to get
@config {string} [data] The serialized data from a form 
@config {boolean} [cache] Whether or not to cache this transaction
@config {string} [dataType] JSON or HTML, depending on whether this is data or a page fragment
@config {string} type GET or POST. POST ajax calls don't work on mIE6.
@config {function} success the callback function to return the data
@config {function} error The callback function for errors. These will generally be m.ajaxError().
*/
m.ajax = function (obj) {
	u.setMSecsData();
	return $.ajax({
		url: obj.url,
		data: obj.data,
		cache: obj.cache || false,
		dataType: obj.dataType || 'json',
		type: obj.type || 'post',
		success: obj.success || m.ajaxSuccess,
		error: obj.error || m.ajaxError
	});
};

/**
The centralized ajax error function for all calls. Mostly just a wrapper to consolidate functions.

@function m.ajaxError
@param {object} x The XHR return object
@config {string} y The ajax options
@config {string} z The error that was thrown 
*/
m.ajaxError = function (x, y, z) {
	var errorstring  = [x.statusText, '; ', y, ': ', z].join('');
	if (y === 'parsererror') { // we got HTML back rather than a json object
		if (x.responseText.indexOf('<html') >= 0) { // this means it's a full HTML page and not just a fragment
			$('body').html(x.responseText);
		} else { // it's a fragment, just place the fragment in a full-page box. TODO: how to handle button clicks?
			m.popBlankError(x.responseText);
		}
	} else {
		m.popError(errorstring, 'error');
	}
	return false;
};

/**
The centralized ajax success function. This checks to see if there is a m.curApp.curPage + "_success" function 
defined and runs it, otherwise just loads the page requested by the returned data object directly.

@function m.ajaxSuccess
@param {object} data The data object returned from the ajax call 
*/
m.ajaxSuccess = function (data) {
	// first, check for errors:
	if (data.status !== 'success') { 
		if (typeof data.redirect === 'string') {
			if (data.redirectOnOK === true) {
				m.popError(data.body, data.header, data.status, data.beepCount);
				if (data.redirectViaAjax === true) { // there is an error redirect, we're redirecting on OK via an ajax call
					// reset behavior of button click:
					$('.infoBox').off("click", '.btnEnterQty').on("click", '.btnEnterQty', function() {
						// set behavior of button click back to what it was.
						$('.infoBox').off("click", '.btnEnterQty').on("click", '.btnEnterQty', m.hideError);
						m.ajax({'url': data.redirect, 'data': data.redirectAjaxData}); // accept the defaults
					});
				} else { // not redirecting via ajax
					$('.errorAlert .btnEnterQty').click(function() {
						location.href = data.redirect;
					});
				}
			} else { // not redirect on OK, just redirect immediately to the new page
				location.href = data.redirect;
			}
		} else { // not redirecting at all, just popup error or info message.
			m.popError(data.body, data.header, data.status, data.beepCount);
		}
	} else { // NO ERROR: just load the page
		var success = m.curApp[[m.curApp.curPage, "_success"].join('')]; // we have a BCK001_success(data) function listed, call it:
		if (typeof success === 'function') {
			u.getMSecsData();
			success(data);
		} else { // no predefined success function
			if (typeof data.strings === 'undefined') { // this is just a page load
				u.getMSecsData();
				m.curApp.loadPage(data.page, data);
			} else { // this is a new application from the server, load it.
				u.getMSecsData();
				m.loadAppFromServer(data);
			}
		}
	}
};

/**
Make the div with id=pageId visible. dataToPass can config the div elements (i.e. from an 
ajax call). NOTE: this function will automatically run a function named curApp.[pageId] 
after the html is loaded.

@function m.loadPage
@param {string} pageId The page name ('BCK001') 
@param {object} [dataToPass] The returned JSON object. Should have a 'status', 'config' object.
*/
m.loadPage = function (pageId, dataToPass) {
	u.isSubmitting = false; // this sets the scanner up to shoot the next form field. see utility_functions.jsx => u.baseScanEvent()
	u.OnLoadTimer(); // this sets logging. see utility_functions.jsx => u.OnLoadTimer()
	m.showAppButtons(dataToPass.config, dataToPass.strings); // sets up home, toggle, etc.
	m.curApp.curPage = pageId;
	var curForm = $('#' + pageId + ' form');
	if (typeof dataToPass.config.formID === 'string') { // give custom ID to form
		curForm.attr('id', dataToPass.config.formID);
	}
	if (typeof dataToPass.config.formAction === 'string') { // give custom URL to form
		curForm.attr('action', dataToPass.config.formAction);
	}
	$('.ScreenID label').html(pageId); // add pageId to the bottom
	$('.pagefrag.active').removeClass('active'); // hide any visible pages
	$(['#', pageId].join('')).addClass('active'); // make just this page visible
	// set up back button functionality.
	if (m.curApp.appStack.pageName.length === 1) {
		$('#AppNavBar #navBtns').html('');
	} else {
		var hasRel = dataToPass.config.leftURL ? " rel='" + dataToPass.config.leftURL + "'" : "";
		$('#AppNavBar #navBtns').html('<a class="btn btn_left' + hasRel + '"></a>');
		$('#AppNavBar #navBtns .btn_left').click(m.loadPreviousPage);
	}
	// get rid of any info boxes
	$('#ErrorId .infoBox .btnEnterQty').click();
	// check to see if there's a page function, then load it.
	var data = dataToPass || '';
	if (m.curApp[pageId] && typeof m.curApp[pageId] === 'function') { // if no loadFunction is detected, see if the pageId name itself is a function.
		m.curApp[pageId](data);
	}
};

/**
Wrapper function that calls the app's loadPreviousPage function, or just loads a new page from URL if that URL is provided

@function m.loadPreviousPage
*/
m.loadPreviousPage = function (e) {
	e.preventDefault();
	/*var rel = $(e.currentTarget).attr("rel");
	if (typeof rel === 'string') {
		m.ajax({'url': rel, success: m.loadAppFromServer});
	} else {*/
		m.curApp.loadPreviousPage();
	//}
};


/**
Submits the passed form using the m.curApp.curPage + "_submit" function for validation, ajax setup, etc.

@function m.curFormSubmit
@param {object} form The form to submit
*/
m.curFormSubmit = function (form) {
	return m.curApp[[m.curApp.curPage, "_submit"].join('')](form);
};

/**
Sets up the ajax function for sending.

@function m.doAjaxFormSubmit
@param {object} form The form to serialize 
*/
m.doAjaxFormSubmit = function (form, myurl) {
	var curForm = $(form), input = curForm.serialize(), myurl = curForm.attr('action') || myurl || [u.baseURL, "/ajax/ajax_", m.curApp.curPage, ".chtm"].join('');
	m.ajax({
		url: myurl,
		data: input,
		cache: false,
	});
	return false;
};

/**
Only checks to see if the form has data in it.

@function m.validateForm
@param {object} form The form to check 
@returns {boolean} Whether it's empty or not
*/
m.validateForm = function (form) {
	var inputs = $('input[type=text]', form), empty = true;
	$(inputs).each(function () {
		if ($(this).val() != '') {
			empty = false;
		}
	});
	return !empty;
};


/**
Wrapper function for forcing numeric values in a field on key press

@function m.forceNumericOnly
@param {string} obj The field to validate.
*/
m.forceNumericOnly = function (obj) {
	return $(obj).keydown(m.forceNumericOnlyHandler);
};
/**
Forcing numeric values only. Not called directly.

@function m.forceNumericOnlyHandler
@param {event} e The event contains the key pressed.
*/
m.forceNumericOnlyHandler = function (e) {
	var key = e.charCode || e.keyCode || 0, fail = false;
	// allow backspace, tab, delete, arrows, numbers and keypad numbers ONLY
	if (key === 8 || key === 9 || key === 46 || key === 13 || key === 35 || key === 36 || (key >= 37 && key <= 40)) {
		fail = false;
	} else if (!(e.shiftKey) && (key >= 48 && key <= 57)) {
		fail = false;
	} else if ((key >= 96 && key <= 105)) {
		fail = false;
	} else { fail = true; }
	if (fail) { e.preventDefault(); }
};

/**
Wrapper function for forcing alphanumeric values in a field on key press

@function m.forceAlphaNumericOnly
@param {string} obj The field to validate.
*/
m.forceAlphaNumericOnly = function (obj) {
	return $(obj).keydown(m.forceAlphaNumericOnlyHandler);
};
/**
Forcing alphanumeric values only. Not called directly.

@function m.forceAlphaNumericOnlyHandler
@param {event} e The event contains the key pressed.
*/
m.forceAlphaNumericOnlyHandler = function (e) {
	var key = e.charCode || e.keyCode || 0, fail = false;
	// allow Backspace, Tab, Delete, Enter, Home, End and Arrow buttons
	if (key === 8 || key === 9 || key === 46 || key === 13 || key === 35 || key === 36 || (key >= 37 && key <= 40)) {
		fail = false;
	} else if (!(e.shiftKey) && (key >= 48 && key <= 57)) {
		fail = false; // Allow only 0-9 without shift key pressed
	} else if ((key >= 96 && key <= 105)) {
		fail = false; // Allow 0-9 from Keypad
	} else if ((key >= 65 && key <= 90)) {
		fail = false; // Allow Alpabets, including Shift key
	} else { fail = true; }
	if (fail) { e.preventDefault(); }
};

/**
Helper function that sets up standard text fields and the current form.

@function m.initTextField
@param {string} elemId The form field to set up.
@returns {object} curField The returned set-up field.
*/
m.initTextField = function (elemId) {
	// do some standard housekeeping
	m.setCurrentForm();
	m.setCurrentTextField(elemId);
	var curField = m.getCurrentTextField();
	m.setDefaultFocus(elemId);
	return curField;
};

/**
Returns a reference to currentTextField.

@function m.getCurrentTextField
@returns {object} curField The current active text field.
*/
m.getCurrentTextField = function () {
	if (!m.currentTextField) { m.setCurrentTextField(); }
	return m.currentTextField;
};
/**
Sets m.currentTextField to an optional passed input object, or to the currently visible pagefrag text input

@function m.setCurrentTextField
@param {object} [textField] The text field to activate.
*/
m.setCurrentTextField = function (textField) {
	m.currentTextField = textField ? $(['#', textField].join('')) : $('.pagefrag:visible input:text');
};

/**
Sets m.currentForm to an optional passed input object, or to the currently visible pagefrag text input

@function m.getCurrentForm
@returns {object} m.currentForm The currently active form.
*/
m.getCurrentForm = function () {
	if (typeof m.currentForm !== 'object') { m.setCurrentForm(); }
	return m.currentForm;
};
/**
Sets m.currentForm to an optional passed form object, or to the currently visible pagefrag form

@function m.setCurrentForm
@param {object} [form] The form field to activate.
*/
m.setCurrentForm = function (form) {
	//m.currentForm = form ? $(form) : $('.pagefrag:visible form');
	m.currentForm = form ? $(form) : $('#' + m.curApp.curPage + ' form'); // requires all forms to have a specialized ID based on pagefrag name.
};
/**
Submits m.currentForm.

@function m.submitCurrentForm
*/
m.submitCurrentForm = function () {
	return m.curFormSubmit(m.getCurrentForm());
};


/**
Applies the scanner object's data to the currently focused form element

@function m.setScanData
@param {string} data The data from the scanner.
*/
m.setScanData = function (data) {
	m.getCurrentTextField().val(data);
};

/**
Gives the current text field focus.

@function m.setDefaultFocus
@param {object} [elemId] The data from the scanner, a jQuery object.
*/
m.setDefaultFocus = function (elemId) {
	if (typeof elemId != 'undefined') {
		m.setCurrentTextField(elemId);
	}
	m.getCurrentTextField().focus();
};

/**
Saves the current app's state and switches to toApp. Creates toApp if it isn't already.

@function m.loadAppFromServer
@param {string} toAppData The data passed back from the AJAX JSON call.
*/
m.loadAppFromServer = function (toAppData) {
	//u.getMSecsData();
	u.setMSecs();
	var tatimer = u.setMSecsTimer(), appName = toAppData.config.appLabel;
	// load the next app's state from the server
	if (typeof m.apps[appName].init === 'function') { // there is already a next app created! Don't create it, just toggle
		m.curApp.toggleIn(toAppData);
	} else { // the toApp doesn't exist yet, create it and initialize it.
		m.apps[appName] = m.createApp(toAppData);
	}
	// we're using curToggleURLs. Clean up the existing appstack, as we're loading each app from the server.
	if (m.prevApp) { 
		delete m.prevApp.appStack;
	}
	// activate the current app. The init() or toggleIn() function of the app will activate that app's first page, so flow switches to the app's .js file.
	$('.appfrag.active').removeClass('active');
	$(['#', appName].join('')).addClass('active');
	u.getMSecsTimer(tatimer, ['m.loadAppFromServer ', appName, ' end'].join(''));
};

/**
Shows or hides the main app buttons based on config booleans like config.showHome and config.showToggle. If config does not exist, it will hide them.

@function m.showAppButtons
@param {object} [config] The data.config returned from the JSON call.
@config {boolean} [showKeyboard]
@config {boolean} [homeURL] This is the URL that is called when the user clicks on the 'home' app button. If missing, the button doesn't show.
@config {boolean} [toggleURL] This is the URL that is called when the user clicks on the 'toggle' app button. If missing, the button doesn't show.
@config {boolean} [leftURL] This is the URL that is called when the user clicks on the 'toggle' app button. If missing, the button uses the client's memory.
@config {string} [appLabel] This is the app's name, which is not internationalized.
@config {string} [line_1] The first small line on the top left in the header
@config {string} [line_2] The second small line on the top left in the header
@config {string} [line_3] The third small line on the top left in the header
@config {string} [line_2_right] The second small line on the top right in the header
@config {string} [fill_group] The line that sometimes shows beneath a text field.
*/
m.showAppButtons = function (config, strings) {
	//var tmr = u.setMSecsTimer('m.showAppButtons start');
	if (config) {
		if (typeof config.beepCount === 'number') {
			u.beepCount = config.beepCount;
		}
		if (config.showKeyboard) { $('.btn_keyboard').show(); } else { $('.btn_keyboard').hide(); }
		// set up the server-defined URLs
		if (typeof config.homeURL === 'string') {
			$('.btn_home').show().attr("rel", config.homeURL);
		} else {
			delete m.curApp.homeURL;
			$('.btn_home').hide().removeAttr("rel");
		}
		if (typeof config.toggleURL === 'string') {
			m.curApp.curToggleURL = config.toggleURL;
			$('.btn_toggle').show().attr("rel", config.toggleURL);
		} else {
			delete m.curApp.toggleURL;
			$('.btn_toggle').hide().removeAttr("rel");
		}
		if (typeof config.backURL === 'string') {
			m.curApp.backURL = config.backURL;
			$('.btn_left').attr("rel", config.backURL).show();
		} else {
			delete m.curApp.backURL;
			$('.btn_left').removeAttr("rel").hide();
		}
		// populate the content fields
		if (strings != null) { 
			if (strings.appName != null) {
				$('#appLabel').html(strings.appName).show();
			} else {
				$('#appLabel').hide();
			} 
		} else {
			$('#appLabel').hide();
		}
		if (config.line_1 != null) { $('#header_line_1').html(config.line_1).show(); } else { $('#header_line_1').hide(); }
		if (config.line_1_right != null) { $('#header_line_1_right').html(config.line_1_right).show(); } else { $('#header_line_1_right').hide(); }
		if (config.line_2 != null) { $('#header_line_2').html(config.line_2).show(); } else { $('#header_line_2').hide(); }
		if (config.line_3 != null) { $('#header_line_3').html(config.line_3).show(); } else { $('#header_line_3').hide(); }
		if (config.line_2_right != null) { $('#header_line_2_right').html(config.line_2_right).show(); } else { $('#header_line_2_right').hide(); }
		if (config.fill_group != null) { $('.fill_group').html(config.fill_group).show(); } else { $('.fill_group').hide(); }
	} else { // there should always be a config! but if not, hide everything.
		$('.btn_home, .btn_toggle, #appLabel, .btn_keyboard').hide();
		// populate the content fields and fill group
		//$('#appLabel').html("");
		$('#appLabel').html("");
		$('#header_line_1').html("");
		$('#header_line_2').html("");
		$('#header_line_3').html("");
		$('#header_line_1_right').html("");
		$('#header_line_2_right').html("");
		$('.fill_group').html("");
	}
	if ($('#content_head').height() <= 1) {
		$('#content_head').css({'border-bottom': '0px'});
	} else {
		$('#content_head').css({'border-bottom': '1px solid #CE0000'});
	}
};

/**
Creates a grid table in the div using the data.header[] and data.data[] arrays.

@function m.createGridTable
@param {object} div The div in which to place the .GridView
@param {object} data The data with which to populate the .GridView
@param {number} numRows The number of rows to show before pagination occurs
*/
m.createGridTable = function (div, data, numRows) {
	if (typeof data.locationMessage === 'string') {
		div.html(data.locationMessage);
	} else {
		//var tmr = u.setMSecsTimer('m.createGridTable start');
		// set up pagination (only applies to this page!)
		data.gridTable.tableheight = data.gridTable.data.length;
		data.gridTable.numpagesshowing = numRows || 3;
		data.gridTable.numpages = Math.ceil(data.gridTable.tableheight / data.gridTable.numpagesshowing);
		data.gridTable.page = 0;
		if ($('.GridView', div).length == 0) { // if we've already processed this grid, don't process it again!
			// first, copy the tableDataGridView code fragment into the page
			div.html($('#codeFragments #tableDataGridView').html());
			//var divName = div.closest('.pagefrag').attr('id');
			if (data.gridTable.tableTitle) {
				$('.tableTitle', div).html(data.gridTable.tableTitle).show();
			} else {
				$('.tableTitle', div).hide();
			}
			if (data.gridTable != null) {
				// load in the header strings 
				var table_headers = [], len = 0, table_data = [], show = data.gridTable.numpagesshowing, i, j, d;
				for (i in data.gridTable.data[0]) if (data.gridTable.data[0].hasOwnProperty(i)) len++;
				for (i in data.gridTable.data[0]) {
					table_headers.push(["<th scope='col'>", i, "</th>"].join(''));
				}
				$("thead tr", div).html(table_headers.join(""));
				// now load in the table data itself
				for (i = 0; i < show; i++) {
					table_data.push("<tr></tr>");
				}
				$("tbody", div).html(table_data.join(""));
				// check to see if we need pagination
				if (data.gridTable.tableheight > show + 1) {
					div.append('<div class="gridFooter"></div>');
					m.appendPaginationButtons();
				}
				m.gridViewPage(0);
			} else {
				div.html(data.locationMessage);
			}
		} else {
			// just show app nav buttons if they exist, and set the page to the first page
			if (data.gridTable.tableheight > data.gridTable.numpagesshowing + 1) { m.appendPaginationButtons(); }
			data.gridTable.page = 0;
			m.gridViewPage(0);
		}
	}
};

/**
Adds pagination buttons for grid pages

@function m.appendPaginationButtons
*/
m.appendPaginationButtons = function () {
	// TODO: check if device has arrow keys
	$('#AppNavBar #navBtns').append('<a class="btn btn_up"></a><a class="btn btn_down"></a>');
};

/**
Click handler for .GridView

@function m.onPageUp
*/
m.onPageUp = function () {
	m.gridViewPage(-1);
};

/**
Click handler for .GridView

@function m.onPageDown
*/
m.onPageDown = function () {
	m.gridViewPage(1);
};

m.addToInputField = function (val) {
	m.getCurrentTextField().val(val);
	m.setDefaultFocus();
}

/**
Click handler for .GridView. Where dir is 1 it shows the next page, where dir is -1 it shows the previous page.

@function m.gridViewPage
@param {number} dir The direction of pagination; -1 for up, 1 for down.
*/
m.gridViewPage = function (dir) {
	var gvp = u.setMSecsTimer()
	u.setMSecs();
	var data = m.curApp.appStack.pageData[m.curApp.appStack.pageData.length - 1].gridTable, curGrid = $(['#', m.curApp.curPage, ' .GridView'].join('')), firstpos, count, fsp, i, field;
	if ((dir == 1 && data.page + 1 < data.numpages) || (dir == -1 && data.page > 0) || dir == 0) {
		if (dir != 0) { // this means we're not resetting the grid view to the first page
			data.page += dir;
		} else {
			data.page = 0;
		}
		firstpos = data.page * data.numpagesshowing;
		count = 0;
		fsp = firstpos + data.numpagesshowing;
		// write the data into the table td's
		for (i = firstpos; i < fsp; i++) {
			var str = '';
			var d = data.data[i];
			for (field in d) {
				var addrel = '';
				if (field === 'Location') addrel = ' style="cursor: pointer;" onclick="m.addToInputField(\''+d[field].replace(/ /g, '')+'\')"';
				str = [str, '<td', addrel, '>', d[field], '</td>'].join('');
			}
			$($('tr', curGrid)[++count]).html(str);
		}
	}
	// write out the pagination line ('1 of 5')
	$(".gridFooter", $(['#', m.curApp.curPage].join(''))).html([m.curApp.strings.page, ' ', data.page + 1, ' ', m.curApp.strings.of, ' ', data.numpages].join(""));
	m.getCurrentTextField().focus();
	u.getMSecs();
	u.getMSecsTimer(gvp, 'm.gridViewPage end')
};

/**
Click handler for ".listTable .GridView a" links. These links must have a 'rel' attribute that contains the URL to pass.

@function m.gridViewClick
@param {number} dir The direction of pagination; -1 for up, 1 for down.
*/
m.gridViewClick = function () {
	m.curApp[[m.curApp.curPage, '_submit'].join('')]($(this).attr('rel'));
};

/**
Creates a text field from the component div using the field name for the label

@function m.createTextField
@param {object} div The div in which to place the text field.
@param {object} data The data with which to populate the text field.
@config {string} fieldLabel The label for the text field for internationalization.
@config {string} fieldID The ID for the text field.
*/
m.createTextField = function (div, data) {
	if ($('.TextBox', div).length == 0) { // only create it if it doesn't yet exist
		div.html($('#textBoxComponent').html());
		$('.loc', div).html(data.fieldLabel);
		$('.TextBox', div).attr('id', data.fieldID).attr('name', data.fieldID);
	}
};

/**
Creates a text field from the component div using the field name for the label and sets up the increase/decrease buttons

@function m.createQuantityField
@param {object} div The div in which to place the text field.
@param {object} data The data with which to populate the text field.
@config {string} fieldLabel The label for the text field for internationalization.
@config {string} fieldID The ID for the text field.
*/
m.createQuantityField = function (div, data) {
	if ($('.EnterQtyTextBox', div).length == 0) { // only create it if it doesn't yet exist
		// load the qtyComponent code fragment:
		div.html($('#qtyComponent').html());
		$('.qty_label', div).html(data.fieldLabel);
		$('.EnterQtyTextBox', div).attr('id', data.fieldID).attr('name', data.fieldID);
	}
};

/**
Quantity field button click action

@function m.qtyAdd
*/
m.qtyAdd = function () {
	var curTxtField = m.getCurrentTextField(), quantity = curTxtField.val();
	if (quantity == undefined || quantity == '') {
		quantity = 1;
	} else {
		if (quantity >= 0 && quantity < 999) {
			quantity++;
		}
	}
	curTxtField.val(quantity);
	curTxtField.focus();
};
/**
Quantity field button click action

@function m.qtySubtract
*/
m.qtySubtract = function () {
	var curTxtField = m.getCurrentTextField(), quantity = curTxtField.val();
	if (quantity > 1 && quantity <= 999) {
		quantity--;
	}
	curTxtField.val(quantity);
	curTxtField.focus();
};



m.apps = {}; // to store the namespace for our app prototype objects.

/**
Prototype function for apps. appName must equal an app name (Backstock, Pull, etc.) appProto contains all of the common properties and methods for each app object.
@class appProto
*/
var appProto = {
	/**
	This is the memory stack of the application, storing a linked array of {string} page names and {object} page data
	
	@public appProto.appStack
	@param {string} curPage Stores the linked array of page names
	@param {object} pageData Stores the linked array of page data from the JSON calls
	*/
	appStack: {
		pageName: [],
		pageData: []
	},
	/**  Stores all of the internationalization strings from the JSON object */
	strings: {},
	/**
	Initialize the app for the first time: load HTML fragment if it doesn't exist.
	
	@function appProto.preinit
	@param {object} toAppData The data that was passed back from the JSON call. This data will set up the application. At a minimum, the data object must contain the following objects: success, strings, config. The strings object contains all the internationalization strings, and the config object contains all the things that will be set up in m.showAppButtons(config).
	*/
	preinit: function (toAppData) {
		// set the global m.curApp to this app, since we're loading it now
		m.curApp = this;
		m.curApp.toAppData = toAppData;
		// load app html fragment just once if it doesn't already exist.
		// there must be an HTML fragment somewhere that has id=appName class=appfrag.
		if ($(['#', this.appName].join('')).length == 0) {
			this.getHTML(); // this will call getData after it returns.
		} else {
			m.curApp.init();
		}
		delete this.getHTML; // don't leave this lying around.
		delete this.preinit; // don't leave this lying around.
	},
	/**
	Continue initializing the app; populate the overal app stuff with data when it's returned.
	
	@function appProto.init
	*/
	init : function () {
		var data = m.curApp.toAppData;
		$('#appLabel').html(data.strings.appName);
		m.curApp.strings = data.strings; // store all the internationalization strings for possible later use
		// initialize the app data; internationalization, and loading the first page.		
		$('.infoBox .btnEnterQty').val(data.strings.close); // set the 'close' button text
		$('.btnNext').val(data.strings.next); // set the 'exit' button text
		$('.btnExit').val(data.strings.exit); // set the 'exit' button text
		m.curApp.curPage = data.page;
		if (typeof data.curPage != 'undefined') {
			m.curApp.appStack.pageName = data.curPage; // restore the app's page memory stack
			m.curApp.appStack.pageData = data.pageDataLoad; // restore the app's data memory stack
			// now load from the top of the returned stack
			m.loadPage(m.curApp.appStack.pageName[m.curApp.appStack.pageName.length - 1], m.curApp.appStack.pageData[m.curApp.appStack.pageData.length - 1]);
		} else {
			m.curApp.loadPage(m.curApp.curPage, data); // load the returned page
		}
		delete m.curApp.toAppData; // don't leave this lying around!
	},
	/**
	get the HTML stub for this application, called from init() ony if the HTML fragment does not already exist.
	
	@function appProto.getHTML
	*/
	getHTML: function () {
		m.ajax({
			url: [u.baseURL, "/app_html/", this.appName, ".html"].join(''),
			cache: false,
			dataType: "html",
			type: "GET",
			async: false,
			success: function (data) {
				u.getMSecsData();
				$('#maindiv .mainPageHeader').append(data);
				m.curApp.init();
			},
			error: m.ajaxError
		});
	},
	/**
	Reset the app to the first page; cached to optimize the page and reduce network transactions. Also deletes app stack
	
	@function appProto.resetApp
	*/
	resetApp: function () {
		// like init, only resets to the first page and erases the existing app stack.
		var curP = m.curApp.appStack.pageName[0], curD = m.curApp.appStack.pageData[0];
		delete m.curApp.appStack;
		m.curApp.loadPage(curP, curD); // load the first page
	},
	/**
	This is called with an DOM object's ID attribute string and a JSON object. This calls the main m.loadPage.
	The primary purpose of this function is to set up the app's array memory stack for the back button.
	
	@function appProto.loadPage
	@param {string} objId The page name of the page to load, passed by the JSON return function
	@param {object} dataToPass Stores the data returned by the ajax transaction
	*/
	loadPage: function (objId, dataToPass) {
		var tmr = u.setMSecsTimer();
		if (!this.appStack) {
			this.appStack = {};
			this.appStack.pageName = [];
			this.appStack.pageData = [];
		}
		this.appStack.pageName.push(objId); // store the curPage ID string for later ('BCK001', e.g.)
		this.appStack.pageData.push(dataToPass); // store the JSON data for later (can be empty)
		m.loadPage(objId, dataToPass); // now load the main applications loadPage function, pass through the received arguments
		u.getMSecsTimer(tmr, ['appProto.loadPage ', objId, ' end'].join(''));
		$('#timeTimer').append('-------------------------------<br><br>');
		u.getMSecs();
	},
	/**
	This is called from the main application, usually from the 'back' button.
	Its main purpose is to reset the app from the array stack to the previous page by popping out the current page,
	then popping the previous page and passing it back to loadPage.
	
	@function appProto.loadPreviousPage
	*/
	loadPreviousPage: function () {
		var tmr = u.setMSecsTimer()
		name_a = m.curApp.appStack.pageName;
		data_a = m.curApp.appStack.pageData;
		u.setMSecs();
		name_a.pop();
		data_a.pop();
		// load the previous page's data
		m.curApp.loadPage(name_a.pop(), data_a.pop());
		u.getMSecsTimer(tmr, 'appProto.loadPreviousPage end');
	},
	/**
	The function that the master app calls when this app starts up again.
	This function is responsible for setting up the page and loading in the previous data.
	This can be set to keep the memory stack in live memory, or load it in from the server via ajax.
	
	@function appProto.toggleIn
	@param {string} [data] If data exists, load app (and/or page) directly from it. Otherwise, just load m.curApp's memory stack.
	*/
	toggleIn: function (data) {
		// IF LOADING FROM A TOGGLEOUT SERVER CALL DIRECTLY:
		if (typeof data !== 'undefined') { // there is data
			m.curApp = m.apps[data.config.appLabel];
			m.curApp.toAppData = data;
			m.curApp.init();
		} else { // there is no data or data is just an app name -- load from memory
			//m.curApp = m.apps[data];
			// IF LOADING FROM BROWSER MEMORY, just load the top of the app stack directly:
			m.loadPage(m.curApp.appStack.pageName[m.curApp.appStack.pageName.length - 1], m.curApp.appStack.pageData[m.curApp.appStack.pageData.length - 1]);
		}
	},
	/**
	Save the current running state of the app to the server
	
	@function appProto.toggleOut
	@param {string} toAppName the appName of the app we're going to load next
	@param {string} [toAppURL] the passed-in config URL. NOTE: Current showAppButtons won't show a button without this URL, so we shouldn't ever hit the default else case as toAppURL will theoretically always be defined. But if it's not, we do something sane.
	*/
	toggleOut: function (toAppName, toAppURL) {
		if (typeof toAppName !== 'string') {
			m.popError("Fatal error in appProto.toggleOut: The programmers didn't say which app we're headed for!", 'error');
		} else {
			if (typeof toAppURL !== 'undefined') { // save state to server
				m.prevApp = m.curApp.appName; // we'll use this to destroy the old app's memory stack.
				u.setMSecsData();
				m.ajax({
					url: toAppURL, 
					data: JSON.stringify(m.curApp.appStack),
					cache: false,
					async: false,
					success: m.loadAppFromServer,
					error: m.ajaxError
				});
			} else { // if we're not saving state to the server, toggleOut should just call the next app's toggleIn().
				var tmr = u.setMSecsTimer();
				u.setMSecs();
				m.curApp = m.apps[toAppName];
				m.curApp.toggleIn();
				u.getMSecs();
				u.getMSecsTimer(tmr, 'appProto.toggleOut end');
			}
		}
	}
};

/**
Creates and initializes the app (from m.loadAppFromServer()). appName must equal a app name (Backstock, Pull, etc.)
Uses the .extend function to combine the existing custom app functions and/or variables with the common app ones.

@function m.createApp
*/
m.createApp = function (toAppData) {
	var app = toAppData.config.appLabel;
	var tmp = $.extend(true, m.apps[app], appProto);
	tmp.appName = app;
	tmp.preinit(toAppData);
	return tmp;
};

/**
Click handler for the Home button at the top of the screen

@function m.returnToHome
@param {object} e The click event
*/
m.returnToHome = function (e) {
	e.preventDefault();
	u.setMSecs();
	var rel = $(e.currentTarget).attr("rel");
	if (typeof rel === 'string') { // the server has requested a specific back button URL.
		//m.curApp.appStack = null;
		//m.ajax({'url': rel, success: m.loadAppFromServer});
		m.curApp.toggleOut('Home', rel);
	} else {
		// the default sanity check: just toggle to the 'Home' app.
		m.curApp.toggleOut('Home');
	}
};


$(document).ready(function () {
	u.getMSecsTimer(pageload, 'document.ready', true);
	// all app button actions - use 'live' when possible to reduce memory leaks
	$('#GlobalNavBar').on("click", '.btn_toggle, .btn_home', m.returnToHome);
	$('#AppNavBar #navBtns').on("click", '.btn_up', m.onPageUp);
	$('#AppNavBar #navBtns').on("click", '.btn_down', m.onPageDown);
	$(".qty .btn_increase").live("click", m.qtyAdd);
	$(".qty .btn_decrease").live("click", m.qtySubtract);
	$('.listTable .GridView a').live("click", m.gridViewClick);
	$('.infoBox').on("click", '.btnEnterQty', m.hideError);
	$('body').on("click", "#blankErrorId", m.hideError);
	$('#Home form').on("click", '.app_btn', function() {
		u.setMSecsData();
		var rel = $(this).attr('rel');
		$(this).parent('form').find('#txtSource').val($(this).attr('app'));
		m.ajax({'url': rel, 'data': $('#Home form').serialize(), success: m.loadAppFromServer});
	});
	$('#blankErrorId').on("click", "#tmpbutton", function(e) { 
		u.logMsg('do something here');
		return false;
	});
	// start the whole thing by loading the app's main Home page
	//m.ajax({'url': "WebMobile/Home/DisplayScreen", success: m.loadAppFromServer});
	m.ajax({'url': "./ajax/ajax_Home.chtm", success: m.loadAppFromServer});
});
