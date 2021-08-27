function init() {

	clock = new THREE.Clock();
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.z = 120;
	camera.position.y = 100;
	//gyro = new Gyroscope();
	//gyro.add(camera);
	
	var gridXZ = new THREE.GridHelper(240, 24, 'red', 'white');
	scene.add(gridXZ);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0x888888);

	var controls = new THREE.OrbitControls(camera, renderer.domElement);

	document.body.appendChild(renderer.domElement);

	/////////////////////////////////////////////////////////////////////
	let plane = new THREE.Mesh(new THREE.PlaneGeometry(260, 260), new THREE.MeshBasicMaterial({
	transparent: true,
	opacity: 0.5,
	visible: true
	}));
	scene.add(plane);
	plane.material.visible = false
	plane.rotation.x = -Math.PI / 2;
	/////////////////////////////////////////////////////////////////////
	
	sceneRTT = new THREE.Scene();
	cameraRTT = new THREE.OrthographicCamera(-4, 4, 4, -4, -10, 100);
	cameraRTT.position.z = 10;

	renderTarget = new THREE.WebGLRenderTarget(
		1024, 1024, {
			minFilter: THREE.LinearFilter,
			magFilter: THREE.NearestFilter,
			format: THREE.RGBFormat
		}
	);
	
	// width/height ratio
	whRatio = window.innerWidth/window.innerHeight;
	sceneHUD = new THREE.Scene();
	halfH = 10;
	halfW = halfH * whRatio;
	
	cameraHUD = new THREE.OrthographicCamera (-halfW,halfW, halfH,-halfH, -10,10);
	renderer.autoClear = false;
	///////////////////////////////////////////////////////////////////
	
	scene.obstacles = [];
	//scene.obstacles.push ( new Obstacle (new THREE.Vector3(50,0,50), 20) );
	//scene.obstacles.push ( new Obstacle (new THREE.Vector3(-50,0,40), 10) );
	//scene.obstacles.push ( new Obstacle (new THREE.Vector3(0,0,30), 15) );
	
	//////////////////////
	N2 = makeTachometerHUD(5);
	N2.position.set(-12, 8 , 0);
	blood = makeTachometerHUD1(5);
	blood.position.set(-12, 9 , 0);
	sceneHUD.add(N2);
	sceneHUD.add(blood);
	ghost = new Agent (new THREE.Vector3(0,0,0), agentMesh1 (2,'red'), 'ghost');

	
	for (let i = 0; i < 2; i++) {
		let human = new Agent (randomPosZX(-10,10),agentMesh (1,'cyan'), 'human', initFSM());
		human.stateSign = stateSign();
		scene.add (human.stateSign);
		humans.push(human);
	}
	for (let i = 0; i < NPUFFS; i++) {
		puff = new THREE.Mesh(new THREE.SphereGeometry(3, 20, 20),
			new THREE.MeshBasicMaterial({
				transparent: true,
				color: 'cyan'
			}));
		puffs.push(puff);
		puff.position.copy (ghost.pos);
		scene.add(puff);
	}
	//////////////////////

	speed = 5.0;
	angle = 0.0;
	clockOn = true;
	setTimeout (countDown, 0);
	counter = 50;
	updateTachometer (0.1);
}
function countDown() {
	if (clockOn === false) 
		return;
	else  // clock is still one: set next timeout
		setTimeout (countDown, 1000);

	$('#msg').text (counter);
	--counter;
  
	if (counter < 0){
		clockOn = false;
		$('#result').text ('YOU Lose!!!!');
		setTimeout(cancelAnimationFrame( id ),0);
	}
  	
}
function result(){
    
    result1 = 1 ;
    humans.forEach(function(human) {
        if (human.fsm.state !== 'stop')result1 = 0;
    })
    return result1;
}

function gasRecharge(){
	
	if(gas === 1 || speed === 25) return;
	gas += 0.000001;
	gas = clamp (gas,0,1);
	setTimeout(gasRecharge,0);
	
}
function gasRelease(){
	if( speed !== 25 || gas === 0){
		speed = 10; 
		$('#ghoststate').text ('normal mode');
		return;
	}

	gas -= 0.001;
	gas = clamp (gas,0,1);
	setTimeout(gasRelease,0);
	
}
function animate() {
    keyboard.update();
            
    if ( keyboard.pressed("left") ) {
        angle += 0.03;    
    }                   
    if ( keyboard.pressed("right") ){
        angle -= 0.03;    
    }
    if ( keyboard.pressed("up") ){
		if( gas >= 0.5 ){
			//console.log(gas);
			speed = 25;
			$('#ghoststate').text ('speedup mode');
			gasRelease();
		}
		else{
			$('#ghoststate').text ('gas is not enough');
		}
    }

    if ( keyboard.pressed("down") ){		
        speed = 10;
        $('#ghoststate').text ('normal mode');
    }
    if ( keyboard.pressed("space") ){  
        speed = 0;
        $('#ghoststate').text ('stop');
    }

	if(speed < 25 ){
		gasRecharge();
	}

    var dt = clock.getDelta();
    
    animate.distance = (animate.distance) ? animate.distance : 0;
	renderer.clear();
    id = requestAnimationFrame(animate);
    render();
    renderer.render (sceneHUD, cameraHUD);
    findNbhd(humans);

    ghost.update(dt*2);
    
    humans.forEach(function(human) { 
        human.update(dt);

        let distanceNow = ghost.pos.distanceTo (human.pos);
      
        let BW = 10;
        // event firing
        if (human.fsm.state === "flee" && distanceNow < animate.distance && distanceNow < 25){
            human.fsm.halt();
        }
            
        if (human.fsm.state === "flee" && distanceNow > animate.distance && distanceNow > 40+BW/2){
            human.fsm.depart();
        }    

        if (human.fsm.state === "idle" && distanceNow < animate.distance && distanceNow < 40-BW/2){
            human.fsm.approach(); 
        }
		

		
        let beSaved = 0;
        
        for (let i = 0; i < human.nbhd.length; i++) {
            if(human.distanceTo(human.nbhd[i])<20){
                beSaved = 1;
                break;
            }
        }
        
        if (human.fsm.state === "stop" && beSaved === 1){
            human.fsm.saved();
        }
              
        animate.distance = distanceNow;
        
    })
    
    if(result()){
        $('#result').text ('YOU WIN!!!!');
        //setTimeout(cancelAnimationFrame( id ),0);
    }
    
    updateTachometer (gasLevel); 
	updateTachometer1(gas);
	puffs[which % NPUFFS].position.copy(ghost.pos);
		for (let i = 0; i < NPUFFS; i++)
		puffs[(which+1+i)%NPUFFS].material.opacity = (i+1)/NPUFFS;

	++which;
}