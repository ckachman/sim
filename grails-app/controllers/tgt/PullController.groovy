package tgt

class PullController {

	def stub = """
{
	"status":				"success",
	"page":					"PULL002",
	"strings": {
		"appName":			"Pull",
		"page":				"Page",
		"of":				"of",
		"close":			"Close",
		"exit":				"Exit",
		"next":				"Next",
		"enter":			"Enter"
	},
	
	"config": {
		"appLabel":			"Pull",
		"beepCount":		2,
		"showKeyboard":		true,
		"homeURL":			"ajax/ajax_Home.chtm",
		"toggleURL":		"ajax/ajax_Home.chtm"
	},
	
	"gridTable":	{
		"tableTitle":		"<b>Select pull type</b>",
		"data": [
			{"Type":"<a rel='replenishment'>Replenishment</a>", "Lists":"<###>"},
			{"Type":"<a rel='sales_floor_request'>Sales Floor Request</a>", "Lists":"<###>"},
			{"Type":"<a rel='reverse_logistics'>Reverse Logistics</a>", "Lists":"<###>"},
			{"Type":"<a rel='price_change'>Price Change</a>", "Lists":"<###>"},
			{"Type":"<a rel='discontinued'>Discontinued</a>", "Lists":"<###>"},
			{"Type":"<a rel='pull_item'>Pull Item</a>", "Lists":"<###>"}
		]
	}

	
}"""
  
def index() { 
	render stub
	}
}
