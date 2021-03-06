package tgt

class ItemLocation implements Serializable{

	static belongsTo = [item: Item, location: Location]
	
	Integer quantity = 0
	
    static constraints = {
		item nullable:false
		location nullable:false
		quantity nullable:false	
    }
	
	static mapping = {
		id composite: ['item', 'location']
	}
	
	
}
