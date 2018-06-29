
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