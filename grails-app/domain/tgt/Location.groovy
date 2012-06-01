package tgt

class Location {

	static final List<String> STATES = ["Back Room", "Floor"]
	
	static hasMany = [itemLocations: ItemLocation]
	static belongsTo = [store: Store]
	
	
	String locId
	String state
	
    static constraints = {
		locId blank:false //TODO - needs to match a specific pattern
		state blank:false, inList:STATES		
    }
}
