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