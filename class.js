class Agent {
	constructor(pos, mesh , fsm) {
	
		this.fsm = fsm;  // AI engine
		this.pos = pos.clone();
		this.vel = new THREE.Vector3();
		this.force = new THREE.Vector3();
		this.ghost = null;
		this.mesh = mesh;
		scene.add (mesh);

		this.MAXSPEED = 70;

		// for orientable agent
		this.angle = 0;
	}
	update(dt) {
		this.accumulateForce();

		let obs = scene.obstacles;

		// pick the most threatening one
		let theOne = null;
		let dist = 1e10;
		let vhat = this.vel.clone().normalize();
		const REACH = 50;
		const K = 5;
		let perp;
		
		for (let i = 0; i < obs.length; i++) {
			let point = obs[i].center.clone().sub (this.pos) // c-p
			let proj  = point.dot(vhat);
			if (proj > 0 && proj < REACH) {
				perp = new THREE.Vector3();
				perp.subVectors (point, vhat.clone().setLength(proj));
				let overlap = obs[i].size + this.size - perp.length();
				if (overlap > 0 && proj < dist) {
					theOne = obs[i]
					dist = proj
					perp.setLength (K*overlap);
					perp.negate()
				}
			}
		}
		if (theOne)
		   this.force.add (perp);

		this.vel.add(this.force.clone().multiplyScalar(dt));
		
		this.pos.add(this.vel.clone().multiplyScalar(dt));
		this.mesh.position.copy(this.pos);

		// for orientable agent
		// non PD version
		if (this.vel.length() > 1) {
			this.angle = Math.atan2 (-this.vel.z, this.vel.x);
			this.mesh.rotation.y = this.angle;
		}		
		
	}
	setghost(x,y,z) {
		if (this.ghost)
			this.ghost.set(x,y,z);
		else
			this.ghost = new THREE.Vector3(x,y,z);
	}
	ghostAvoidForce(ghostPos) {	 // seek
		return ghostPos.clone().sub(this.pos).normalize().multiplyScalar(this.MAXSPEED).multiplyScalar(-1).sub(this.vel);
		
	}
	setFSMRun(){
		$('#state').text("Flee!!!!");
		$('#state').css('color', 'green');
		this.fsm.run();
		this.mesh.material.color.setHex( 0x18851b );
	}
	setFSMStop(){
		$('#state').text("Idle....");
		$('#state').css('color', 'red');
		this.fsm.stop();
		this.mesh.material.color.setHex( 0xf54242 ) ;
	}
	accumulateForce() {
		
		des = new THREE.Vector3(0,0,0);
		if (this.ghost !== null)
			des = agents[0].pos.distanceTo(this.ghost);
			
		if (this.ghost !== null){
			if(des<60)this.force.copy(this.ghostAvoidForce(this.ghost));
		}		
		
		/////////////////////////////
		let state = this.fsm.state;
		console.log(this.fsm.state);
		
		if(des<80&&state==='idle'){
			this.setFSMRun();
			let push = new THREE.Vector3();
			for (let i = 0; i < 1; i++) {
				let point = this.pos.clone();
				push.add(point.setLength(120 / point.length()));
			}
			this.force.add(push);
		}
		else if(des>80&&state==='flee'){
			this.setFSMStop();
			this.ghost = null;
			this.force.set(0,0,0);
			this.vel.set(0,0,0);
		}

	}

	distanceTo(otherAgent) {
		return this.pos.distanceTo(otherAgent.pos);
	}
	addNbr(otherAgent) {
		this.nbhd.push(otherAgent);
	}

}

class Ghost {
	constructor(pos, mesh) {
		this.pos = pos.clone();
		this.vel = new THREE.Vector3();
		this.force = new THREE.Vector3();
		this.mesh = mesh;
		this.target = null;
		scene.add (mesh);
		
		this.MAXSPEED = 100;
		this.angle = 0;
	}
	
	targetInducedForce(targetPos) {	 // seek
		return targetPos.clone().sub(this.pos).normalize().multiplyScalar(this.MAXSPEED).sub(this.vel);
	}
	
	setTarget(x,y,z) {
		if (this.target)
			this.target.set(x,y,z);
		else
			this.target = new THREE.Vector3(x,y,z);
	}
	
	update(dt) {
		if (this.target !== null)
			this.force.copy(this.targetInducedForce(this.target));
		
		let obs = scene.obstacles;

		// pick the most threatening one
		let theOne = null;
		let dist = 1e10;
		let vhat = this.vel.clone().normalize();
		const REACH = 50;
		const K = 5;
		let perp;
		
		for (let i = 0; i < obs.length; i++) {
			let point = obs[i].center.clone().sub (this.pos) // c-p
			let proj  = point.dot(vhat);
			if (proj > 0 && proj < REACH) {
				perp = new THREE.Vector3();
				perp.subVectors (point, vhat.clone().setLength(proj));
				let overlap = obs[i].size + this.size - perp.length();
				if (overlap > 0 && proj < dist) {
					theOne = obs[i]
					dist = proj
					perp.setLength (K*overlap);
					perp.negate()
				}
			}
		}
		if (theOne)
		   this.force.add (perp);

		this.vel.add(this.force.clone().multiplyScalar(dt));
		
		if (this.target !== null) {
			let diff = this.target.clone().sub(this.pos)
			let dst = diff.length();
			if (dst < this.ARRIVAL_R) {
				this.vel.setLength(dst);
			}
		}    
		
		this.pos.add(this.vel.clone().multiplyScalar(dt));
		this.mesh.position.copy(this.pos);

		// for orientable agent
		/*
		if (this.vel.length() > 1) {
			this.angle = Math.atan2 (-this.vel.z, this.vel.x);
			this.mesh.rotation.y = this.angle;
		}		
		*/
	}

}

class Obstacle {
	constructor (center,size) {
		this.center = center.clone();  
		this.mesh = new THREE.Mesh (new THREE.CylinderGeometry(size,size,1,20),
		new THREE.MeshBasicMaterial());
		this.mesh.position.copy (center);
		this.size = size;
		scene.add (this.mesh);
	}
}
