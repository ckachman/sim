
/** 
Global utility timer and logging functions. Also scanner set-up.
*/
/*global $:true, u:true, m:true, window:true, document:true, pageload:true, navigator:true, external:true, clearTimeout:true, setTimeout:true, alert:true */

/**
This gets the MAC address and sets the proper CE variables

@function GetMACAddressOfDevice
*/
function GetMACAddressOfDevice() {
	var macAddr = "Unknown", device = document.getElementById("txtDeviceID");
	if (navigator.platform.indexOf("WinCE") >= 0) {
		macAddr = external.CETerm.GetProperty("device.macaddress");
	}
	device.value = macAddr;
}




/**
The utility functions, timer functions, and variables storage class

@class u
*/
var u = {};
/** Used to make ajax calls from various relative roots. May not be necessary anymore. */
u.baseURL = '.';

/** limits page to only one Scan or Enter keypress, used by onkeydown method, injected via Basepage, HandleEnterKey(...) */
u.isSubmitting = false;
u.sipState = false;
u.deviceId = "1";
u.macAddr = "unknown";
u.ipAddr = "2";
u.doPerfLog = false;
u.beepCount = 0;
u.beepTime = 30; // from captured HTML

// MB - Rho
u.loggerURL = "/WebMobile/Common/LogHandler.ashx";

// MB Rho changes
if (navigator.userAgent.indexOf("Windows Phone") >= 0) {
    deviceId = generic.UUID;
    macAddr = "Unknown";
    ipAddr = "Unknown";
}
        
u.timeNow = 0;
u.timeNowData = 0;
u.timer = 0;
u.timerData = 0;

//****************************************
// Logging function
//****************************************
u.logStats = function (logCtx) {
	if (u.doPerfLog) {
		var tickCount = u.initStopwatch(), screenName = window.location.href, url = [u.loggerURL + "?deviceId=", u.deviceId, "&ipAddr=", u.ipAddr, "&macAddr=", u.macAddr, "&screenName=", screenName, "&logCtx=", logCtx, "&tickCount=", tickCount].join('');
		$.get(url);
	}
};


//****************************************
// Logging function
//****************************************
u.timeNowTimer = [];
u.initStopwatch = function () {
	var ticks = 0;
	if (navigator.platform.indexOf("WinCE") >= 0) {
		ticks = (external.OS.TickCount);
	} else {
		ticks = (new Date().getTime());
	}
	return ticks;
};
u.timeNow = u.initStopwatch();

u.setMSecs = function () {
	u.timeNow = u.initStopwatch();
};
u.getMSecs = function () {
	var nowSecs = u.initStopwatch(), curMSecs = nowSecs - u.timeNow, color = '#006633';
	if (curMSecs > 100) { color = '#ff6600'; }
	if (curMSecs > 500) { color = '#cc3300'; }
	if (curMSecs > 1000) { color = '#cc0000'; }
	$('#time').show().css({'color': color});
	$('#time').append([(curMSecs), " msecs | "].join(''));
	clearTimeout(u.timer);
	u.timer = setTimeout(u.clearTimeHtml, 2000);
	return curMSecs;
};
u.clearTimeHtml = function () {
	$('#time').html('');
};

u.setMSecsData = function () {
	u.timeNowData = u.initStopwatch();
};
u.getMSecsData = function () {
	var nowSecs = u.initStopwatch(), curMSecs = nowSecs - u.timeNowData, color = '#006633';
	if (curMSecs > 100) { color = '#ff6600'; }
	if (curMSecs > 500) { color = '#cc3300'; }
	if (curMSecs > 1000) { color = '#cc0000'; }
	$('#timeData').show().css({'opacity': '1', 'color': color});
	$('#timeData').append([(curMSecs), " msecs | "].join(''));
	clearTimeout(u.timerData);
	$('#timeTimer').append(['u.getMSecsData: ajax', ': ', (curMSecs), " msecs<br>"].join(''));
	u.timerData = setTimeout(u.clearTimeDataHtml, 2000);
	return curMSecs;
};
u.clearTimeDataHtml = function () {
	$('#timeData').html('');
};

u.debug = true;
u.setMSecsTimer = function (msg) {
	if (u.debug && $('#timeTimerContainer').length == 0) {
		$('body').append('<div id="timeTimerContainer" style="border: 1px solid black; width: 240px; position: absolute; top: 0px; left: 0px; height: 320px; overflow: auto; z-index: 0; background-color: white;"><div id="timeTimer" style="background-color: white;"></div></div>');
		$('body').append('<div id="timeTImerBtn" style="border: 1px solid black; background-color: black; color: white; width: 10px; position: absolute; top: 150px; left: 230px; height: 15px; z-index: 4; cursor: pointer;">&lt;</div>');
		$('body').on('click', '#timeTImerBtn', function () {
			if ($('#timeTimerContainer').css('z-index') == '0') {
				$('#timeTimerContainer').css('z-index', '3');
				$('#timeTImerBtn').html("&gt;");
				m.setDefaultFocus();
			} else {
				$('#timeTimerContainer').css('z-index', '0');
				$('#timeTImerBtn').html("&lt;");
				m.setDefaultFocus();
			}
		});
	}
	if (typeof msg != 'undefined') { u.logMsg(msg); }
	return u.timeNowTimer.push(u.initStopwatch());
};
u.logMsg = function (msg) {
	$('#timeTimer').append([msg, '<br>'].join(''));
};
u.getMSecsTimer = function (timer, msg, keepRunning) {
	if (u.debug) {
		var nowSecs = u.initStopwatch(), curMSecs = nowSecs - u.timeNowTimer[timer - 1];
		$('#timeTimer').append([msg, ': ', (curMSecs), " msecs<br>"].join(''));
		$('#timeTimerContainer').scrollTop($('#timeTimer').height());
		if (!keepRunning) {u.timeNowTimer[timer - 1] = null; }
		return curMSecs;
	}
};

//****************************************
// On Load Initialization function for logging -- called by m.loadPage
//****************************************
u.OnLoadTimer = function () {
	u.OnLoad();
	if (navigator.platform.indexOf("WinCE") >= 0) {
		u.logStats("END:RENDER");
		//u.getMSecs();
	} else {
		u.logStats("END:RENDER");
		//u.getMSecs()
	}
	return;
};


//****************************************
// Beeps related functions
//****************************************

// base Screen Load event - offers beep functionality
u.baseLoadEvent = function () {
	try {
		// For Beep(s) on Windows CE
		if (navigator.userAgent.indexOf("Windows Phone")>=0) {
			u.beepCounter = 0;
			u.beeper();
		} else {
			u.beeper();
		}
	} catch (e) {
		alert(e.message);
	}
};


u.beeper = function (optNumBeeps) {
	if (navigator.userAgent.indexOf("Windows Phone")>=0) {
        //Bkrm- Added for two-toned beep- Beep issue
		generic.PlayWave('beep.wav', 1);
	} else {
		u.logMsg('BEEEEEEP!')
	}
	
	if (optNumBeeps) {
		optNumBeeps--;
	} else {
		optNumBeeps = --u.beepCount;
	}
	if (optNumBeeps > 0) {
		setTimeout(function () {
			u.beeper (optNumBeeps)
		}, 10);
	}
};

u.onLoadEvent = function () {
	u.baseLoadEvent();
};
//End screen OnLoad event

// Scan Config event
u.baseScanConfigEvent = function () {
	try {
		// First Beep on Windows CE
		if (navigator.userAgent.indexOf("Windows Phone")>=0) 
        	{
          
			var start = new Date().getTime();
            scanner.allDecoders = 'disabled';      /* Enable / Disables all available decoders */

            scanner.upca = 'enabled';      /* Enables/Disables the upca decoder. */
            scanner.upcaReportCheckDigit = 'true';      /* Enables/Disables reporting of the check digit. */
            scanner.upcaReportCheckDigit = 'true';
            scanner.upcapreamble = 'systemChar';

            scanner.upce0 = 'enabled';      /* Enables/Disables the upce0 decoder. */
            scanner.upce0ReportCheckDigit = 'true';
            scanner.upce0preamble = 'systemChar';
            scanner.upce0ConvertToupca = 'false';

            scanner.ean8 = 'enabled';      /* Enables/Disables the ean8 decoder. */
            scanner.ean8ConvertToEAN13 = 'false';

            scanner.ean13 = 'enabled';      /* Enables/Disables the ean13 decoder. */

            scanner.code39 = 'enabled';

            scanner.code39securityLevel = '0';
            scanner.code39reportCheckDigit = 'false';
            scanner.Code39fullascii = 'true';
            scanner.Code39ConvertToCode32 = 'false';
            scanner.Code39code32prefix = 'true';
            scanner.Code39VerifyCheckDigit = 'false';
            scanner.Code39concatenation = 'false';
		
			scanner.decodeEvent = 'doScan(%json)'; 
            scanner.enable();
         //   var stop = new Date().getTime();
       //     var elapsed = stop - start;
//            alert('enableScan takes: ' + elapsed + ' from ' + start + ' to ' + stop);
		}
	} catch (e) {
		alert(e.message);
	}
};

u.onScanConfig = function () {
	u.baseScanConfigEvent();
};

u.OnLoad = function () {
	u.onScanConfig();
	u.onLoadEvent();
};


//****************************************
// Scanning related functions
//****************************************
// Scan Capture event

function enableScanner(enabled) {
    if (navigator.userAgent.indexOf("Windows Phone") >= 0) {
        if (enabled) {
            scanner.enable(); //turn off scanner, user experience, limit to one scan per submit
        } else {
            scanner.disable(); //turn off scanner, user experience, limit to one scan per submit
        }
    } else {
    alert("enableScanner:" + enabled);
    }
}

u.baseScanEvent = function (data) {
	if (!u.isSubmitting) {
		m.setScanData(data);
		u.isSubmitting = true;
		//RhoElement Changes
        //enableScanner(false); //turn off scanner, user experience, limit to one scan per submit
		m.submitCurrentForm();
	}
};

u.onScanEvent = function scanEvent(data) {
	u.baseScanEvent(data);
};

//RhoElement Changes
function doScan(jsonObject) {
//    alert('You scanned: ' + jsonObject.data + '(' + jsonObject.source + '-' + jsonObject.type + ')');
    var inputTypeElem = document.getElementById('txtInputType');
    inputTypeElem.value = 'S';
    var barcodeTypeElem = document.getElementById('txtBarcodeType');//
    barcodeTypeElem.value = jsonObject.type;
    u.onScanEvent(jsonObject.data);
}

// End Scan Capture event


//RhoElement Changes
function simulateScan(barcode) {
//    alert('You scanned: ' + barcode);
    var inputTypeElem = document.getElementById('txtInputType');
    inputTypeElem.value = 'S';
    var barcodeTypeElem = document.getElementById('txtBarcodeType');
    barcodeTypeElem.value = 'na';
    onScanEvent(barcode);
}
// End Scan Capture event



//****************************
// SIP related functions
//****************************


function sip_hide() {
    // RhoElement changes
    if (navigator.userAgent.indexOf("Windows Phone") >= 0) {
        nosip.ShowSIP(false);
    } else {
    alert("sip_hide");
    }
}

function sip_show() {
    // RhoElement changes
    if (navigator.userAgent.indexOf("Windows Phone")>=0) {
        nosip.ShowSIP(true);
        return false;
    } else {
        alert("sip_show");
    }
return false;
}

function sip_toggle() {
    if (navigator.userAgent.indexOf("Windows Phone") >= 0) {
        if (sipState == false) {
            nosip.ShowSIP(true);
            sipState = true;
            return false;
        }
        else {
            nosip.ShowSIP(false);
            sipState = false;
        }
    } else {
        sipState = !sipState;
        alert("sip_toggle: " + sipState);
    }
}


