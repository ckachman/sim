package tgt

class BackstockController {

	// uri /backstock/itemLocations/${itemSku}
    def itemLocations = {
		println "params: $params"
		
		
		def sku = params.txtItemScan
		def item = new Item(sku:sku, description:"Men's Awesome Plaid Pants")
		
		//TODO - replace this with a real item locations lookup based on item sku
		def itemLocations = []
		
		itemLocations << new ItemLocation(location: new Location(state: 'Open Stock', locId: 'ABC XYZ 123'), quantity: 3)
		itemLocations << new ItemLocation(location: new Location(state: 'Boxed', locId: 'XYZ ABC 321'), quantity: 4)
		itemLocations << new ItemLocation(location: new Location(state: 'Open Stock', locId: 'XYA CBZ 456'), quantity: 5)
		
		[itemLocations: itemLocations, item: item]		
	}
	
	// edit item location
	def editItemLocation = {
		println "params: $params"
		def itemloc = new ItemLocation(location: new Location(locId: params.txtLocationScan), quantity:3, 
				item: new Item(sku:'123123', description:'awesome item', state: 'itemstate'))
		[itemloc: itemloc]
	}
	
	def updateItemLocation = {
		println "params: $params"
		
		def quantity = params.txtItemQty
		
		// update itemlocation quantity
		
		[]

	}
	
}
