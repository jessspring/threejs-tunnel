import { BackSide, CylinderGeometry, FrontSide, Mesh, MeshPhongMaterial, PlaneGeometry, RepeatWrapping, TextureLoader } from "three";
import { BufferGeometryUtils } from "three/examples/jsm/Addons.js";

export function createFloor() {
    const geometry = new PlaneGeometry(1, 100);
    geometry.rotateX(-Math.PI / 2);

    const loader = new TextureLoader();
    const mesh = new Mesh(geometry, new MeshPhongMaterial({
        map: loader.load("assets/images/stone_floor_1_albedo.jpg"),
        normalMap: loader.load("assets/images/stone_floor_1_normal.jpg"),
        side: FrontSide
    }));
    mesh.receiveShadow = true;
    [mesh.material.map, mesh.material.normalMap, mesh.material.displacementMap].forEach(x => {
        if (x == null)
            return;

        x.wrapS = RepeatWrapping;
        x.wrapT = RepeatWrapping;
        x.repeat.set(1, 100);
    });

    return mesh;
}

export function createWalls() {
    const geometry1 = new PlaneGeometry(100, 10);
    geometry1.rotateY(-Math.PI / 2);
    geometry1.translate(0.5, 0, 0);
    const geometry2 = new PlaneGeometry(100, 10);
    geometry2.rotateY(Math.PI / 2);
    geometry2.translate(-0.5, 0, 0);

    const loader = new TextureLoader();
    const normal = loader.load("assets/images/stone_wall_1_normal.jpg");
    const albedo = loader.load("assets/images/stone_wall_1_albedo.jpg");

    [albedo, normal].forEach(x => {
        x.wrapS = RepeatWrapping;
        x.wrapT = RepeatWrapping;
        x.repeat.set(50, 10);
    });

    const material = new MeshPhongMaterial({
        map: albedo,
        normalMap: normal,
        side: FrontSide
    });

    const merged = BufferGeometryUtils.mergeGeometries([geometry1, geometry2]);
    merged.computeVertexNormals();
    merged.computeTangents();

    const mesh = new Mesh(merged, material);
    mesh.receiveShadow = true;

    return mesh;
}

export function createCeiling() {
    const geometry = new CylinderGeometry(1, 1, 100, 32, 1, true, Math.PI - 0.6, 1.2);
    geometry.rotateX(Math.PI / 2);
    geometry.translate(0, 0.47, 0);

    const loader = new TextureLoader();
    const normal = loader.load("assets/images/stone_ceiling_1_normal.jpg");
    const albedo = loader.load("assets/images/stone_ceiling_1_albedo.jpg");

    [albedo, normal].forEach(x => {
        x.wrapS = RepeatWrapping;
        x.wrapT = RepeatWrapping;
        x.repeat.set(50, 1);
        x.rotation = Math.PI / 2;
        // x.repeat.set(1, 50);
    });

    const material = new MeshPhongMaterial({
        map: albedo,
        normalMap: normal,
        side: BackSide
    });

    const mesh = new Mesh(geometry, material);
    mesh.receiveShadow = true;

    return mesh;
}
