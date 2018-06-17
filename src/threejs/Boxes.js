import * as THREE from "three";

export default scene => {
    const geometry = new THREE.BoxGeometry(75, 75, 75);

    const colors = ["#556272", "#4ecdc4", "#c8f463", "#ff6b6b", "#c54d60"];

    for (var i = 0; i < 30; i++) {
        var object = new THREE.Mesh(
            geometry,
            new THREE.MeshBasicMaterial({
                color: colors[i % colors.length],
                opacity: 1
            })
        );
        // Position the block in 3d space
        object.position.x = Math.random() * 800 - 400;
        object.position.y = Math.random() * 800 - 400;
        object.position.z = Math.random() * 800 - 600;
        // Scale the block
        object.scale.x = Math.random() * 2 + 1;
        object.scale.y = Math.random() * 2 + 1;
        object.scale.z = Math.random() * 2 + 1;
        // Rotate it in 3d space a random amount
        object.rotation.x = Math.random() * 2 * Math.PI;
        object.rotation.y = Math.random() * 2 * Math.PI;
        object.rotation.z = Math.random() * 2 * Math.PI;
        scene.add(object);
    }
};
