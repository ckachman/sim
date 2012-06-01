<%@ page contentType="application/json"%>
{
	"status":		"success",
	"page":			"BCK004",
	"config": {
		"beepCount":		2,
		"appLabel":			"Backstock",
		"showKeyboard":		true,
		"leftURL":			"ajax/ajax_Home.chtm",
		"homeURL":			"ajax/ajax_Home.chtm",
		"toggleURL":		"ajax/ajax_Home.chtm",
		"line_1":			"",
		"line_2":			"${itemloc?.item?.sku}",
		"line_3":			"${itemloc?.item?.description}",
		"fill_group":		"Mens",
		"location":			"${itemloc?.location?.locId}",
		"fieldLabel":		"Enter quantity",
		"fieldID":			"txtItemQty",
		"formAction":		"../backstock/updateItemLocation",
		"formID":			"formBCK004"
	}
		
	
	
}