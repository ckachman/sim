package tgt

class BackstockController {
	
	def stub = """
{
	"status":				"success",
	"page":					"BCK001",		
	
	"config": {
		"beepCount":		2,
		"homeURL":			"ajax/ajax_Home.chtm",
		"toggleURL":		"ajax/ajax_Home.chtm",
		"showKeyboard":		true,
		"fieldLabel":		"<b>Scan</b>/<b>Key</b> item barcode",
		"fieldID":			"txtItemScan",
		"formID":			"formBCK001",
		"formAction":		"ajax/ajax_BCK001.chtm",
		"appLabel":			"Backstock",
		"line_1":			"",
		"line_2":			"",
		"line_3":			"",
		"line_3_right":		""
	},
		
	
	"strings": {
		"appName":			"Backstock",
		"page":				"Page",
		"of":				"of",
		"close":			"Close",
		"enter":			"Enter"
	}
	
}"""

    def index() {
		render stub
	}
	
}
