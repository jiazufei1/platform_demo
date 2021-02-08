// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';
    hp: number;
    isHit: boolean;
    ani: cc.Animation;
    heroAni: any;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.hp = 5
        this.isHit = false
        this.ani = this.node.getComponent(cc.Animation)
        this.ani.on('finished',(e,data) => {
            this.hp--
            this.isHit = false

            if (this.hp == 0) {
                this.node.destroy()
            }
        })
    }


    //碰撞回调
    onCollisionEnter(other,self){
        if(other.node.group == 'hero'){
            this.isHit = true
            this.ani.play('hurt')
        }
    }

    start () {

    }

    // update (dt) {}
}
