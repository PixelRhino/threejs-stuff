import {
    TextureLoader,
    Group,
    Vector2,
    RepeatWrapping,
    SRGBColorSpace,
    PlaneGeometry,
    ConeGeometry,
    SphereGeometry,
    MeshStandardMaterial,
    Mesh,
} from 'three';

const textureLoader = new TextureLoader();
const gridTexture = textureLoader.load('textures/grid.png');

export class World extends Group {
    #objectMap = new Map();

    constructor(width, height) {
        super();

        this.width = width;
        this.height = height;
        this.treeCount = 10;
        this.rockCount = 20;
        this.bushCount = 10;

        this.trees = new Group();
        this.rocks = new Group();
        this.bushes = new Group();
        this.add(this.trees);
        this.add(this.rocks);
        this.add(this.bushes);

        this.generate();
    }

    generate() {
        this.clear();
        this.createTerrain();
        this.createTrees();
        this.createRocks();
        this.createBushes();
    }

    clear() {
        if (this.terrain) {
            this.terrain.geometry?.dispose();
            this.terrain.material?.dispose();
            this.remove(this.terrain);
        }

        if (this.trees) {
            this.trees.children.forEach((child) => {
                child.geometry?.dispose();
                child.material?.dispose();
            });
            this.trees.clear();
        }

        if (this.rocks) {
            this.rocks.children.forEach((child) => {
                child.geometry?.dispose();
                child.material?.dispose();
            });
            this.rocks.clear();
        }

        if (this.bushes) {
            this.bushes.children.forEach((child) => {
                child.geometry?.dispose();
                child.material?.dispose();
            });
            this.bushes.clear();
        }

        this.#objectMap.clear();
    }

    createTerrain() {
        gridTexture.repeat = new Vector2(this.width, this.height);
        gridTexture.wrapS = RepeatWrapping;
        gridTexture.wrapT = RepeatWrapping;
        gridTexture.colorSpace = SRGBColorSpace;

        const terrainGeometry = new PlaneGeometry(
            this.width,
            this.height,
            this.width,
            this.height
        );
        const terrainMaterial = new MeshStandardMaterial({
            map: gridTexture,
        });

        this.terrain = new Mesh(terrainGeometry, terrainMaterial);

        this.terrain.rotation.x = -Math.PI / 2;
        this.terrain.position.set(this.width / 2, 0, this.height / 2);

        this.add(this.terrain);
    }

    createTrees() {
        const treeRadius = 0.2;
        const treeHeight = 1;

        const treeGeometry = new ConeGeometry(treeRadius, treeHeight, 8);
        const treeMaterial = new MeshStandardMaterial({
            color: 0x305100,
            flatShading: true,
        });

        for (let i = 0; i < this.treeCount; i++) {
            const position = new Vector2(
                Math.floor(this.width * Math.random()),
                Math.floor(this.height * Math.random())
            );
            if (this.#objectMap.has(this.getObjectKey(position))) {
                continue;
            }

            const treeMesh = new Mesh(treeGeometry, treeMaterial);
            treeMesh.name = 'tree';

            treeMesh.position.set(
                position.x + 0.5,
                treeHeight / 2,
                position.y + 0.5
            );
            this.trees.add(treeMesh);
            this.#objectMap.set(this.getObjectKey(position), treeMesh);
        }
    }

    createRocks() {
        const minRockRadius = 0.1;
        const maxRockRadius = 0.3;
        const minRockHeight = 0.4;
        const maxRockHeight = 0.7;

        const rockMaterial = new MeshStandardMaterial({
            color: 0xb0b0b0,
            flatShading: true,
        });

        for (let i = 0; i < this.rockCount; i++) {
            const position = new Vector2(
                Math.floor(this.width * Math.random()),
                Math.floor(this.height * Math.random())
            );
            if (this.#objectMap.has(this.getObjectKey(position))) {
                continue;
            }

            const radius =
                Math.random() * (maxRockRadius - minRockRadius) + minRockRadius;
            const height =
                Math.random() * (maxRockHeight - minRockHeight) + minRockHeight;
            const rockGeometry = new SphereGeometry(radius, 6, 5);

            const rockMesh = new Mesh(rockGeometry, rockMaterial);
            rockMesh.name = 'rock';

            rockMesh.position.set(position.x + 0.5, 0, position.y + 0.5);
            rockMesh.scale.y = height;

            this.rocks.add(rockMesh);
            this.#objectMap.set(this.getObjectKey(position), rockMesh);
        }
    }

    createBushes() {
        const minBushRadius = 0.1;
        const maxBushRadius = 0.3;

        const bushMaterial = new MeshStandardMaterial({
            color: 0x80a040,
            flatShading: true,
        });

        for (let i = 0; i < this.bushCount; i++) {
            const position = new Vector2(
                Math.floor(this.width * Math.random()),
                Math.floor(this.height * Math.random())
            );
            if (this.#objectMap.has(this.getObjectKey(position))) {
                continue;
            }

            const radius =
                Math.random() * (maxBushRadius - minBushRadius) + minBushRadius;
            const bushGeometry = new SphereGeometry(radius, 8, 8);

            const bushMesh = new Mesh(bushGeometry, bushMaterial);
            bushMesh.name = 'bush';

            bushMesh.position.set(position.x + 0.5, radius, position.y + 0.5);
            this.bushes.add(bushMesh);
            this.#objectMap.set(this.getObjectKey(position), bushMesh);
        }
    }

    getObjectKey(position) {
        return `${position.x},${position.y}`;
    }

    getObject(position) {
        return this.#objectMap.get(this.getObjectKey(position)) ?? null;
    }
}