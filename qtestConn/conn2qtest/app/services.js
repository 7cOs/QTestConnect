
var services = {
	addQTestNavTree: function() {
		var xhr = this.getXhr();
		xhr.onreadystatechange = function() {
		    if (this.readyState == 4 && this.status == 200) {
		    	var results = this.responseText;
		    	ci.q('main quadrant navigator quadrants contents').htm(results);
		    	
		    	// - Refurbish - //
		    	refurbishNavTree();

		    	// - Reveal - //
		    	ci.show();
		    }
		};
		xhr.open("GET", "/getExpandedNavTreeNodes", true);
		xhr.send();
	},
	getXhr: function() {
		return new XMLHttpRequest();
	}
};

