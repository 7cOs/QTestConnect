
var style = {
	setStyles: function() {
		var s = q('head').add('style');
		var ss = d.styleSheets[d.styleSheets.length-1];
		
		ss.insertRule('ci layout {height: 100%; display: flex; flex-direction: column; font-family:arial; font-size:11px; /*border: solid;*/}');
		ss.insertRule('ci layout header {padding: 7px; background-color: hsl(180, 20%, 30%); color: rgb(255,255,255);}');
		ss.insertRule('ci layout header > quadrants {display: flex; flex-direction: row; align-items: center;}');
		ss.insertRule('ci layout quadrant#header {flex: 1px;}');
		ss.insertRule('ci layout quadrant#header logo {margin-left: 5px; margin-right: 7px;}');
		ss.insertRule('ci layout header _title {font-weight: bold; font-size: 29px;}');
		ss.insertRule('ci layout header desc {display: block; letter-spacing: 2.1px;}');
		ss.insertRule('ci layout header > actions {}' );
		ss.insertRule('ci layout header > action {margin-right: 5px; cursor: pointer;}');
		
		ss.insertRule('ci layout main > actions {border:solid; display: none;}');
		
		ss.insertRule('ci layout main {display: flex; flex: 1; border:solid; flex-direction: column;}');
		ss.insertRule('ci layout main > quadrant {display: flex; flex: 1; flex-direction: row;}');
		ss.insertRule('ci layout main > quadrant > contents {display: flex; flex: 1; flex-direction: column;');
		ss.insertRule('ci layout main > quadrant > contents quadrants {display: flex; flex-direction: column;}');
		ss.insertRule('ci layout main > quadrant > contents quadrants > info {; height: 100%; display: flex; flex-direction: column;}');
		ss.insertRule('ci layout main > quadrant > contents info > header {display: flex; align-items: center;}');
		ss.insertRule('ci layout main > quadrant > contents info > header > ico {margin-right: 11px;}');
		ss.insertRule('ci layout main > quadrant > contents info > header _details {flex: 1;}');
		ss.insertRule('ci layout main > quadrant > contents info > header _details summary {display:flex; flex-direction: column;}');
		ss.insertRule('ci layout main > quadrant > contents info > header _details summary _title {font-size: 21px;}');
		ss.insertRule('ci layout main > quadrant > contents info > header _details summary lastUpdated {font-style: italic;}');
		ss.insertRule('ci layout main > quadrant > contents info > header > actions {display: flex; font-direction: row;}');
		ss.insertRule('ci layout main > quadrant > contents info > header > actions desc {display: inline;}');
		ss.insertRule('ci layout main > quadrant > contents info > header > actions > action {padding: 7px; margin-right: 3.997px;}');
		ss.insertRule('ci layout main > quadrant > contents info > header > actions > action {border: solid 2px; border-radius: 7px; cursor: pointer;}');
		ss.insertRule('ci layout main > quadrant > contents info > header > actions > action ico {margin-right: 3.9px;}');
		ss.insertRule('ci layout main > quadrant > contents info > tabbar {background-color: hsl(180, 20%, 30%); color: rgb(255,255,255); padding: 7px; border-top: solid 2px black;}');
		ss.insertRule('ci layout main > quadrant > contents info > tabbar > tab {margin-right: 37.5px; font-weight: bold; cursor: pointer;}');
		
		ss.insertRule('ci layout main > quadrant > contents info contents { flex: 1; margin-top: 11px;}');
		
		ss.insertRule('ci layout main > quadrant > contents info > contents tabContainer {display: flex; flex-direction: column;}');
		ss.insertRule('ci layout main > quadrant > contents info > contents tabContainer > tabs {display: flex; align-items: center; /*border-bottom: solid 1.75px;*/}');
		ss.insertRule('ci layout main > quadrant > contents info > contents tabContainer tabs > tab {text-align: center; padding: 7.97px;}');
		ss.insertRule('ci layout main > quadrant > contents info > contents tabContainer tabs > tab {background-color: hsl(180, 20%, 30%);}');
		ss.insertRule('ci layout main > quadrant > contents info > contents tabContainer tabs > tab {color: rgb(255,255,255); margin-right: 2px;}');
		ss.insertRule('ci layout main > quadrant > contents info > contents tabContainer tabs > tab {width: 177px; cursor: pointer;}');
		ss.insertRule('ci layout main > quadrant > contents info > contents tabContainer tabs > tab {border-top: solid 3px transparent;}');
		ss.insertRule('ci layout main > quadrant > contents info > contents tabContainer tabTitleContainer {background-color: hsl(180, 20%, 30%);}');
		ss.insertRule('ci layout main > quadrant > contents info > contents tabContainer tabTitleContainer {color: rgb(255,255,255); font-weight: bold; padding: 7px;}');
		
		ss.insertRule('ci layout main > quadrant > contents info > contents tabContainer > tabContents {display: flex; flex-direction: column; padding: 5px;}');
		
		ss.insertRule('ci layout main > quadrant > navigator {width: 21%; display: flex; flex-direction: column; border-left: solid black;}');
		ss.insertRule('ci layout main > quadrant > navigator quadrants {display: flex; flex-direction: column;}');
		ss.insertRule('ci layout main > quadrant > navigator quadrants > header {padding: 9.979px;}');
		ss.insertRule('ci layout main > quadrant > navigator quadrants > contents {height: 100%; overflow: auto; white-space: nowrap;}');
		ss.insertRule('::-webkit-scrollbar { width: 9.9px; height: 9.9px; }');
		ss.insertRule('::-webkit-scrollbar-track { background: #f1f1f1; }');
		ss.insertRule('::-webkit-scrollbar-thumb { background: #888;}');
		ss.insertRule('::-webkit-scrollbar-thumb:hover { background: #555; }');
		ss.insertRule('ci layout main > quadrant > navigator quadrants > contents::-webkit-scrollbar-button:vertical:decrement {background: #8bc34a!important;}');
		ss.insertRule('ci layout main > quadrant > navigator quadrants > contents::-webkit-scrollbar-button:horizontal:increment {background: #8bc34a!important;}');
		ss.insertRule('ci layout main > quadrant > navigator quadrants > contents::-webkit-scrollbar-button:vertical:increment {background: #8bc34a!important;}');
		ss.insertRule('ci layout main > quadrant > navigator quadrants > contents::-webkit-scrollbar-button:horizontal:decrement {background: #8bc34a!important;}');
		
		ss.insertRule('ci layout _progress {background-color: hsl(180, 20%, 25%); color: rgb(255,255,255); padding: 7px;}');
		ss.insertRule('ci layout _progress > quadrants quadrant#progressInfo {display: none; text-align: center; font-size: 11.979px;}');
		ss.insertRule('ci layout _progress > quadrants quadrant#progressInfo > ico {font-size: 17px; margin-right: 5px;}');
		
		ss.insertRule('ci layout footer {background-color: hsl(180, 20%, 30%); color: rgb(255,255,255); padding: 7px;}');
		ss.insertRule('ci layout footer  quadrant#footerContents {display:block; text-align: center;}');
	}
}