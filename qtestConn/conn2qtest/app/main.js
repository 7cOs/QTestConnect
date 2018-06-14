
var d, doc, ci;

function init() {
	d = document, doc = d;
	d.title = data.header._title+' - '+data.header.desc;
	
	q=function( q ) { return d.querySelector( q ); };
	qs=function( q ) { return d.querySelectorAll( q ); };
	
	// - Hide document body - //
	d.body.style.display = 'none';
	
	Element.prototype.add = function(n) {
		if(typeof(n)== 'object') {
			this.appendChild( n ); 
			n.progen = this;
			return;
		}
		var cmp = d.createElement(n);
		if( cmp.nodeName != 'STYLE' ){ 
			cmp.className = 'cmp';
			with( cmp.style ) {
				if ( n != 'ico' ) {
					// display = 'block';
				}
			}
		}
		// - Store progenitor in child - //
		cmp.progen = this;
		return this.appendChild(cmp);
	};
	
	Element.prototype.q = function( q ) {
		return this.querySelector( q );
	};
	
	Element.prototype.qs = function( q ) {
		return this.querySelectorAll( q );
	};
	
	Element.prototype.clear = function() {
		this.textContent = '';
	};
	
	Element.prototype.show = function( ) {
		this.style.display = '';
	};
	
	Element.prototype.hide = function( ) {
		this.style.display = 'none';
	};
	
	Element.prototype.isDisplayed = function() {
		return this.style.display == '';
	};
	
	Element.prototype.txt = function( t ) {
		this.textContent = t;
	};	
	
	Element.prototype.htm = function( h ) {
		this.innerHTML = h;
	};			
	
	// - Build cI - //
	build();
}

function build() {
	// - Optional BLoF here ;-) - //
	addCi();
}

function addCi() {
	ci = d.head.parentNode.insertBefore(d.head.parentNode.add('ci'), d.body);
	ci.hide();
	
	ci.id = 'ci'; 
	ci.add('layout');
	ci.q('layout').add('header').add('quadrants');
	ci.q('layout header quadrants').add('quadrant').id = 'header';
	ci.q('layout header quadrants quadrant').add('logo').add('ico').className = data.header.logo.ico;
	ci.q('layout header quadrants quadrant').add('_title').htm(data.header._title);
	ci.q('layout header quadrants quadrant').add('desc').htm(data.header.desc);
	ci.q('layout header quadrants').add('quadrant').add('actions');
	ci.q('layout header quadrants quadrant actions').progen.id = 'actions';
	var acts = ci.q('layout header quadrants quadrant actions');
	data.header.actions.forEach( function(o) {
		var act = acts.add('action');
		act.id = o.id;
		act.add('ico').className = o.ico;
		// - Set action events - //
		setEvents( act );
	});
	
	ci.q('layout').add('main');
	ci.q('layout main').add('actions').add('quadrants').htm('actions-quadrants');
	ci.q('layout main').add('quadrant');
	ci.q('layout main quadrant').add('contents').add('quadrants').add('info').htm('contents-info-quadrant');
	ci.q('layout main quadrant').add('navigator').add('quadrants');
	ci.q('layout main quadrant navigator quadrants').add('header').htm('navigator-header');
	ci.q('layout main quadrant navigator quadrants').add('contents');
	
	ci.q('layout').add('_progress').add('quadrants');
	ci.q('layout _progress > quadrants').add('quadrant').id = 'progressInfo';
	ci.q('layout _progress quadrant#progressInfo').add('ico').className = data._progress.ico;
	ci.q('layout _progress quadrant#progressInfo').add('msg').htm(data._progress.msg);
	
	ci.q('layout').add('footer').add('quadrants').add('quadrant').id = 'footerContents';
	ci.q('layout footer quadrant#footerContents').htm(data.footer.companyInfo);
	
	services.addQTestNavTree();
	
	style.setStyles();
}

function addNavigatorRootNode() {
	// - Make tree root node child of navigator header - //
	if( rn = q( "[class*='root-node']" ) ) {
		ci.q('main quadrant navigator quadrants > header').htm('');
	    ci.q('main quadrant navigator quadrants > header').add( rn );
		// - Insert icon before node name - //
		var ico = rn.insertBefore( doc.createElement('ico'), rn.firstChild );
		ico.className = 'fa fa-home';
		with( rn.style ) {
			display = 'flex';
			fontWeight = 'bold';
			color = 'rgb(255,255,255)';
			alignItems = 'center';
			with(rn.querySelector('ico').style){
				marginRight = '11px';
			}
			with(rn.querySelector('.text').style){
				flex = '1';
				// border = 'solid';
			}
		}
		// Add navigator header actions after header text - //
		data.navigator.actions.forEach(function(o, n){
			var ic = rn.add('ico');
			for(var i in o) {
				var attr = (i == 'cls' ? attr = 'class' : i);
				ic.setAttribute(attr, o[i]);
				setEvents( ic );
			}
			with( ic.style ) { 
				marginLeft = '7px';
				ic.id == 'nav_search' ? marginLeft = '15px' : null;
				cursor = 'pointer';
			}
		});
		
		return rn;
	} 	
}

function refurbishNavTree() {
	// - Make tree root node returned by service a child of navigator header - //
	var rn = addNavigatorRootNode();
	
	// - Refurbish remaining nodes - //
	var ns = qs("[id*='test-design-tree'] [class*='tree-row removable']");
	[].forEach.call(ns, function( n ) {
		with(n.style) {
			cursor = 'pointer';
			// - Hide object type elements - //
			if(ot = n.querySelector("[class*='object-type']") ) {
				ot.style.display = 'none'; // - Hide object type indicator - //						
				// - Prepend object type icons - //
				var ico = ot.parentNode.insertBefore(doc.createElement('ico'), ot.nextSibling);
				if(ot.textContent.indexOf('MD')>-1) {
					ico.className = 'fa fa-cogs module';
					ico.type = 'icoCollapseTreeNode';
					ico.title = 'Expand/Collapse';
				} else if( ot.textContent.indexOf('TC')>-1) {
					ico.className = 'fa fa-cog testcase';
					ico.type = 'icoTestCaseTreeNode';
				}
				// - Store progen in ico - //
				ico.progen = n;
				// - Set events ico - //
				setEvents( ico );
				
				// - Set events links - //
				var lnk = n.querySelector('a');
				lnk.type = 'lnkTreeNode';
				// -Store progen in lnk - //
				lnk.progen = n;
				setEvents( lnk );
				
				// - Style ot icons - //
				with(ico.style) {
					marginRight = '3px';
					if( ico.className.indexOf('module') > -1 ) {
						color = 'darkgreen';
					}else {
						color = 'lightgreen';
					}
				}						
				// - Style links - //
				with( lnk.style ) {
					textDecoration = 'none';
					color = 'rgb(0,0,0)';
				}
			}
		}
	});
}

function showHideNavigator() {
	var nav = q('ci main navigator');
	nav.isDisplayed() ? nav.hide() : nav.show();
}

function expandCollapseNavTreeNode(n) {
	var a = n.querySelector('a');
	var ns = qs( '#'+a.id+'-children' );
	[].forEach.call(ns, function(n){			
		with(n.style){
			display != 'none' ? display = 'none' : display = '';
		}
	});
}

function expandCollapseNavTree(a) {
	var aId = a.id;
	var ns = qs("[id*='test-design-tree'] [class*='tree-row removable'] [class*='object-type-0']");
	[].forEach.call(ns, function(n){
		var id = n.parentNode.id+'-children';
		aId == 'expand_all' ? q( '#'+id ).style.display = '' : q( '#'+id ).style.display = 'none';
	});
}