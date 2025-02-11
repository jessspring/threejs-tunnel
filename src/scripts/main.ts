import * as THREE from 'three';
import * as Input from './input';
import { Player } from './player';
import { createCeiling, createFloor, createWalls } from './geometry';
import { playBgm1, playBgm2 } from './audio';

let running = false;
document.addEventListener("pointerlockchange", () => {
    if (!running && document.pointerLockElement === document.body) {
        running = true;
        main();
    }
}, false);

function main() {
    //Scene setup
    const renderer = createRenderer();
    const scene = createScene();
    const clock = new THREE.Clock();
    // scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const player = new Player(new THREE.Vector3(0, 0, 0));
    scene.add(player.getMesh());

    scene.add(createFloor());
    scene.add(createWalls());
    scene.add(createCeiling());

    const bgm1 = playBgm1(player.getAudioListener());
    let bgm2: { filter: BiquadFilterNode, sound: THREE.Audio<GainNode> } | null = null;

    renderer.setAnimationLoop(animate);

    function animate() {
        const delta = clock.getDelta();

        player.update();

        renderer.render(scene, player.getCamera());
        Input.update();

        //Audio
        bgm1.frequency.value = Math.min(bgm1.frequency.value + (delta * 2), 24000);

        if (bgm2 == null && clock.getElapsedTime() > 30)
            bgm2 = playBgm2(player.getAudioListener());

        if (bgm2 != null) {
            bgm2.filter.frequency.value = Math.min(bgm2.filter.frequency.value + (delta * 2), 24000);
            bgm2.sound.setVolume(Math.min(1, bgm2.sound.getVolume() + (delta / 30)));
        }
    }

    function createScene() {
        const backgroundColor = new THREE.Color().setHex(0x000000);
        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(backgroundColor, 5, 25);
        scene.background = new THREE.Color(backgroundColor);

        return scene;
    }

    function createRenderer() {
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        document.body.appendChild(renderer.domElement);

        return renderer;
    }
}
