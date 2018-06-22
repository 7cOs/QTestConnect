
/**
* let daten be Data
* let beobachtungstitel be Title of Observation
* let dasReglement be Rules
* let artikelarten be Item Types
* let erhalteArtikeltypen be get Item Types
*/	
var daten = {
	beobachtungstitel: 'Beobachtungstabelle der Aktionen',
	dasReglement: [{
		action: 'Enter',
		field: 'Input field name (*Enclose in double quotes)',
		type: [],
		xpath: "Enter XPATH (optional)",
		value: 'Value to enter (*Enclose in double quotes)'
	},{
		action: 'Click',
		field: 'Name of item to click (*Enclose in double quotes)',
		types: [],
		xpath: "Enter XPATH (optional)",
		value: 'Optional value(s) to consider (*Enclose in double quotes)'
	},{
		action: 'Select',
		field: 'Name of item to select (*Enclose in double quotes)',
		types: [],
		xpath: "Enter XPATH (optional)",
		value: 'Enter select options (*Enclosed in quotes - separated by single quotes and comma)'
	}],		
	artikelarten: [
		'Button',
		'radio Button', 
		'Field',
		'Text',
		'Option',
		'Checkbox', 
		'Increment', 
		'Decrement', 
		'Other'
	],
	erhalteArtikeltypen: function() {
		return this.artikelarten;
	}
};