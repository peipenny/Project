function agentMesh (scale=1, _color='cyan') {

    var loader = new THREE.TextureLoader();
    loader.setCrossOrigin ('');
    let woodTex = loader.load ('https://i.imgur.com/DrvlmNW.jpg?1');
    var captain = new THREE.Group();

    let captainRing = new THREE.Mesh (new THREE.CylinderGeometry(10,10,4,20, 1, true), new THREE.MeshBasicMaterial({map: woodTex, side:THREE.DoubleSide}));
    captainRing.position.y = 3;
    captain.add (captainRing);
    
    return captain;
}

function agentMesh1(scale=1, _color='cyan') {

    let loader = new THREE.TextureLoader();
    let icon = loader.load('https://i.imgur.com/LvdEFJb.png');
    var car = new THREE.Group();
    let woodTex = loader.load ('https://i.imgur.com/DrvlmNW.jpg?1');
    var mat = new THREE.MeshNormalMaterial({map: woodTex});
    
    var body = new THREE.Mesh(new THREE.CylinderGeometry(8, 8, 4, 20,1,true),  new THREE.MeshBasicMaterial({map: woodTex, side:THREE.DoubleSide}));
    var pointer = new THREE.Mesh(new THREE.BoxGeometry(15, 2, 2),  new THREE.MeshBasicMaterial({map: woodTex, side:THREE.DoubleSide}));
    body.position.y = 2;
    pointer.position.set (5, 2, 0);

    // '帥'蓋
    let iconZX = new THREE.Group();
    let circle = new THREE.Mesh (new THREE.CircleGeometry(8,64), new THREE.MeshBasicMaterial({map:icon}));
    circle.position.y = 4;
    circle.rotation.x = -Math.PI/2;
    iconZX.add (circle);
    tachometer = makeTachometer(10);
	tachometer1 = makeTachometer1(10);
    tachometer.position.y = 10;
	tachometer1.position.y = 8;
    car.add(iconZX, pointer, body,tachometer,tachometer1);
    return car;
    
}
// blood
function makeTachometer (L) {
	var bar = new THREE.Group();
	let base = new THREE.Mesh(new THREE.PlaneGeometry(L, 2), new THREE.MeshBasicMaterial({
		polygonOffset: true,
		polygonOffsetFactor: 1.0,  // push to far
		polygonOffsetUnits: 4.0, 
		side:THREE.DoubleSide
	}));

	let _bar = new THREE.Group();
	let blood = new THREE.Mesh(new THREE.PlaneGeometry(L, 1), new THREE.MeshBasicMaterial({
		color: 'red', 
		side:THREE.DoubleSide
	}));
	_bar.add(blood);
	blood.position.x = L/2;
	_bar.scale.x = 0.5;  // adjustment key

	bar.add(_bar, base);	
	_bar.position.x = -L/2;
	return bar;
}
// N2 
function makeTachometer1 (L) {
	var bar = new THREE.Group();
	let base = new THREE.Mesh(new THREE.PlaneGeometry(L, 2), new THREE.MeshBasicMaterial({
		polygonOffset: true,
		polygonOffsetFactor: 1.0,  // push to far
		polygonOffsetUnits: 4.0, 
		side:THREE.DoubleSide
	}));

	let _bar = new THREE.Group();
	let blood = new THREE.Mesh(new THREE.PlaneGeometry(L, 1), new THREE.MeshBasicMaterial({
		color: 'cyan', 
		side:THREE.DoubleSide
	}));
	_bar.add(blood);
	blood.position.x = L/2;
	_bar.scale.x = 1;  // adjustment key

	bar.add(_bar, base);	
	_bar.position.x = -L/2;
	return bar;
}
function makeTachometerHUD (L) {
	var bar = new THREE.Group();
	let base = new THREE.Mesh(new THREE.PlaneGeometry(L, 0.5), new THREE.MeshBasicMaterial({
		polygonOffset: true,
		polygonOffsetFactor: 1.0,  // push to far
		polygonOffsetUnits: 4.0, 
		side:THREE.DoubleSide
	}));

	let _bar = new THREE.Group();
	let blood = new THREE.Mesh(new THREE.PlaneGeometry(L, 0.3), new THREE.MeshBasicMaterial({
		color: 'cyan', 
		side:THREE.DoubleSide
	}));
	_bar.add(blood);
	blood.position.x = L/2;
	_bar.scale.x = 1;  // adjustment key

	bar.add(_bar, base);	
	_bar.position.x = -L/2;
	return bar;
}
function makeTachometerHUD1 (L) {
	var bar = new THREE.Group();
	let base = new THREE.Mesh(new THREE.PlaneGeometry(L, 0.5), new THREE.MeshBasicMaterial({
		polygonOffset: true,
		polygonOffsetFactor: 1.0,  // push to far
		polygonOffsetUnits: 4.0, 
		side:THREE.DoubleSide
	}));

	let _bar = new THREE.Group();
	let blood = new THREE.Mesh(new THREE.PlaneGeometry(L, 0.3), new THREE.MeshBasicMaterial({
		color: 'red', 
		side:THREE.DoubleSide
	}));
	_bar.add(blood);
	blood.position.x = L/2;
	_bar.scale.x = 1;  // adjustment key

	bar.add(_bar, base);	
	_bar.position.x = -L/2;
	return bar;
}

function stateSign () {

    let loader = new THREE.TextureLoader();
    let idleMap = loader.load ("https://i.imgur.com/OKdA2Do.png");
    let fleeMap = loader.load ("https://i.imgur.com/jCoIxWr.png");
    
    let haltMap = loader.load ("https://i.imgur.com/9t9soIZ.png");
    let saveMap = loader.load ("https://i.imgur.com/jd2bSs5.png");
    let fleeMap1 = loader.load ("https://i.imgur.com/O6DJtmq.png");
	let saveMap1 = loader.load ("https://i.imgur.com/a8AT4db.png");
    
    let idleMesh = new THREE.Mesh (new THREE.CircleGeometry(10,20), new THREE.MeshBasicMaterial(
        {map: idleMap, transparent: true, alphaTest: 1, side:THREE.DoubleSide}));
    let fleeMesh = new THREE.Mesh (new THREE.CircleGeometry(10,20), new THREE.MeshBasicMaterial(
        {map: fleeMap, transparent: true, alphaTest: 1, side:THREE.DoubleSide}));
    let haltMesh = new THREE.Mesh (new THREE.CircleGeometry(10,20), new THREE.MeshBasicMaterial(
        {map: haltMap, transparent: true, alphaTest: 1, side:THREE.DoubleSide}));    
    let saveMesh = new THREE.Mesh (new THREE.CircleGeometry(10,20), new THREE.MeshBasicMaterial(
        {map: saveMap, transparent: true, alphaTest: 1, side:THREE.DoubleSide}));
    let fleeMesh1 = new THREE.Mesh (new THREE.CircleGeometry(10,20), new THREE.MeshBasicMaterial(
        {map: fleeMap1, transparent: true, alphaTest: 1, side:THREE.DoubleSide}));    
    let saveMesh1 = new THREE.Mesh (new THREE.CircleGeometry(10,20), new THREE.MeshBasicMaterial(
        {map: saveMap1, transparent: true, alphaTest: 1, side:THREE.DoubleSide}));    
    let humanstateSign = new THREE.Group();
    humanstateSign.add (idleMesh,fleeMesh,haltMesh,saveMesh,fleeMesh1,saveMesh1);
    return humanstateSign;
    
}