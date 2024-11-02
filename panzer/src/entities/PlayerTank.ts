import { Mesh, MeshStandardMaterial, Vector3 } from 'three';
import GameEntity from './GameEntity';
import ResourceManager from '../utils/ResourceManager';

class PlayerTank extends GameEntity {
    constructor(position: Vector3) {
        super(position);
    }

    public load = async () => {
        const tankModel = ResourceManager.instance.getModel('tank');
        if (!tankModel) {
            throw new Error('Tank model not found');
        }

        const tankBodyMesh = tankModel.scene.children.find(
            (m) => m.name === 'Body'
        ) as Mesh;

        const tankTurretMesh = tankModel.scene.children.find(
            (m) => m.name === 'Turret'
        ) as Mesh;

        const tankBodyTexture =
            ResourceManager.instance.getTexture('tank-body');

        const tankTurretTexture =
            ResourceManager.instance.getTexture('tank-turret');

        if (
            !tankBodyMesh ||
            !tankTurretMesh ||
            !tankBodyTexture ||
            !tankTurretTexture
        ) {
            throw new Error('Tank textures not found');
        }

        const bodyMaterial = new MeshStandardMaterial({
            map: tankBodyTexture,
        });
        const turretMaterial = new MeshStandardMaterial({
            map: tankTurretTexture,
        });

        tankBodyMesh.material = bodyMaterial;
        tankTurretMesh.material = turretMaterial;

        this._mesh.add(tankBodyMesh);
        this._mesh.add(tankTurretMesh);
    };
}

export default PlayerTank;