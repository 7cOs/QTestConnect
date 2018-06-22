
/**
* let daten be Data
* let beobachtungstitel be Title of Observation
* let dasReglement be Rules
* let artikelarten be Item Types
* let erhalteArtikeltypen be get Item Types
* let ubersetzen be Translator
*/	
var daten = {
	ci: {
		titel: 'Beobachtungstabelle der Aktionen',
		hauptAktionen: [{
			id: 'aktionHinzufugen',
			etikette: 'aktion hinzufugen...',
			titel: 'add action...',
			act: 'aktion'
		},{
			id: 'szenarioSpeichern',
			etikette: 'szenario speichern...',
			titel: 'save scenario',
			act: 'aktion'
		},{
			id: 'testfallErstellen',
			etikette: 'testfall erstellen...',
			titel: 'create test case',
			act: 'aktion'
		},{
			id: 'testSuiteErstellen',
			etikette: 'test suite erstellen...',
			titel: 'create test suite',
			act: 'aktion'
		}],
		suche: {
			id: 'cnSuche',
			htm: '<input id=suche placeholder=suche />'
		},
		stil: {
			farbeBg: 'rgb(154,205,50)',
			farbe: 'rgb(255,255,255)',
			einfassen: 'solid 1px',
			grenzradius: '7px',
			mauszeiger: 'pointer',
			randRechts: '3.5'
		}
	},
	dasReglement: [{
		aktion: 'Enter',
		feld: 'Input field name (*Enclose in double quotes)',
		art: [],
		xpath: "Enter XPATH (optional)",
		wert: 'Value to enter (*Enclose in double quotes)'
	},{
		aktion: 'Click',
		feld: 'Name of item to click (*Enclose in double quotes)',
		art: [],
		xpath: "Enter XPATH (optional)",
		wert: 'Optional value(s) to consider (*Enclose in double quotes)'
	},{
		aktion: 'Select',
		feld: 'Name of item to select (*Enclose in double quotes)',
		art: [],
		xpath: "Enter XPATH (optional)",
		wert: 'Enter select options (*Enclosed in quotes - separated by single quotes and comma)'
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
	},
	ubersetzen: {
		aktion: 'action',
		feld: 'field',
		art: 'type',
		xpath: 'xpath',
		wert: 'value'
	}
};