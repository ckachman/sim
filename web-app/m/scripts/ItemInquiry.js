/**
INQ MOBILE APP
Any function named the same as a pagefrag ID will get called automatically after that pagefrag html 
loads (and is visible). You can also pass in a custom function name by adding a 'loadFunction' 
attribute to the pagefrag div itself (<div ... loadFunction="customFunction"></div>)
Each pagefrag is responsible for itself and for calling the next one.

@class INQ
@augments appProto
*/
/*global $:true, u:true, m:true, window:true, document:true, pageload:true, m.apps:true */

m.apps.ItemInquiry = {
	INQ001: function (data) {
		// load the textBoxComponent code fragment; data.fieldLabel provides the label's text.
		m.createTextField($('#INQ001 .contentHeader'), data.config);
		// set up the current text field (set focus, set it as current, etc.)
		var curField = m.initTextField(data.config.fieldID);
		curField.val('');
		m.forceNumericOnly(curField);
	},
	INQ001_submit: function (form) {
		u.setMSecs();
		if (!m.validateForm(form)) { // returns true if the input field is not empty, false if it is empty
			m.popError('Please enter a value.', 'error');
			return false; // ditch before sending the ajax call because the field is empty.
		}
		return m.doAjaxFormSubmit(form);
	},
	INQ002: function (data) {
		if (typeof this.INQ002_loaded === 'undefined') {
			this.INQ002_loaded = true;
			$('#INQ002 #salesFloorLocs').live("click", function() {
				$('#INQ002 form').attr('action', data.config.salesFloorAction);
				m.doAjaxFormSubmit($('#INQ002 form'))
			});
			$('#INQ002 #backroomLocs').live("click", function() {
				$('#INQ002 form').attr('action', data.config.backroomAction);
				m.doAjaxFormSubmit($('#INQ002 form'))
			});
			$('#INQ002 #reverseLogistics').live("click", function() {
				$('#INQ002 form').attr('action', data.config.reverseLogisticsAction);
				m.doAjaxFormSubmit($('#INQ002 form'))
			});
		}
		
		$('#INQ002 .contentHeader').html(data.config.header);
		
		$('#INQ002 #salesFloorLocs').val(data.config.salesFloorLocs);
		$('#INQ002 #salesFloorLocsData .value').html(data.config.salesFloorQty);
		$('#INQ002 #salesFloorLocsData .label').html(data.config.salesFloorLocation);
		
		$('#INQ002 #backroomLocs').val(data.config.backroomLocs);
		$('#INQ002 #backroomLocsData .value').html(data.config.backroomQty);
		$('#INQ002 #backroomLocsData .label').html(data.config.backroomLocation);
		
		$('#INQ002 #reverseLogistics').val(data.config.reverseLogistics);
		
		
	},
	INQ003: function (data) {
		m.createGridTable($('#INQ003 .locationGrid'), data, 8);
	},
	INQ004: function (data) {
		m.createGridTable($('#INQ004 .locationGrid'), data, 8);
	},
	INQ005: function (data) {
		$('#INQ005 .content .tableHeader').html(data.config.tableHeader);
		$('#INQ005 .content .tableContent').html(data.config.tableContent);
	}
};

