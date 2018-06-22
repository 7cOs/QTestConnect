
/** let stilFestlegen be set style */

function stilFestlegen( o ) {
	if( !o || !o.style ) return;
	const nN = o.nodeName.toLowerCase();
	console.log(nN);
	with( o.style ) {
		fontFamily = 'arial';
		stilFestlegen( o.q('table') );
		if( nN == 'table') {
			o.border = '1';
			width = '100%';
		}
		if(o.id == 'tblBeobachtungen') {
			borderCollapse = 'collapse';
			[].forEach.call(o.qs('th'), function(c){
				 stilFestlegen(c);
			});
		}
		if( nN == 'th' ) {
			textTransform = 'capitalize';
		}
	}
}
	