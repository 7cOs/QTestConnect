
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
	
	getSynopsis: function() {
		
	},
	
	getXhr: function() {
		return new XMLHttpRequest();
	}
};

