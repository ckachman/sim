package tgt



class ItemLocationTests extends GroovyTestCase{

    void testCompositeKeyAssociation() {
       Item item = new Item(description:'Test Item', state: 'Boxed', sku: 123456789)
	   Location location = new Location(locId:'shelf123', state:'Back Room')
	   location.store = new Store()
	   ItemLocation itemLocation = new ItemLocation(item:Item, location:Location, quantity:10)
		
		assertTrue itemLocation.save()
    }
}
