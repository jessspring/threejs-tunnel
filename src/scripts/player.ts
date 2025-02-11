import { playFootstep } from "./audio";
import * as Input from "./input";
import { AudioListener, CylinderGeometry, Mesh, PerspectiveCamera, PointLight, SpotLight, TextureLoader, Vector3 } from "three";

export class Player {
    constructor(position: Vector3) {
        //Player mesh
        this.mesh = new Mesh(new CylinderGeometry(1, 1, 1), undefined);
        this.mesh.position.copy(position);

        //Camera
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.mesh.add(this.camera);

        //Lights
        this.pointLight = this.createPointLight();
        this.mesh.add(this.pointLight);

        this.spotLight = this.createSpotLight();
        this.mesh.add(this.spotLight);
        this.camera.add(this.spotLight.target);

        //Audio
        this.audioListener = new AudioListener();
        this.camera.add(this.audioListener);
    }

    private camera: PerspectiveCamera;
    private mesh: Mesh;
    private pointLight: PointLight;
    private spotLight: SpotLight;
    private stepAccumulator: number = 0;
    private audioListener: AudioListener;

    private stepUp = false;

    update() {
        this.movement();
    }

    private movement() {
        const isRunning = Input.isKeyDown("ShiftLeft");
        const speed = isRunning ? 0.02 : 0.01;
        let stepX = 0;
        let stepZ = 0;

        if (Input.isKeyDown("KeyW")) {
            this.mesh.translateZ(-speed);
            stepZ -= 1;
        }
        if (Input.isKeyDown("KeyS")) {
            this.mesh.translateZ(speed);
            stepZ += 1;
        }
        if (Input.isKeyDown("KeyA")) {
            this.mesh.translateX(-speed);
            stepX -= 1;
        }
        if (Input.isKeyDown("KeyD")) {
            this.mesh.translateX(speed);
            stepX += 1;
        }
        // if (Input.isKeyDown("Space"))
        //     this.mesh.translateY(speed);
        // if (Input.isKeyDown("ControlLeft"))
        //     this.mesh.translateY(-speed);

        if (Math.abs(stepX) + Math.abs(stepZ) > 0)
            this.stepAccumulator += isRunning ? 0.04 : 0.02;

        if (this.stepUp && Math.sin(this.stepAccumulator * 3) < -0.8) {
            playFootstep(this.audioListener);
            this.stepUp = false;
        }
        if (!this.stepUp && Math.sin(this.stepAccumulator * 3) > 0.8)
            this.stepUp = true;

        this.mesh.position.setY(0.9 + Math.sin(this.stepAccumulator * 3) / 50);

        //Collision detection
        if (false)
            this.collision();

        if (!Input.isMouseLocked())
            return;

        const mouseMovement = Input.getMouseMovement();

        this.mesh.rotateY(-mouseMovement.x / 100);
        this.camera.rotateX(-mouseMovement.y / 100);

        if (this.camera.rotation.x > Math.PI / 2)
            this.camera.rotation.x = Math.PI / 2;
        if (this.camera.rotation.x < -Math.PI / 2)
            this.camera.rotation.x = -Math.PI / 2;
    }

    private createPointLight() {
        const light = new PointLight(0xffffff, 0.0133, 50, 0);
        light.position.set(0, 1, 0);
        light.castShadow = true;
        light.shadow.camera.near = 0.0001;

        return light;
    }

    private createSpotLight() {
        const light = new SpotLight(0xffffff, 1, 10, 0.6, 1, 1);
        light.target.position.set(0, 0, -1);
        light.position.set(0, 0, 0);
        light.castShadow = true;
        light.shadow.camera.near = 0.0001;
        light.map = new TextureLoader().load("assets/images/flashlight4.png");

        return light;
    }

    private collision() {
        const boundsXn = -0.3;
        const boundsXp = +0.3;

        if (this.mesh.position.x < boundsXn)
            this.mesh.position.x = boundsXn;
        if (this.mesh.position.x > boundsXp)
            this.mesh.position.x = boundsXp;

        const boundsZn = -25;
        const boundsZp = +25;
        const teleDist = 50;

        if (this.mesh.position.z < boundsZn)
            this.mesh.position.z += teleDist;
        if (this.mesh.position.z > boundsZp)
            this.mesh.position.z -= teleDist;
    }

    getMesh() { return this.mesh; }
    getCamera() { return this.camera; }
    getSpotLight() { return this.spotLight; }
    getAudioListener() { return this.audioListener; }
}
