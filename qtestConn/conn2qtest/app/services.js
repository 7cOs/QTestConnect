
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
	
	getModuleSynopsis: function( m ) {
		var pI = q('ci layout _progress > quadrants quadrant#progressInfo');
		pI.style.display = 'block';
		
		var xhr = this.getXhr();
		xhr.onreadystatechange = function() {
		    if (this.readyState == 4 && this.status == 200) {
		    	var results = this.responseText;
		    	ci.q('layout main quadrant contents quadrants info').htm( results );

		    	// - Dismiss progress info - //
		    	pI.hide();
		    }
		};
		xhr.open("POST", "/getModuleSynopsis", true);
		xhr.send("Automated Tests");
	},
	
	getXhr: function() {
		return new XMLHttpRequest();
	}
};

