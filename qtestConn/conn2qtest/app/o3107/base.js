var d, doc, ci;

function init() {
	d = document, doc = d;
	
	q=function( q ) { return d.querySelector( q ); };
	qs=function( q ) { return d.querySelectorAll( q ); };
	
	// - Set - //
	ci = doc.body;

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
	
	Element.prototype.hinzufugen = Element.prototype.add;
	
	Element.prototype.hin = Element.prototype.add;
	
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
	
	Element.prototype.suspend = function( ) {
		this.style.display = 'none';
	};
	
	Element.prototype.zeigen = function( ) {
		this.style.display = '';
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

	// - Displace (Temp) - //
	ci.suspend();
}