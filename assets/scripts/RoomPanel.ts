import { _decorator, Component, EditBox, Node } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('RoomPanel')
export class RoomPanel extends Component {
    @property(EditBox)
    public editBox: EditBox;

    private lastUpdateTime: number = 0;
    start() {

    }

    update(deltaTime: number) {
        this.lastUpdateTime += deltaTime;
        if (this.lastUpdateTime > 3) {
            GameManager.inst.getRoomList();
            this.lastUpdateTime = 0;
        } 

    }
    //创建/加入房间
    public joinCreateRoom() {
        if (this.editBox.string) {
            GameManager.inst.joinOrCreateRoom(this.editBox.string);
        }
        //GameManager.inst.getRoomList();
    }
    
}


