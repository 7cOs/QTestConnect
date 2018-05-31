
function setStyles() {
	var s = q('head').add('style');
	var ss = d.styleSheets[d.styleSheets.length-1];
	ss.insertRule('ci {font-family:arial; font-size:11px;}');
	ss.insertRule('ci layout {height:100%; display:flex; /*border:solid;*/}');
	ss.insertRule('ci layout contents {display:flex; flex-direction:column;flex:1;}');
	ss.insertRule('ci layout info {flex:1;}');
	ss.insertRule('ci layout navigator {width:21%; display:flex; flex-direction:column; /*border-left:solid 1px hsl(180, 22%, 90%);*/ /*display:none;*/ }');
	ss.insertRule('ci layout navigator contents info {overflow: scroll; white-space: nowrap;}');
	ss.insertRule('ci layout navigator contents info::-webkit-scrollbar { width: 9px; }');
	ss.insertRule('ci layout navigator contents info::-webkit-scrollbar-track { box-shadow: grey 0px 0px 5px inset; /*border-radius: 10px;*/ }');
	ss.insertRule('ci layout navigator contents info::-webkit-scrollbar-thumb { background: rgb(51, 77, 77); /*border-radius: 10px;*/ }');
	ss.insertRule('ci layout navigator contents info::-webkit-scrollbar-thumb:hover { background: hsl(180, 20%, 25%); }');
	ss.insertRule('ci layout navigator contents info::-webkit-scrollbar-button:vertical:decrement { background: #8bc34a!important; }');
	ss.insertRule('ci layout navigator contents info::-webkit-scrollbar-button:vertical:increment { background: #8bc34a!important; }');
	ss.insertRule('ci layout navigator contents info::-webkit-scrollbar-button:horizontal:decrement { background: #8bc34a!important; }');
	ss.insertRule('ci layout navigator contents info::-webkit-scrollbar-button:horizontal:increment { background: #8bc34a!important; }');
	ss.insertRule('ci layout header {background-color: hsl(180, 20%, 30%); padding:7px; color: rgb(255,255,255);}');
	ss.insertRule('ci layout header _title ico {margin-right:7px; color:hsl(120, 60%, 40%);}');
	/*
	ss.insertRule('ci layout header _title {font-size:27px; font-weight:bold;}');
	ss.insertRule('ci layout header _title ico {margin-right:7px; color:hsl(120, 60%, 40%);}');
	ss.insertRule('ci layout header contents desc {letter-spacing: 2.1px;}');
	ss.insertRule('ci layout contents info { padding:7px; border-left:solid 1px hsl(180, 22%, 90%); }');
	ss.insertRule('ci layout navigator header > ico {padding: 7px; text-align:right;cursor:pointer;}');
	ss.insertRule('ci layout navigator contents info {font-family: tahoma; font-size: 11px;}');
	ss.insertRule('ci layout contents _progress {background-color: hsl(180, 20%, 25%);}');
	ss.insertRule('ci layout contents _progress contents {text-align:center; color: rgb(255,255,255); padding:7px;}');
	ss.insertRule('ci layout contents footer {background-color: hsl(180, 20%, 20%);}');
	ss.insertRule('ci layout contents footer contents {text-align:center; padding:7px; color:rgb(255,255,255);}');
	*/
}