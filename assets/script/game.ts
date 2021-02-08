// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property (cc.TiledMap)
    MapNode: cc.TiledMap

  

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getPhysicsManager().enabled = true
        // cc.director.getPhysicsManager().debugDrawFlags = true

        cc.director.getCollisionManager().enabled = true
        // cc.director.getCollisionManager().enabledDebugDraw = true

        this.initMapNode(this.MapNode)
    }


    initMapNode(mapNode: cc.TiledMap){
        let tiledMap = mapNode.getComponent(cc.TiledMap)
        let tiledSize = tiledMap.getTileSize()
        let layer = tiledMap.getLayer('wall')
        let layerSize = layer.getLayerSize()

        for (let i = 0; i <layerSize.width; i++ ){
            for (let j = 0 ;j < layerSize.height ; j++ ){
                let tiled = layer.getTiledTileAt(i,j,true)
                if (tiled.gid != 0){
                    tiled.node.group = 'wall'

                    let body = tiled.node.addComponent(cc.RigidBody)
                    body.type = cc.RigidBodyType.Static
                    let collider = tiled.node.addComponent(cc.PhysicsBoxCollider)
                    collider.offset = cc.v2(tiledSize.width/2,tiledSize.height/2)
                    collider.size = tiledSize
                    collider.apply()
                }
            }
        }
    }

    start () {

    }

    // update (dt) {}
}
