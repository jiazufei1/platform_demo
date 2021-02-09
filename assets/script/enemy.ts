// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;


const State = {
    stand: 1,
    attack: 2,
    hurt: 3,
}

@ccclass
export default class enemy extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';
    hp: number;
    isHit: boolean;
    ani: cc.Animation;
    heroAni: any;
    anima: string;
    rb: cc.RigidBody;
    private _speed: number;
    sp: cc.Vec2;
    tt: number;
    enemyState: number;
    lv: cc.Vec2;
    moveLeft: boolean;
    moveRight: boolean;
    playerNode: cc.Node;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        this._speed = 80
        this.sp = cc.v2(0,0)
        this.tt = 0
        this.enemyState = State.stand


        this.hp = 5
        this.isHit = false

        this.anima = 'idle'
        this.ani = this.node.getChildByName('body').getComponent(cc.Animation)
        this.rb = this.node.getComponent(cc.RigidBody)
        this.ani.on('finished',(e,data) => {

            if(data.name = 'hurt'){
                this.hp--
                this.isHit = false
                this.enemyState = State.stand

                if (this.hp == 0) {
                    this.node.destroy()
                }
            }else if (data.name == 'attack'){
                this.setAni('idle')
                this.enemyState = State.stand
            }

            
        })

        this.moveLeft = false
        this.moveRight = false

        this.playerNode = cc.find('Canvas/bg/hero')

    }

    hurt(){

        if (this.isHit) return

        this.isHit = true

        this.enemyState = State.hurt

        this.lv = this.rb.linearVelocity
        this.lv.x = 0
        this.rb.linearVelocity = this.lv
        this.setAni('hurt')
    }

    setAni(anima){
        if (this.anima == anima) return
        this.anima = anima
        this.ani.play(anima)
    }

    enemyAction(tt){
          let p_pos =this.playerNode.position
          let e_pos = this.node.position
          //间隔距离
          let dis = cc.Vec2.distance(p_pos,e_pos)

          if(dis <=30){
              console.log('攻击')
              this.moveLeft = false
              this.moveRight = false
              this.enemyState = State.attack
          }else if(dis <= 150){
            console.log('攻击')
            let v = p_pos.sub(e_pos)
            if(v.x <0){
                this.moveLeft = true
              this.moveRight = false
            }else{
                this.moveLeft = false
              this.moveRight = true
            }
            this.enemyState = State.stand
          }else{
            console.log('静止') 
            this.moveLeft = false
            this.moveRight = false
            this.enemyState = State.stand
          }
    }


    attack(){
        this.setAni('attack')
        this.lv = this.rb.linearVelocity
        this.lv.x = 0
        this.rb.linearVelocity = this.lv

    }

    move(){



        //反转角色图像
        let scaleX = Math.abs(this.node.scaleX)
        this.lv = this.rb.linearVelocity

        if (this.moveLeft){
            this.sp.x = -1
            this.node.scaleX = -scaleX
            this.setAni('run')
        }else if (this.moveRight){
            this.sp.x = 1
            this.node.scaleX = scaleX

            this.setAni('run')
        }else{
            this.sp.x = 0 

            this.setAni('idle')
        }

        if (this.sp.x) {
            this.lv.x = this.sp.x * this._speed
        }else{
            this.lv.x = 0
        }
        this.rb.linearVelocity = this.lv

    }

    update (dt) {

        //状态切换
        this.tt += dt
        if(this.tt>= 0.3 && this.enemyState == State.stand){
            this.enemyAction(dt)
            this.tt = 0
        }

        //攻击
        if (this.enemyState == State.attack){
           this.attack()
        }else if (this.enemyState == State.stand){
            this.move()
        }

    }
}
