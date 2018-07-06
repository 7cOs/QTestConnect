var d, doc, ci;

function init() {
	d = document, doc = d;
	
	q=function( q ) { return d.querySelector( q ); };
	qs=function( q ) { return d.querySelectorAll( q ); };
	
	// - Set - //
	ci = doc.body; 
	ci.id = 'ci';

	d.create = document.createElement;
	
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
	
	Element.prototype.hinzu = Element.prototype.add;
	
	Element.prototype.q = function( q ) {
		return this.querySelector( q );
	};
	
	Element.prototype.qs = function( q ) {
		return this.querySelectorAll( q );
	};
	
	Element.prototype.clear = function() {
		this.textContent = '';
	};
	
	Element.prototype.rinse = Element.prototype.clear;
	
	Element.prototype.spulen = Element.prototype.rinse;
	
	Element.prototype.show = function( ) {
		this.style.display = '';
	};
	
	Element.prototype.hide = function( ) {
		this.style.display = 'none';
	};
	
	Element.prototype.suspend = function( ) {
		this.style.display = 'none';
	};

	Element.prototype.verbergen = Element.prototype.hide;
	
	Element.prototype.zeigen = Element.prototype.show;
	
	Element.prototype.isDisplayed = function() {
		return this.style.display == '';
	};
	
	Element.prototype.txt = function( t ) {
		this.textContent = t;
	};	
	
	Element.prototype.htm = function( h ) {
		this.innerHTML = h;
	};

	Element.prototype.kilsof = function(o) {
		o ? o.progen.removeChild(o) : null;
	};
	
	Element.prototype.euthanise = function() {
		// this.progen.removeChild()
	};
	/** 
	 * let d2c be drift-to-center of h (host) passed to the element 
	 * let h be host or der Gastgeber
	 */
	Element.prototype.d2c = function( h ) {
		var size = {
		  width: window.innerWidth || document.body.clientWidth,
		  height: window.innerHeight || document.body.clientHeight
		};
		// - Add to host - //
		h.hinzufugen( this );

		var r = h.getBoundingClientRect();
		var c = this.getBoundingClientRect();
		
		var _x = (size.width/2) - (c.width/2);
		var _y = size.height/2 - c.height/2;
		
		with( this.style ) {
			position = 'absolute';
			left = _x;
			top = _y;
		}
	};
	/** Let nN be nodeName */
	Element.prototype.nN = function() {
		return this.nodeName.toLowerCase();
	};
	/** Let scrollenDeaktivieren be disable scrolling */
	Element.prototype.scrollenDeaktivieren = function() {
		this.style.overflow = 'hidden';
	};
	/** Let scrollenAktivieren be enable scrolling */
	Element.prototype.scrollenAktivieren = function() {
		this.style.overflow = 'auto';
	};
	
	// - Displace (Temp) - //
	ci.suspend();
}
