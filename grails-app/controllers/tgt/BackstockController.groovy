package tgt

class BackstockController {
	
	def stub = """
{
	"status":		"success",
	"page":			"BCK002",
	"config": {
		"beepCount":		2,
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
		"formAction":		"ajax/ajax_BCK002.chtm",
		"formID":			"formBCK002"
	},
		
	"gridTable": {
		"tableTitle":		"",
		"data":	[
			{"Location":"01A 001G02","Group":"Open Stock","Qty":"3"},
			{"Location":"01A 001G03","Group":"Open Stock","Qty":"13"},
			{"Location":"01A 001G04","Group":"Open Stock","Qty":"10"},
			{"Location":"01A 001G05","Group":"Open Stock","Qty":"2"},
			{"Location":"01A 001G06","Group":"Open Stock","Qty":"4"}
		]
	}	
}"""


	// uri /backstock/itemLocations/${itemSku}
    def itemLocations = {
		log.debug "params: $params"
		
		//find item locations in the back room
		response.contentType = "application/json"
		render stub
	}

}
