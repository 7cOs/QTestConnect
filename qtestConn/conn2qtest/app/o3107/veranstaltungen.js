
/** 
 * let ereignisseFestlegen be set events
 * let o be object
 */
function ereignisseFestlegen(o) {
	o.addEventListener('click', function(e){
		var act = o.getAttribute('act');
		if( act == 'aktion' ) {
			if( this.id == 'schaffenTestobjekte' ) {
				if( this.menu ) {
					this.hinzufugen( aktionsmenuHinzufugen(this) );
				}
			}
			if(this.id == 'aktionHinzufugen') {
				fugenSieEineAktionszeileZurTabelleHinzu(q('#tblInhalt'));
			}
			if(this.id == 'aktionLoschen') {
				loschenSieDenAusgewahltenTabellenzeileneintrag(q('#tblInhalt'));
			}
			if(this.id == 'szenarioErstellen') {
				testobjektHinzufugen(this);
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
		if(this.id=='modalSchliezen') { //- Close modal - //
			this.kilsof(this.modal);
		}
	});
	
	o.addEventListener('change', function(e) {
		if(this.className == 'ausgewahlteAktion') {
			legenSieAusgewahlteAktionszeilenfelderFest(this.options[this.selectedIndex]);
		}
	});
}

// - Get action menu - //
function aktionsmenuHinzufugen(o) {
	/** Spulen */
	o.kilsof( q('#menu_'+o.id) );
	
	var m = doc.create('_menu');
	m.id = 'menu_'+o.id;
	o.hinzufugen( m );
	
	o.menu.forEach( function(o) {
		var mI = m.hinzufugen('mitem');
		mI.hinzu('ico').className = o.ico.clz;;
		mI.hinzu('etikette').htm(o.etikette);
		mI.title = o.titel;
	});
	
	/** Legen Sie Ereignisse und Stil fest */
	ereignisseFestlegen(m);
	stilFestlegen(m);
	
	return m;
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
		c.setAttribute('name', i);
		
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
				console.log( 'typeof wert: ' + typeof o[i] );
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
	var akt = o.textContent;
	// - das reglement - //
	var r = daten.regelErhalten(akt); 
	// - Selected action row - //
	var p = o.progen.progen.progen; 
	for( var i in r ) {
		if( i=='aktion' ) { continue; }
		 // - Selected aktion column - //
		var c = p.q('td[name='+i+']');
		switch(i) {
		case 'feld':
		case 'xpath':
		case 'wert':
			var f = c.q('input');
			f.placeholder = r[i];
			f.readOnly = false;
			if( akt == 'Navigate To' || akt == 'Login') {
				if( i != 'wert' ) {
					f.readOnly = true;
					if(akt == 'Navigate To') {
						f.readOnly = false;
					}
				}
				if(akt == 'Login' && i == 'wert') {
					c.spulen(); // - Rinse - //
					// - Add test users select options - //
					c.hinzufugen( daten.erhaltenSieDieAnmeldedatenFurTestbenutzer() );
					// - Style aktion row - //
					stilFestlegen( p );
				}
			}
			break;
		case 'art':
			var s = c.q('select');
			s.disabled = false;
			[].forEach.call( s.options, function(o, i){
				var tx = o.textContent;
				if((akt == 'Navigate To' || akt == 'Login')
						&& tx == 'Predefined') {
					s.selectedIndex = i;
					s.disabled = true;
				} else {
					if(tx == 'Select...') {
						s.selectedIndex = i;
					}
				}
			});
			break;
		}
	}
}

// - Add test object to action observation table (beobachtungstabelle) - //
function testobjektHinzufugen(o) {
	console.log( o.daten );
	var m = getModal();
	m.q('header').htm( o.daten.modalerTitel );
	m.d2c( ci );
	console.log( m );
}

function getModal() {
	
	var mo = daten.ci.modal;
	
	var m = doc.create('modal');
	m.className = 'modal';
	var cn = m.hinzu('cn');
	cn.id = 'cnHeader';
	var h = cn.hinzu('header');
	var ico = cn.hinzu('ico');
	ico.id = mo.schliezen.ico.id;
	ico.className = mo.schliezen.ico.clz;
	ico.title = mo.schliezen.ico.titel;
	ico.modal = m; // - Store modal in ico - //
	// - Set close modal events - //
	ereignisseFestlegen( ico );
	
	// - Add modal contents container - //
	cn = m.hinzu('cn');
	cn.id = '';
	
	var acs = m.hinzu('actions');
	mo.actions.forEach( function( o ) {
		var ac = acs.hinzufugen('action');
		for( var i in o ) {
			i == 'id' ? ac.id = o[i] :
			i == 'etikette' ? ac.htm( o[i]) :
			i == 'titel' ? ac.title = (o[i]) : null;
		}
	});
	
	stilFestlegen( m );
	
	return m;
}
 