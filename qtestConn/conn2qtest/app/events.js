
function setEvents(o) {
	o.addEventListener('click', function(e) {
		if( o.type && o.type == 'nav_action' ) {
			if( o.id=='expand_all' || o.id == 'collapse_all' ) {
				expandCollapseNavTree(this);
			}
		}
		else if( o.id == 'icoNavHeader' ) {
			showHideNavigator();
		}
	});
}
