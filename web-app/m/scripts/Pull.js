/**
PULL MOBILE APP
Any function named the same as a pagefrag ID will get called automatically after that pagefrag html 
loads (and is visible). You can also pass in a custom function name by adding a 'loadFunction' 
attribute to the pagefrag div itself (<div ... loadFunction="customFunction"></div>)
Each pagefrag is responsible for itself and for calling the next one.

@class Pull
@augments appProto
*/
/*global $:true, u:true, m:true, window:true, document:true, pageload:true, m.apps:true */

m.apps.Pull = {
	PULL002: function (data) {
		// parse table data
		m.createGridTable($('#PULL002 .locationGrid'), data, 6);
	},
	PULL002_submit: function () {
		u.setMSecs();
		return m.doAjaxFormSubmit();
	},
	PULL003: function (data) {
		// parse table data
		m.createGridTable($('#PULL003 .locationGrid'), data, 4);
		m.curApp.pull003IsLoaded = true;
	},
	PULL003_click: function () {
		m.curApp.PULL003_submit($(this).attr('rel'));
	},
	PULL003_submit: function () {
		u.setMSecs();
		return m.doAjaxFormSubmit();
	},
	PULL004: function (data) {
		m.createTextField($('#PULL004 .contentHeader'), data.config);
		var curField = m.initTextField(data.config.fieldID);
		curField.val('');
		if (!m.curApp.pull004IsLoaded) {
			$('#PULL004 .btnNext').click(m.curApp.PULL004_submit);
			m.curApp.pull004IsLoaded = true;
		}
	},
	PULL004_submit: function () {
		u.setMSecs();
		return m.doAjaxFormSubmit('form_PULL004');
	},
	PULL005: function (data) {
		m.createTextField($('#PULL005 .contentHeader'), data.config);
		var curField = m.initTextField(data.config.fieldID);
		curField.val('');
		if (!m.curApp.pull005IsLoaded) {
			$('#PULL005 .btnNext').click(m.curApp.PULL005_submit);
			m.curApp.pull005IsLoaded = true;
		}
	},
	PULL005_submit: function () {
		u.setMSecs();
		return m.doAjaxFormSubmit('form_PULL005');
	},
	// PULL006 
	PULL006: function (data) {
		// create the text entry component; data.fieldLabel supplies the 'Enter Quantity' text
		m.createQuantityField($('#PULL006 .qty'), data.config);
		var curField = m.initTextField(data.config.fieldID);
		curField.val('');
		m.forceNumericOnly(curField);
		// update the custom page text
		$('#PULL006 .loc').html(data.config.location);
		$('#PULL006 .btnEnterQty').val(this.strings.enter);
		// update the hidden fields
		$('#PULL006 #location').val(data.config.location);
	},
	PULL006_submit: function (form) {
		u.setMSecs();
		return m.doAjaxFormSubmit(form);
	}
};

