
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
			etikette: 'aktion hinzufugen',
			titel: 'add action...',
			act: 'aktion'
		},{
			id: 'szenarioSpeichern',
			etikette: 'szenario speichern',
			titel: 'save scenario',
			act: 'aktion'
		},{
			id: 'testfallErstellen',
			etikette: 'testfall erstellen',
			titel: 'create test case',
			act: 'aktion'
		},{
			id: 'testSuiteErstellen',
			etikette: 'test suite erstellen',
			titel: 'create test suite',
			act: 'aktion'
		}],
		suche: {
			id: 'cnSuche',
			eingang: {
				id: 'suche',
				platzhalter: 'suche...'
			}
		},
		stil: {
			farbeBg: 'rgb(154,205,50)',
			farbe: 'rgb(255,255,255)',
			einfassen: 'solid 1px',
			grenzradius: '7px',
			mauszeiger: 'pointer',
			randRechts: '5.5'
		}
	},
	dasReglement: [{
		aktion: 'Navigate To',
		feld: 'Input field name (*Enclose in double quotes)',
		art: [],
		xpath: "Enter XPATH (optional)",
		wert: 'Value to enter (*Enclose in double quotes)'
	},{
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
		wert: 'Optional value(s) to consider (*Enclose in double quotes)',
		ausgewahlt: true
	},{
		aktion: 'Select',
		feld: 'Name of item to select (*Enclose in double quotes)',
		art: [],
		xpath: "Enter XPATH (optional)",
		wert: 'Enter select options (*Enclosed in quotes - separated by single quotes and comma)'
	},{
		aktion: 'Search',
		feld: 'Name of item to search (*Enclose in double quotes)',
		art: [],
		xpath: "Enter XPATH (optional)",
		wert: 'Enter search value (*Enclosed in quotes)'
	}],
	bekommeRegeln: function() {
		return this.dasReglement;
	},
	ubersetzen: {
		aktion: 'action',
		feld: 'field',
		art: 'type',
		xpath: 'xpath',
		wert: 'value'
	},
	artikelarten: [
		'Select...',
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
	bekommenSieAktionen: function() {
		var reg = this.bekommeRegeln();
		var s = doc.create('select');
		for(var i=0; i<reg.length; i++) {
			s.hinzufugen('option').htm( reg[i]['aktion'] );
			if( reg[i]['ausgewahlt'] ) {
				s.lastChild.selected = reg[i]['ausgewahlt'];
				s.options.daten = reg[i];
			}
		}
		return s;
	},
	wahlenSieDieOptionenFurDenArtikeltyp: function() {
		var s = doc.create('select');
		var ls = this.erhalteArtikeltypen();
		ls.forEach.call(function(itm){
			var o = s.hinzufugen( 'option' );
			if( itm == 'Select...') {o.value='select';}
			o.htm( itm );
		});
		console.log( s );
		return s;
	}
};