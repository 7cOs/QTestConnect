
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
			id: 'aktionLoschen',
			etikette: 'aktion loschen',
			titel: 'delete action...',
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
			randRechts: '5.5',
			artikelauswahlSpalteBg: 'rgb(157,207,55)'
		}
	},
	dasReglement: [{
		aktion: 'Navigate To',
		feld: '[N/A]',
		art: [],
		xpath: '[N/A]',
		wert: 'Enter Site URL [Required]'
	},{
		aktion: 'Login',
		feld: '[N/A]',
		art: [],
		xpath: "Enter XPATH (optional)",
		wert: 'Enter Test User Credentials [Required]'
	},{
		aktion: 'Enter',
		feld: 'Input ield name [Required]',
		art: [],
		xpath: "Enter XPATH [Optional]",
		wert: 'Value to enter [Required]'
	},{
		aktion: 'Click',
		feld: 'Enter Item Name to click [Required]',
		art: [],
		xpath: "Enter XPATH [Optional]",
		wert: 'Optional value(s)',
		ausgewahlt: true
	},{
		aktion: 'Select',
		feld: 'Enter Item Field to Select [Required]',
		art: [],
		xpath: "Enter XPATH (optional)",
		wert: 'Enter select options (*Enclosed in quotes - separated by single quotes and comma)'
	},{
		aktion: 'Deselect',
		feld: 'Name of item to de-select (*Enclose in double quotes)',
		art: [],
		xpath: "Enter XPATH (optional)",
		wert: 'Enter select options (*Enclosed in quotes - separated by single quotes and comma)'
	},{
		aktion: 'Search',
		feld: 'Name of item to search (*Enclose in double quotes)',
		art: [],
		xpath: "Enter XPATH (optional)",
		wert: 'Enter search value (*Enclosed in quotes)'
	},{
		aktion: 'Logout',
		feld: 'Input field name (*Enclose in double quotes)',
		art: [],
		xpath: "Enter XPATH (optional)",
		wert: 'Value to enter (*Enclose in double quotes)'
	}],
	bekommeRegeln: function() {
		return this.dasReglement;
	},
	regelErhalten: function( a ) {
		for(var i = 0; i < (o = this.bekommeRegeln()).length; i++) {
			if( o[i].aktion == a ) {
				return o[i];
			}
		}
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
		'Radio Button', 
		'Field',
		'Text',
		'Options',
		'Checkbox', 
		'Increment', 
		'Decrement',
		'Pre-defined',
		'Other'
	],
	erhalteArtikeltypen: function() {
		return this.artikelarten;
	},
	bekommenSieAktionen: function() {
		var reg = this.bekommeRegeln();
		var s = doc.create('select');
		s.className = 'ausgewahlteAktion';
		for(var i=0; i<reg.length; i++) {
			s.hinzufugen('option').htm( reg[i]['aktion'] );
			if( reg[i]['ausgewahlt'] ) {
				s.lastChild.selected = reg[i]['ausgewahlt'];
				s.options.daten = reg[i];
			}
		}
		// - Set events - //
		ereignisseFestlegen(s);
		return s;
	},
	wahlenSieDieOptionenFurDenArtikeltyp: function() {
		var s = doc.create('select');
		var ls = this.erhalteArtikeltypen();
		ls.forEach(function(itm){
			var o = s.hinzufugen( 'option' );
			if( itm == 'Select...') {o.value='select';}
			o.htm( itm );
		});
		return s;
	}
};