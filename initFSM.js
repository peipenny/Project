function initFSM () {

	let fsm = new StateMachine({
		init: 'idle',
		transitions: [
			{ name: 'approach', from: 'idle', to: 'flee' },
			{ name: 'depart',   from: 'flee', to: 'idle'},
			{ name: 'halt',     from: 'flee', to: 'stop'},
			{ name: 'saved',    from: 'stop', to: 'idle'},

		]
	});
  
	return fsm; 
}