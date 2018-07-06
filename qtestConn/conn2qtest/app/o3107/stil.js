
/** let stilFestlegen be set style */
function stilFestlegen( o ) {
	// - Bounce if object does not include style property - //
	if( !o || !o.style ) return;
	
	const id = o.id;
	const clz = o.className;
	const nN = o.nodeName.toLowerCase();
	
	const farbeBg = daten.ci.stil.farbeBg;
	const hintergrundfarbe = daten.ci.stil.hintergrundfarbe;
	const vordergrundfarbe = daten.ci.stil.vordergrundfarbe;
	const farbe = daten.ci.stil.farbe;
	const einfassen = daten.ci.stil.einfassen;
	const grenzradius = daten.ci.stil.grenzradius;
	const mauszeiger = daten.ci.stil.mauszeiger;
	const randRechts = daten.ci.stil.randRechts;
	const artikelauswahlSpalteBg = daten.ci.stil.artikelauswahlSpalteBg;
	
	// - Disregard styling for the following tags - //
	if(nN == 'iko') return;
	
	with( o.style ) {		
		fontFamily = 'arial';
		if(id=='ci') {
			margin = '0';
			[].forEach.call(o.qs('*'), function(o) {
				// console.log( o.id );
				stilFestlegen(o);
			});
		}
		if(id=='cnBeobachtungen') {
			
		}
		if( nN == 'table') {
			// o.border = '1';
			width = '100%';
			borderCollapse = 'collapse';
		}
		if(o.id == 'tblBeobachtungen') {
			height = '100%';
			stilFestlegen(o.q('caption'));
			[].forEach.call(o.qs('th'), function(c){
				 stilFestlegen(c);
			});
			stilFestlegen(o.q('td #quadCnAktionenSuche'));
		}
		if( nN == 'caption' ) {
			fontSize = '27px';
			background = farbeBg;
			color = farbe;
			fontWeight = 'bold';
			padding = '27px';
			textTransform = 'lowercase';
		}		
		if(nN == 'th') {
			backgroundColor = farbeBg;
			color = farbe;
			textTransform = 'lowercase';
			padding = '7px';
			borderRight = einfassen;
		}
		if(id == 'quadCnAktionenSuche') {
			display = 'flex';
			alignItems = 'center';
			backgroundColor = farbeBg;
			padding = '7px';
			paddingLeft = '5px';
			[].forEach.call(o.qs('#cnAktionen, #cnSuche'), function(n) {
				stilFestlegen(n);
			});
		}
		if( id == 'cnAktionen' ) {
			flex = '1';
			[].forEach.call( o.qs('aktion'), function(o) {
				stilFestlegen(o);
			});
		}
		if(nN == 'aktion') {
			color = farbe;
			padding = '11px';
			marginRight = randRechts;
			border = einfassen;
			borderRadius = grenzradius;
			cursor = mauszeiger;
			// - Consider child objects - //
			[].forEach.call(o.qs('*'), function(o) {
				var nn = o.nodeName.toLowerCase();
				with(o.style) {
					nn == 'etikette' ? marginRight = '7px' : null
				}
			});
		}
		if( id == 'cnSuche' ) {
			stilFestlegen(o.q('#suche'));
		}
		if( id == 'suche' ) {
			padding = '11px';
			borderRadius = grenzradius;
			border = einfassen;
			borderColor = farbe;
		}
		if(id=='tblInhaltUndNavigator') {
			height = '100%';
		}
		if(id=='wahleAlleGegenstandeAus') {
			width='3%';
			cursor = mauszeiger;
		}
		if(id=='cnInhalt') {
			width = '81%';
			verticalAlign = 'top';
		}
		if(id=='tblInhalt') {
		}
		if( clz == 'cnAktionszeile' ) {
			[].forEach.call(o.qs('td *'), function(n){
				var nn = n.nodeName.toLowerCase();
				with(n.style) {
					if( n.className  ==  'cnArtikelauswahl' ) {
						background = artikelauswahlSpalteBg;
						textAlign = 'center';
						borderTop = einfassen + ' ' + farbe;
						
					} else {
						if( (nn == 'input' || nn == 'select') && n.className != 'cbxArtikelauswahl' ) {
							width = '100%';
							height = '100%';
							padding = '7px';

						}
					}
				}
			});
		}
		if(id == 'cnHeaderSpaltenfelder') {
			// o.verbergen();
		}
		if(id=='cnNavigator'){
			verticalAlign = 'top';
			borderLeft = einfassen + ' ' + farbeBg;
		}
		if(id=='cnNavHeader') {
			padding = '7px';
			textAlign = 'center';
			background = farbeBg;
			color = farbe;
			fontWeight = 'bold';
		}
		if( clz == 'modal' ) {
			display = 'flex';
			flexDirection = 'column';
			backgroundColor = farbe;
			width = '575px';
			height = '255px';
			border = einfassen+' '+farbeBg;
			borderRadius = grenzradius;
			/** stil Kindknoten */
			[].forEach.call( o.qs('*'), function(o) {
				console.log( o.id );
				with( o.style ) {
					padding = '5px';
					switch( o.id ) {
					case 'cnHeader':
						display = 'flex';
						alignItems = 'center';
						backgroundColor = farbeBg;
						color = farbe;
						border = einfassen+' '+farbe;
						borderTopLeftRadius = grenzradius;
						borderTopRightRadius = borderTopLeftRadius;
						with( (h = o.q('header').style )) {
							flex = 1;
							fontWeight = 'normal';
						}
						break;
					case 'modalSchliezen':
						cursor = mauszeiger;
						break;
					case 'cnInhalt':
						flex = 1;
						break;
					case 'modaleAktionen':
						display = 'flex';
						justifyContent = 'center';
						backgroundColor = hintergrundfarbe;
						borderTop = einfassen + ' ' + hintergrundfarbe;
						break;
					case 'sparen':
					case 'stornieren':
						color = farbeBg;
						backgroundColor = vordergrundfarbe;
						border = einfassen + ' ' + farbeBg;
						borderRadius = grenzradius;
						cursor = mauszeiger;
						marginRight = '5px';
						break;
					}
				}
			});
		}
		if( id == 'menu_schaffenTestobjekte' ) {
			var p = o.progen;
			backgroundColor = hintergrundfarbe;
			color = farbe;
			display = 'flex';
			flexDirection = 'column';
			position = 'absolute';
			top = (p.getBoundingClientRect().top) + 
				(p.getBoundingClientRect().height);
			boxShadow = '0px 8px 16px 0px rgba(0,0,0,0.2)';
			border = einfassen+' '+farbeBg;
			borderRadius = grenzradius;
			[].forEach.call(o.qs('mitem'), function(mi) {
				stilFestlegen(mi);
			});
		}
		if(nN == 'mitem') {
			display = 'flex';
			flexDirection = 'row';
			padding = '5px';
			width = '155px';
			[].forEach.call(o.qs('ico'), function(o) {
				with( o.style ) {
					marginRight = '9px';
				}
			})
		}
	}
}
	