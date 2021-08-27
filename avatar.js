class Avatar {

	constructor(pos, mesh) {
		this.pos = pos.clone();
		this.vel = new THREE.Vector3();
		this.force = new THREE.Vector3();
		this.MAXSPEED = 50;
		this.ARRIVAL_R = 30;
			
		this.size = 3;    
		this.angle = 0; // for orientable agent
		this.mesh = mesh;
		scene.add (mesh);

		this.target = null;
		this.steermode = '';
		this.BRAKING = 0; // no brake
		
		   
	}
  
	update(dt) {
		
		this.accumulateForce();
		
		let obs = scene.obstacles;

		// pick the most threatening one
		let theOne = null;
		let dist = 1e10;
		let vhat = this.vel.clone().normalize();
		const REACH = 100;
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
					theOne = obs[i];
					dist = proj;
					perp.setLength (K*overlap);
					perp.negate();
				}
			}
		}
		if (theOne)
		   this.force.add (perp);
		
		this.vel.add(this.force.clone().multiplyScalar(dt));

		// ARRIVAL: velocity modulation
		if (this.target !== null) {
            let diff = this.target.clone().sub(this.pos)
            let dst = diff.length()-15;     // dst < radius *2 
            if (dst < this.ARRIVAL_R) {
                this.vel.setLength(dst);
            }
        }
			
		// MAXSPEED modulation
		let speed = this.vel.length()
		this.vel.setLength(Math.clamp (speed, 0, this.MAXSPEED));
		this.pos.add(this.vel.clone().multiplyScalar(dt));
		this.mesh.position.copy(this.pos);
			
		// for orientable agent
		if (this.vel.length() > 1.0) {   // tuning
			this.angle = Math.atan2 (-this.vel.z, this.vel.x)
			this.mesh.rotation.y = this.angle
		}
	}
	
	setSeekTarget (x,y,z) {
		this.BRAKING = 0; // release Brake while seek
		this.steerMode = 'SEEK';
		this._setTarget (x,y,z);	
	}
  
	setFleeTarget (x,y,z) {
		this.BRAKING = 0; // release Brake while flee
		this.steerMode = 'FLEE';
		this._setTarget (x,y,z);	
	}
  
	_setTarget(x,y,z) {  // do not use outside class
		if (this.target !== null)
			this.target.set(x,y,z);
		else {
			this.target = new THREE.Vector3(x,y,z);
		}
	}
  
	targetInducedForce (targetPos) { 
		let sign = 0;
		if (this.steerMode === 'SEEK')
			sign = 1;
		else if (this.steerMode === 'FLEE')
			sign = -1;
		return targetPos.clone().sub(this.pos).normalize().multiplyScalar(sign*this.MAXSPEED).sub(this.vel);
	}

	setBrake (brake) {  // make the avatar stop gracefully
		this.BRAKING = brake;  	
		this.target = null;  // release target
	}

	accumulateForce() {
		if (this.target) 
			this.force.copy(this.targetInducedForce (this.target));
		else
			this.force.set (0,0,0);  // for null-target initial force
    	
		let push = new THREE.Vector3();
		for (let i = 0; i < this.nbhd.length; i++) {
			let point = this.pos.clone().sub(this.nbhd[i].pos);
			push.add(point.setLength(120 / point.length()));
		}
		this.force.add(push);
		// braking ...
		this.force.add (this.vel.clone().multiplyScalar(-this.BRAKING));
	}

}
