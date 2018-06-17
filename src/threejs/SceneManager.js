import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import Boxes from "./Boxes";

export default canvas => {
    let radius = 600;
    let theta = 0;
    let mouse = new THREE.Vector2();
    let raycaster = new THREE.Raycaster();

    document.addEventListener("mousedown", onDocumentMouseDown, false);
    document.addEventListener("touchstart", onDocumentTouchStart, false);
    window.addEventListener("resize", onWindowResize, false);

    const screenDimensions = {
        width: canvas.width,
        height: canvas.height
    };

    const scene = buildScene();
    const renderer = buildRender(screenDimensions);
    const camera = buildCamera(screenDimensions);
    // Create new boxes and add them to the screen
    new Boxes(scene);

    function buildScene() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#eeeeee");

        return scene;
    }

    function buildRender({ width, height }) {
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;
        renderer.setPixelRatio(DPR);
        renderer.setSize(width, height);

        return renderer;
    }

    function buildCamera({ width, height }) {
        const aspectRatio = width / height;
        const fieldOfView = 70;
        const nearPlane = 1;
        const farPlane = 2000;
        const camera = new THREE.PerspectiveCamera(
            fieldOfView,
            aspectRatio,
            nearPlane,
            farPlane
        );

        camera.position.y = 300;
        camera.position.z = 500;

        return camera;
    }

    function update() {
        TWEEN.update();

        theta += 0.05;
        camera.position.x = radius * Math.sin(THREE.Math.degToRad(theta));
        camera.position.y = radius * Math.sin(THREE.Math.degToRad(theta));
        camera.position.z = radius * Math.cos(THREE.Math.degToRad(theta));
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onDocumentTouchStart(event) {
        event.preventDefault();

        event.clientX = event.touches[0].clientX;
        event.clientY = event.touches[0].clientY;
        onDocumentMouseDown(event);
    }

    function onDocumentMouseDown(event) {
        event.preventDefault();
        mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
            // Change color of name to color of obj
            const blockColor = intersects[0].object.material.color;
            document.getElementById("name").style.color = `rgb(
                ${blockColor.r * 255},
                ${blockColor.g * 255},
                ${blockColor.b * 255}
            )`;

            // Move the block to new random coordinates
            new TWEEN.Tween(intersects[0].object.position)
                .to(
                    {
                        x: Math.random() * 800 - 400,
                        y: Math.random() * 800 - 400,
                        z: Math.random() * 800 - 400
                    },
                    2000
                )
                .easing(TWEEN.Easing.Elastic.Out)
                .start();

            // Rotate the block a random amount
            new TWEEN.Tween(intersects[0].object.rotation)
                .to(
                    {
                        x: Math.random() * 2 * Math.PI,
                        y: Math.random() * 2 * Math.PI,
                        z: Math.random() * 2 * Math.PI
                    },
                    2000
                )
                .easing(TWEEN.Easing.Elastic.Out)
                .start();
        }
    }

    return {
        update,
        onWindowResize
    };
};
