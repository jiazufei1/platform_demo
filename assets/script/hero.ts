// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

const Input ={}
const State = {
    stand: 1,
    attack: 2,
}

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';
    _speed: number;
    sp: cc.Vec2;

    heroState: number;
    lv: cc.Vec2;
    anima: string;
    heroAni: cc.Animation;
    combo: number;
    rb: cc.RigidBody;


    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        this._speed = 200
        this.sp = cc.v2(0,0)


        this.combo = 0

        this.heroState = State.stand

        this.anima = 'idle'
        this.heroAni = this.node.getChildByName('body').getComponent(cc.Animation)

        this.rb = this.node.getComponent(cc.RigidBody)

        this.heroAni.on('finished',this.onAnimaFinished,this)
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.onKeydown,this)
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.onKeyup,this)
    }




    onDestroy(){    
        this.heroAni.off('finished',this.onAnimaFinished,this)
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN,this.onKeydown,this)
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP,this.onKeyup,this)
    }

    onAnimaFinished(e,data){
        if (data.name == 'attack' || data.name == 'attack2' || data.name == 'attack3'){
            console.log('攻击结束')
            this.heroState = State.stand
            this.combo = (this.combo  + 1 ) % 3 
            setTimeout(() => {
                if (this.heroState == State.attack) return
                this.combo = 0
            },500)
        }
    }



    setAni(anima){
        if (this.anima == anima) return
        this.anima = anima
        this.heroAni.play(anima)
    }

    onKeydown(e: { keyCode: string | number; }){
        Input[e.keyCode] = 1
    }


    onKeyup(e){
        Input[e.keyCode] = 0
    }


    //攻击
    attack(){

        this.lv = this.rb.linearVelocity
        if (Input[cc.macro.KEY.j]){
            if(this.combo == 0){
                this.setAni('attack')
            }else if (this.combo == 1) {
                this.setAni('attack2')
            }else if (this.combo == 2) {
                this.setAni('attack3')
            }
            this.lv.x = 0
        }
        this.rb.linearVelocity = this.lv
    }

    //移动
    move(){



        //反转角色图像
        let scaleX = Math.abs(this.node.scaleX)
        this.lv = this.rb.linearVelocity

        if (Input[cc.macro.KEY.a] || Input[cc.macro.KEY.left]){
            this.sp.x = -1
            this.node.scaleX = -scaleX
            this.setAni('run')
        }else if (Input[cc.macro.KEY.d] || Input[cc.macro.KEY.right]){
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
        switch(this.heroState){
            case State.stand:{
                if (Input[cc.macro.KEY.j]){
                    this.heroState = State.attack
                }
                break
            }
        }

        //攻击
        if (this.heroState == State.attack){
           this.attack()
        }else if (this.heroState == State.stand){
            this.move()
        }




       

        

    }
}
