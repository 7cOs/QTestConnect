
function setStyles() {
	var s = q('head').add('style');
	var ss = d.styleSheets[d.styleSheets.length-1];
	ss.insertRule('ci layout {height: 100%; display: flex; flex-direction: column; font-family:arial; font-size:11px; border: solid;}');
	ss.insertRule('ci layout header {padding: 7px;}');
	ss.insertRule('ci layout header ico {margin-right: 5px;}');
	ss.insertRule('ci layout header _title {font-weight: bold; font-size: 29px;}');
	ss.insertRule('ci layout main {display: flex; flex: 1; border:solid; flex-direction: column;}');
	ss.insertRule('ci layout main > actions {border:solid;}');
	ss.insertRule('ci layout main > quadrant {display: flex; flex: 1; flex-direction: row; border: solid;}');
	ss.insertRule('ci layout main > quadrant > contents {display: flex; flex: 1; flex-direction: column; border: solid;}');
	/*ss.insertRule('ci layout {height:100%; display:flex; flex-direction: column; border: solid; }');
	ss.insertRule('ci layout > contents {display: block; flex-direction: column; flex: 1; border: solid; }');
	ss.insertRule('ci layout > contents header quadrants {display:flex; align-items: center; background-color: hsl(180, 20%, 30%); color: rgb(255,255,255); padding:7px;}');
	ss.insertRule('ci layout > contents header quadrants #header {flex: 1;}');
	ss.insertRule('ci layout > contents header quadrants #header ico {color: silver; margin-right: 7px;}');
	ss.insertRule('ci layout > contents header quadrants #header _title {font-weight: bold; font-size: 27px;}');
	ss.insertRule('ci layout > contents header quadrants #header desc {display: block; letter-spacing: 2.7;}');
	 */
}