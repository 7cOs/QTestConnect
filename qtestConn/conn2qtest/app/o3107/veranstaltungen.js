
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
				loschenSieDenAusgewahltenTabellenzeileneintrag(q('#tblInhalt'));
			}
		}
		if(this.id == 'wahleAlleGegenstandeAus') {
			var cbxz = qs('#tblInhalt .cbxArtikelauswahl');
			if(  ! o.alleAusgewahlt ) {
				[].forEach.call(cbxz, function(cbx) {
					if(  ! o.alleAusgewahlt ) {
						cbx.checked = true;
					}
				});
				o.alleAusgewahlt = true;
			} else {
				[].forEach.call(cbxz, function(cbx) {
					if(  o.alleAusgewahlt ) {
						cbx.checked = false;
					}
				});
				o.alleAusgewahlt = false;
			}
		}
	});
	
	o.addEventListener('change', function(e) {
		if(this.className == 'ausgewahlteAktion') {
			legenSieAusgewahlteAktionszeilenfelderFest(this.options[this.selectedIndex]);
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
	r.q('td .cnartikelauswahl input').reihe = r; // - Store row in input - //
	r.q('input[type=checkbox]').className = 'cbxArtikelauswahl';

	// - Add remaining action fields or columns - //
	for(var i in o=s.options.daten) {
		if( i=='ausgewahlt') { continue; }
		var c = r.hinzufugen( 'td' );

		c.htm('Platzhalter');
		if(i=='aktion') {
			c.spulen(); // - Rinse column contents - //
			c.hinzufugen(daten.bekommenSieAktionen());
		} else {
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
	
	// - Reset all selected to false - //
	q('#wahleAlleGegenstandeAus').alleAusgewahlt = false;
	
	// - Set action row style - //
	stilFestlegen( r );
}

// - Delete selected table row item(s) - //
function loschenSieDenAusgewahltenTabellenzeileneintrag(t) {
	var cbxs = ausgewahlteTabellenelemente(t);
	[].forEach.call(cbxs, function(cbx) {
		cbx.reihe.progen.removeChild( cbx.reihe );
	});
}

// - Get selected table items - //
function ausgewahlteTabellenelemente(t) {
	return t.qs('.cbxArtikelauswahl:checked');
}

// - Set selected action item fields  - //
function legenSieAusgewahlteAktionszeilenfelderFest(o) {
	var a = daten.regelErhalten(o.textContent);
	console.log( o.progen.progen.progen );
	// console.log( o.progen.progen.progen )
}