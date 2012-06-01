package tgt

class BackstockController {

	// uri /backstock/itemLocations/${itemSku}
    def itemLocations = {
		println "params: $params"
		
		
		def sku = params.txtItemScan
		sku = sku ?: params.id
		println "sku: $sku"
		def item = Item.findBySku(sku)
		
		//def item = new Item(sku:sku, description:"Men's Awesome Plaid Pants")
		
		//TODO - replace this with a real item locations lookup based on item sku
//		def itemLocations = []
//		
//		itemLocations << new ItemLocation(location: new Location(state: 'Open Stock', locId: 'ABC XYZ 123'), quantity: 3)
//		itemLocations << new ItemLocation(location: new Location(state: 'Boxed', locId: 'XYZ ABC 321'), quantity: 4)
//		itemLocations << new ItemLocation(location: new Location(state: 'Open Stock', locId: 'XYA CBZ 456'), quantity: 5)
		
		session.item = item
		
		[itemLocations: item.itemLocations, item: item]		
	}
	
	// edit item location
	def editItemLocation = {
		println "params: $params"
		
		def locId = params.txtLocationScan
		def item = session.item
		def location = Location.findByLocId(locId)
		
		def itemloc = new ItemLocation(location:location, quantity:0, item:item)
		
		println "loc id: $locId"
		println "item: $item"
		println "location: $location"
		println "item loc: $itemloc"
		
		session.location = location
		
		[itemloc: itemloc]
	}
	
	def updateItemLocation = {
		println "params: $params"
		
		def quantity = params.txtItemQty ? params.int('txtItemQty') : 0
		def location = session.location
		def item = session.item
		
		println "quantity: $quantity"
		println "location: $location"
		println "item: $item"
		
		def itemLocation = ItemLocation.findByLocationAndItem(location, item)
		
		if(!itemLocation){
			println "item location does not exist - creating a new one"
			itemLocation = new ItemLocation(location:location, item:item)
		}
		
		itemLocation.quantity += quantity
		
		
		// update itemlocation quantity
		if(itemLocation.save()){
			println "successfully updated item location quantity to $itemLocation.quantity"
		}else{
			println "failed to update item location: $itemLocation.errors"
		}
		
		session.location = null
		session.item = null
		
		
		[]

	}
	
}
