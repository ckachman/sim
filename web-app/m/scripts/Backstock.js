/**
BACKSKTOCK MOBILE APP
Any function named the same as a pagefrag ID will get called automatically after that pagefrag html 
loads (and is visible). The forms should call the specific submit handler. The <name>_success function 
will automatically be called if it exists, otherwise the generic page loader will run on success.
If the <name>_submit() function does not exist, the form will be submitted normally to the 'action' attribute
of the form. Mostly we'll use return m.doAjaxFormSubmit(form) to do ajax form submits in-page.

@class Backstock
@augments appProto
*/
/*global $:true, u:true, m:true, window:true, document:true, pageload:true, m.apps:true */

m.apps.Backstock = {
	// BCK001 - Backstock_DisplayScanItem.html
	BCK001: function (data) {
		// load the textBoxComponent code fragment; data.fieldLabel provides the label's text.
		m.createTextField($('#BCK001 .contentHeader'), data.config);
		// set up the current text field (set focus, set it as current, etc.)
		var curField = m.initTextField(data.config.fieldID);
		curField.val('');
		m.forceNumericOnly(curField);
	},
	BCK001_submit: function (form) {
		u.setMSecs();
		if (!m.validateForm(form)) { // returns true if the input field is not empty, false if it is empty
			m.popError('Please enter a value.', 'error');
			return false; // ditch before sending the ajax call because the field is empty.
		}
		return m.doAjaxFormSubmit(form);
	},
	// BCK002 - Backstock_ProcessScanItem.html
	BCK002: function (data) {
		// load the textBoxComponent code fragment:
		m.createTextField($('#BCK002 .contentHeader'), data.config);
		var curField = m.initTextField(data.config.fieldID);
		curField.val('');
		// create grid table
		m.createGridTable($('#BCK002 .locationGrid'), data);
	},
	BCK002_submit: function (form) {
		u.setMSecs();
		if (!m.validateForm(form)) { // returns true if the input field is not empty, false if it is empty
			m.popError('Please enter a value.', 'error');
			return false; // ditch before sending the ajax call because the field is empty.
		}
		return m.doAjaxFormSubmit(form);
	},
	// BCK004 - Backstock_ProcessScanLocation.html
	BCK004: function (data) {
		// create the text entry component; data.fieldLabel supplies the 'Enter Quantity' text
		m.createQuantityField($('#BCK004 .qty'), data.config);
		var curField = m.initTextField(data.config.fieldID);
		curField.val('');
		m.forceNumericOnly(curField);
		// update the custom page text
		$('#BCK004 .loc').html(data.config.location);
		$('#BCK004 #location').val(data.config.location.replace(/ /g, ''));
		$('#BCK004 .btnEnterQty').val(this.strings.enter);
	},
	BCK004_submit: function (form) {
		u.setMSecs();
		if (!m.validateForm(form)) { // returns true if the input field is not empty, false if it is empty
			m.popError('Please enter a value.', 'error');
			return false; // ditch before sending the ajax call because the field is empty.
		}
		return m.doAjaxFormSubmit(form);
	}
};




