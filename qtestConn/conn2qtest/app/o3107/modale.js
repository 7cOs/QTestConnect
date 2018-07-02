
/** Get modal */
function modalWerden() {
	
	var mo = daten.ci.modal;
	
	var m = doc.create('modal');
	m.className = 'modal';
	var cn = m.hinzu('cn');
	cn.id = 'cnHeader';
	var h = cn.hinzu('header');
	h.htm('[ohne titel]');
	
	var ico = cn.hinzu('ico');
	ico.id = mo.schliezen.ico.id;
	ico.className = mo.schliezen.ico.clz;
	ico.title = mo.schliezen.ico.titel;
	ico.modal = m; // - Store modal in ico - //
	
	// - Set close modal events - //
	ereignisseFestlegen( ico );
	
	// - Add modal contents container - //
	cn = m.hinzu('cn');
	cn.id = 'cnContents';
	cn.htm( cn.id );
	
	var acs = m.hinzu('actions');
	acs.id = 'modaleAktionen';
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