
/** 
 * let ereignisseFestlegen be set events
 * let o be object
 */
function ereignisseFestlegen(o) {
	o.addEventListener('click', function(e){
		var act = o.getAttribute('act');
		if( act == 'aktion' ) {
			if(this.id == 'aktionHinzufugen') {
				fugenSieEineAktionszeileZurTabelleHinzu(q('#tblInhalt'));
			}
			if(this.id == 'aktionLoschen') {
				fugenSieEineAktionszeileZurTabelleHinzu(q('#tblInhalt'));
			}
		}
	});
	
	o.addEventListener('change', function(e) {
		if(this.className == 'ausgewahlteAktion') {
			
		}
	});
}

// - Add action row to table passed to the method - //
function fugenSieEineAktionszeileZurTabelleHinzu(t) {
	console.log('Add action row to ' + t.id);
	
	// - Get default selected (ausgewahlt) action - //
	var s = daten.bekommenSieAktionen(); 

	var r = t.q('tbody').hinzufugen('tr');
	r.className = 'cnAktionszeile';
	// -- Add itemSelector column und selector - //
	r.hinzufugen('td').className = 'cnArtikelauswahl';
	r.q('td .cnartikelauswahl').hinzufugen('input').type = 'checkbox';
	r.q('input[type=checkbox]').className = 'cbxArtikelauswahl';

	// - Add remaining action fields or columns - //
	for(var i in o=s.options.daten) {
		if( i=='ausgewahlt') { continue; }
		var c = r.hinzufugen( 'td' );
		c.htm('Platzhalter');
		if(i=='aktion') {
			c.spulen(); // - Rinse column contents - //
			c.hinzufugen(daten.bekommenSieAktionen());
		}else {
			c.htm(o[i]);
			if(i=='feld' || i=='wert' || i=='xpath') {
				c.spulen();
				var f = c.hinzufugen('input');
				f.placeholder = o[i];
			}
			if(i=='art') {
				c.hinzufugen(daten.wahlenSieDieOptionenFurDenArtikeltyp());
			}
		}
	}
	
	// - Set action row style - //
	stilFestlegen( r );
}

function elementLoschen() {
	
}