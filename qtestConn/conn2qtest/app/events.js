
function setEvents(o) {
	o.addEventListener('click', function(e) {
		if( o.getAttribute('type') == 'nav_action' ) {
			if( o.id=='expand_all' || o.id == 'collapse_all' ) {
				expandCollapseNavTree(this);
			}
		} else if(o.id == 'icoDisplayNav') {
			showHideNavigator();
		} else if ( this.type == 'icoCollapseTreeNode' ) {
			expandCollapseNavTreeNode(this.progen);
		} else if( this.type == 'lnkTreeNode' ) {
			services.getNavItemDetails(this.progen);
		} else if( this.nodeName.toLowerCase() == 'tab' ) {
			if( this.cntabTitle ) {
				this.cntabTitle.htm(this.textContent);
			}
		}
	});
}
