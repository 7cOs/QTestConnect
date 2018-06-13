
var services = {
	addQTestNavTree: function() {
		// - Display progress info main - //
		var pI = q('ci layout _progress > quadrants quadrant#progressInfo');
		pI.style.display = 'block';

		var xhr = this.getXhr();
		xhr.onreadystatechange = function() {
		    if (this.readyState == 4 && this.status == 200) {
		    	var results = this.responseText;
		    	ci.q('main quadrant navigator quadrants contents').htm(results);
		    	
		    	// - Refurbish - //
		    	refurbishNavTree();

		    	// - Reveal - //
		    	ci.show();
		    	
		    	// - Dismiss progress info - //
		    	pI.hide();
		    }
		};
		xhr.open("GET", "/getExpandedNavTreeNodes", true);
		xhr.send();
	},
	
	getNavItemDetails: function( m ) {
		console.log( m.q('a span.text') );
		var pI = q('ci layout _progress > quadrants quadrant#progressInfo');
		pI.style.display = 'block';
		
		var qdInfo = ci.q('layout main quadrant contents quadrants info'); 
		qdInfo.clear();
		
		var xhr = this.getXhr();
		xhr.onreadystatechange = function() {
		    if (this.readyState == 4 && this.status == 200) {

		    	var results = this.responseText;
		    	qdInfo.htm( results ); // - Set item details - //
		    	// - Restrict - //
		    	[].forEach.call( qdInfo.qs('*'), function(n) {
		    		n.hide();
		    	});
		    	
		    	// - Retrieve only those items of interest - //
		    	var ls = ['.rc-header' /*, '.dijitTitlePane *'*/];
		    	ls.forEach( function(cS) {
		    		qdInfo.q(cS).show();
		    		[].forEach.call(qdInfo.qs(cS + " *"), function(item) {
		    			item.show();
		    		});

		    		// -- Add item of interest - //
		    		var item = qdInfo.q(cS);
		    		qdInfo.add( item );
		    		console.log( item.className )
		    		
		    		// -Style items of interest - //
		    		with( item.style ) {
		    			backgroundColor = 'silver';
		    			display = 'flex';
		    			alignItems = 'center';
		    			padding = '7px';
		    			if( iT = q('.rc-header-title') ){
		    				console.log( iT );
		    				with( iT.style ) {
		    					flex = 1;
		    				}
		    			}
		    		}
		    	});
		    	
		    	// - Dismiss progress info - //
		    	pI.hide();
		    }
		};
		xhr.open("POST", "/getNavItemDetails", true);
		xhr.send(m.q('a span.text').textContent);
	},
	
	getXhr: function() {
		return new XMLHttpRequest();
	}
};

