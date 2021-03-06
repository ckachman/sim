<%@ page contentType="application/json"%>
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
		"line_2":			"${item?.sku}",
		"line_3":			"${item?.description}",
		"fill_group":		"Fill group: Mens",
		"fieldLabel":		"<b>Scan</b>/<b>Key</b> location",
		"fieldID":			"txtLocationScan",
		"formAction":		"../backstock/editItemLocation",
		"formID":			"formBCK002"
	},
		
	"gridTable": {
		"tableTitle":		"",
		"data":	[
		<g:each in="${itemLocations}" var="itemLocation" status="i">
			{"Location":"${itemLocation.location?.locId}","Group":"${itemLocation.location?.state}","Qty":"${itemLocation.quantity}"}<g:if test="${(i + 1) < itemLocations.size()}">,</g:if>
		</g:each>
		]		
	}	
}
