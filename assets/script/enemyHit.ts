// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import enemy from "./enemy";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


    enemy: enemy ;


    // LIFE-CYCLE CALLBACKS:

    onLoad () {
      this.enemy = this.node.parent.getComponent('enemy')
    }

  //碰撞回调
    onCollisionEnter(other,self){
        if(other.node.group == 'hero' && other.tag == 1){
            this.enemy.hurt()
        }
    }



    start () {
 
    }

    // update (dt) {}
}
