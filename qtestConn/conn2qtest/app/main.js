
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

function refurbishNavItemDetails(results) {
	var qdInfo = ci.q('layout main quadrant contents quadrants info'); 
	qdInfo.clear();
	
	// - Set item details - //
	qdInfo.htm( results ); 
	
	// - Restrict - use for data retrieval purposes only - //
	qdInfo.q("[class*='main-content']").hide();
	
	// - Retrieve items of interest - //
	var ls = ['.rc-header', '.rc-tab-bar', '.dijitTitlePane'];
	ls.forEach(function(cls) {
		if( qs(cls).length == 1 && cls == '.rc-header') {
			qdInfo.add('header').add('ico');
			qdInfo.q('header').add('_details');
			qdInfo.q('header _details').add('summary');
			qdInfo.q('header _details summary').add('type').htm('ItemType');
			qdInfo.q('header _details summary').add('_title').htm('ItemTitle');
			qdInfo.q('header _details summary').add('lastUpdated').htm('ItemLastUpdated');
			qdInfo.q('header').add('actions').htm('header-actions');
			if( q('#moduleContentPane') ) {
				qdInfo.q('header ico').className = 'fa fa-cogs w3-xxlarge';
				qdInfo.q('header _details summary type').htm('Project Module');
			}else {
				qdInfo.q('header ico').className = 'fa fa-cog w3-xxlarge';
				qdInfo.q('header _details summary type').htm('Test Case');
			}
			// - Pull / Re-align - //
			var _title = q("[widgetid*='dijit_InlineEditBox']").textContent;
			var lastUpdated = q(".edit-msg").textContent;
			qdInfo.q('header _details summary _title').htm(_title);
			qdInfo.q('header _details summary lastUpdated').htm(lastUpdated);
			// - The Acts... - //
			qdInfo.q('header actions').htm('');
			var acts = qs('.rc-header .right-pane .dijitButton');
			[].forEach.call( acts, function(n) {
				var a = qdInfo.q('header actions').add('action');
				a.add( 'ico' ).className = 'fa fa-cog';
				console.log( n.textContent.replace('?', '') )
				var desc = n.textContent.replace('?', '');
				a.add('desc').htm( desc );
			});
			if( ! q('#moduleContentPane') ) {
				// - Prepend necessary actions - //
				var a = qdInfo.q('header actions').insertBefore( 
							qdInfo.q('header actions').add('action'),  
						qdInfo.q('header actions').firstChild );
				a.add('ico').className = 'fa fa-cog';
				a.add('desc').htm('Execute Test(s)');
			}
			
		} else if(qs(cls).length == 1 && cls == '.rc-tab-bar') {
			var tB = qdInfo.add('tabbar');
			[].forEach.call(qs(cls)[0].querySelectorAll('.tab'), function(n) {
				if( n.textContent !='' ) {
					var t = tB.add('tab');
					t.htm(n.textContent);
				}
			});
		}
		else {
			qdInfo.add('contents');
			qdInfo.q('info > contents').add('tabContainer');
			qdInfo.q('info > contents tabContainer').add( 'tabs' );
			qdInfo.q('info > contents tabContainer').add( 'tabTitleContainer' );
			qdInfo.q('info > contents tabContainer').add('tabContents');
			[].forEach.call( qs(cls), function(n, i) {
				var t = qdInfo.q('info > contents tabContainer tabs').add('tab');
				t.htm(n.querySelector('.dijitTitlePaneTextNode').textContent);
				// - Store tab title and contents container in tab - //
				t.cntabTitle = qdInfo.q('info > contents tabContainer tabTitleContainer');
				t.cnTabContents = qdInfo.q('info > contents tabContainer tabContents');
				// Set tab events - //
				setEvents( t );
			});
		}
	});
}

function highlightItemDetailsTab(t) {
	[].forEach.call(t.progen.qs('tab'), function(t) {
		with(t.style) {
			backgroundColor = 'hsl(180, 20%, 25%)';
			color = 'rgb(255,255,255)';
			borderTopColor = 'transparent';
			borderLeft = 'none';
			borderRight = borderLeft;
		}
	});
	// - Highlight selected item - //
	with(t.style) {
		backgroundColor = 'rgb(255,255,255)';
		color = 'hsl(180, 20%, 25%)';
		borderTopColor = '#8bc34a';
		borderLeft = 'solid 1px';
		borderRight = borderLeft;
		whiteSpace = 'nowrap';
	}
}

function addItemDetailsContents(tb) {
	var name = tb.textContent;
	var sect = null;
	name=='Properties' ? sect=q('[name=fmTestCase] .property-table') : 
	name=='Test Steps' ? sect=qs('#testStepGrid table') :
	name=='Resources' ? sect=q('#testCaseResourcePane_pane .resource-table') : 
	name.indexOf('Session List') > -1 ? sect=q('#session_pane_testcase_pane table') : 
	null;
	
	tb.cnTabContents.clear();
	
	if(name=='Properties') {
		console.log( sect );
		var t = tb.cnTabContents.add('table');
		t.id = 'tTcPropsSect';
		var b = t.add( 'tbody' );
		b.id = 'bTcPropsSect';
		[].forEach.call( sect.qs('tr'), function(n) {
			var r = b.add( 'tr' );
			r.className = 'rTcPropsSect';
			[].forEach.call(n.qs('td'), function(n) {
				var c = r.add('td');
				c.className = 'cTcPropsSect';
				var cs = n.getAttribute('colspan');
				cs ? c.setAttribute('colspan', cs) : null;
				var lb = n.q("label[for]");
				var fd = n.q(".property-input");
				lb ? c.htm(lb.textContent) : c.add('input');
				lb ? c.className = 'label' : c.className = 'field';
				if( ver = n.q('#propVersionDisplay') ) {
					with(c.q('input')) {
						value = ver.textContent;
						readOnly = true;
						with(style) {
							border='none';
						}
					}
				}
				// - Adjust for select - //
				else if( n.q("[role=combobox]") ) {
					c.clear();
					c.add( 'select' );
					getSelectOptions(lb);
				}
				// - Adjust for RTF - //
				else if( n.q('.qasRichTextEditor') ) {
					c.clear();
					c.add( 'rtf' ).contentEditable = true;
				}
			});
		});
	}
	
	
	function getSelectOptions(lb) {
		if( lb == 'Status' ) {
			console.log( q("[id*='propStatus'] .dijitComboBoxMenu") );
		}
	}
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