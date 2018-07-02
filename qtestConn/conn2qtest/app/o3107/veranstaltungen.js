
/** 
 * let ereignisseFestlegen be set events
 * let o be objekt
 */
function ereignisseFestlegen(o) {
	try {

		var nN = o.nN();
		var act = o.getAttribute('act');	

		o.addEventListener('click', function(e){
			if (act == 'aktion') {
				if(this.id == 'schaffenTestobjekte') {
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
			// - Execute aktion menu item event - //
			if(nN == 'mitem') {
				e.stopPropagation();
				
				// - Add test object - //
				testobjektHinzufugen(o);
			}
			
			 //- Close modal - //
			if(this.id=='modalSchliezen') {
				this.kilsof(this.modal);
			}
		});
		o.addEventListener('change', function(e) {
			if(this.className == 'ausgewahlteAktion') {
				legenSieAusgewahlteAktionszeilenfelderFest(this.options[this.selectedIndex]);
			}
		});

	} catch( x ) {
		
		console.log( x );
		
	}
}
