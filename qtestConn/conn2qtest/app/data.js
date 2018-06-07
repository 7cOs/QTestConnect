
var data = {
	header: {
		logo: {
			ico: 'fa fa-database w3-xxlarge',
		},
		_title: 'QTestConn',
		desc: 'aufklärung: 2575 - observieren',
		actions: [{
			id: 'icoDisplayNav',
			ico: 'fa fa-navicon w3-xlarge'
		}]
	},
	navigator: {
		header: {
			ico: 'fa fa-navicon w3-large'
		},
		actions:[{
			id: 'expand_all',
			cls: 'fa fa-plus',
			type: 'nav_action',
			title: 'Expand All'
		},{
			id: 'collapse_all',
			cls: 'fa fa-minus',
			type: 'nav_action',
			title:'Collapse All'
		},{
			id: 'nav_refresh',
			cls: 'fa fa-refresh',
			type: 'nav_action',
			title: 'Refresh'
		},{
			id: 'nav_search',
			cls: 'fa fa-search',
			type: 'nav_action',
			title: 'Search'
		}]
	},
	_progress: {
		ico: 'fa fa-spinner fa-spin',
		msg: 'Loading...'
	},
	footer: {
		companyInfo: 'rege-it solutions, professional llc &copy;7012'
	}
};