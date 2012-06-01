package tgt

import java.util.List

class Item {

	static final List<String> STATUSES = ["Recalled", "Discontinued"]
	static final List<String> STATES = ["Open", "Boxed"]
	
	static hasMany = [itemLocations: ItemLocation]
	
	String sku
	String description
	String status
	String state
	
	
    static constraints = {
		sku blank:false, unique:true
		description blank:false, maxSize:1000
		status nullable:true, inList: STATUSES
		state blank:false, inList:STATES
    }
	
	public String toString(){
		return description
	}
}
