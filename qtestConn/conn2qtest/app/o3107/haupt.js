
function prozessInitialisieren() {
	init();
	// - Set process title - //
	einstellenBeobachtungstitel(daten.ci.titel);
}

function einstellenBeobachtungstitel(titel) {
	doc.title = titel;
}

function tabelleDerBeobachtungenHinzufugen(titel) {
	var t = ci.q('cn').hinzufugen('table');
	ci.q( 'cn table' ).id = 'tblBeobachtungen';
	var c = t.hinzufugen('caption');
	c.htm( titel.replace('der', ' <br />der') );
	var h = t.hinzufugen('thead');
	
	// - Add actions container - //
	var akts = h.hinzufugen('tr');
	akts.hinzufugen('td').hinzufugen('quadrant');
	akts.q('td quadrant').id = 'quadCnAktionenSuche';
	var cn = akts.q('td quadrant').hinzufugen('cn');
	cn.id = 'cnAktionen';
	
	// - Add table header columns - //
	h.hinzufugen('tr').id = 'cnHeaderSpaltenfelder';
	
	// - Add select all items (rows) column - //
	var sc = h.q('#cnHeaderSpaltenfelder').hinzufugen('th');
	sc.id = 'wahleAlleGegenstandeAus';
	sc.title = 'select/deselect all';
	sc.htm('&nbsp;');
	ereignisseFestlegen(sc);
	
	// - Add remaining table header column fields - //
	for( var i in o = daten.dasReglement[0] ) {
		var c = h.q('#cnHeaderSpaltenfelder').hinzufugen('th');
		c.htm(i);
		c.title = daten.ubersetzen[i];
	}
	
	// - Add actions - //
	akts.q('tr td').colSpan = h.qs('#cnHeaderSpaltenfelder th').length;
	for(var i=0; i<(o = daten.ci.hauptAktionen).length; i++) {
		var akt = akts.q('#cnAktionen').hinzufugen('aktion');
		akt.daten = o[i];
		for(var j in o[i]) {
			if(o[i][j]=='cnSuche'){ continue; }
			// - Add aktion ikon - //
			j == 'iko' ? akt.hinzu(j).className = o[i][j].clz : null;
			j == 'etikette' ? akt.hinzu(j).htm(o[i][j]) : akt.setAttribute(j, o[i][j]);
			j == 'titel'? akt.title =  o[i][j] : null;
		}
		// - Show/hide aktions - //
		if( o[i].anzeigen == false) {
			akt.verbergen();
		}
		// - Store menu daten in akt if applicable - //
		o[i].menu ? akt.menu = o[i].menu : null;
		
		// - Set action events - //
		ereignisseFestlegen(akt);
	}
	
	// - Add search item - //
	akts.q('#cnAktionen').progen.hinzufugen('cn').id = daten.ci.suche.id;
	akts.q('#cnAktionen').progen.q('#' + daten.ci.suche.id );
	akts.progen.q('#cnSuche').hinzufugen('input');
	akts.progen.q('#cnSuche input').id = daten.ci.suche.eingang.id;
	akts.progen.q('#cnSuche #suche').placeholder =  daten.ci.suche.eingang.platzhalter;
	
	ci.q('#cnBeobachtungen').hinzufugen('table').id = 'tblInhaltUndNavigator';
	t = q('#tblInhaltUndNavigator');
	var r = t.hinzufugen('tbody').hinzu('tr');
	// - Add quadrants: inhalt & navigator - //
	for(var i=0; i<2; i++) {
		var c = r.hinzufugen( 'td' );
		if(i==0) {
			c.id = 'cnInhalt';
			c.hinzu('table').hinzufugen('thead');
			c.q('table').id = 'tblInhalt';
			c.q('table thead').hinzufugen(q('#cnHeaderSpaltenfelder'));
			c.q('table').hinzu( 'tbody' );
		}else {
			c.id = 'cnNavigator';
			c.hinzu('header').htm(daten.ci.navigator.header.etikette);
			c.q('header').id = 'cnNavHeader';
		}
	}
}

//- Add aktion menu (where applicable) - //
function aktionsmenuHinzufugen(o) {
	/** Spulen */
	o.kilsof( q('#menu_'+o.id) );
	
	var m = doc.create('_menu');
	m.id = 'menu_'+o.id;
	// - Store aktion item in menu object - //
	m.aktion = o.daten;
	
	// - Add menu item to aktion object
	o.hinzufugen( m );
	
	// - Add menu items - //
	o.menu.forEach( function(o) {
		var mI = m.hinzufugen('mitem');
		mI.hinzu('ico').className = o.ico.clz;
		mI.hinzu('etikette').htm(o.etikette);
		mI.title = o.titel;
		mI.daten = o; // - Store daen in item - //
		// - Set menu item events - //
		ereignisseFestlegen(mI);
	});
	
	// - Legen Sie Ereignisse und Stil fest - //
	ereignisseFestlegen(m);
	stilFestlegen(m);
	
	return m;
}

//- Add action row to table passed to the method - //
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

//- Delete selected table row item(s) - //
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

//- Set selected action item fields  - //
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

// - Display Add test object to action observation table (beobachtungstabelle) - //
function testobjektHinzufugen(o) {
	try {
		var m = modalWerden(); // - Display modal - //
		m.q('header').htm(o.progen.aktion.etikette);
		m.d2c(ci);
		ci.scrollenDeaktivieren();
	} catch(e) {
		ci.scrollenAktivieren();
	}
}
 