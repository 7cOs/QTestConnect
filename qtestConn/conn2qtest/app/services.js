
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
		    	
		    	// - Retrieve items of interest - //
		    	var ls = ['.rc-header', '.dijitTitlePane'];
		    	ls.forEach(function(cls) {
		    		if( qs(cls).length == 1 && cls == '.rc-header') {
		    			qdInfo.add('header').add('_details').htm('header-details');
		    			qdInfo.q('header').add('actions').htm('header-actions');
		    		}else {
		    			qdInfo.add('contents').htm('contents');
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

