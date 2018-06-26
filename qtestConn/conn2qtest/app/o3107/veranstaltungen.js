
/** 
 * let ereignisseFestlegen be set events
 * let o be object
 */
function ereignisseFestlegen(o) {
	var act = o.getAttribute('act');
	o.addEventListener('click', function(e){
		if( act == 'aktion' ) {
			if(this.id == 'aktionHinzufugen') {
				fugenSieEineAktionszeileZurTabelleHinzu(q('#tblBeobachtungen'));
			}
		}
	});
}

// - Add action row to table passed to the method - //
function fugenSieEineAktionszeileZurTabelleHinzu(t) {
	console.log('Add action row to ' + t.id);
	
	// - Get default selected (ausgewahlt) action - //
	var s = daten.bekommenSieAktionen(); 

	var r = t.q('tbody').hinzufugen('tr');
	for(var i in o=s.options.daten) {
		if( i=='ausgewahlt') { continue; }
		var c = r.hinzufugen( 'td' );
		c.htm('Platzhalter');
		if(i=='aktion') {
			c.spulen(); // - Rinse column contents - //
			c.hinzufugen(s);
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
}