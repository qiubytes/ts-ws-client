import { _decorator, Button, Component, EditBox, Label, Node } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('RoomPanel')
export class RoomPanel extends Component {
    @property(EditBox)
    public editBox: EditBox;

    //准备按钮
    @property(Button)
    readyButton:Button;

    private lastUpdateTime: number = 0;
    start() {

    }

    update(deltaTime: number) {
        this.lastUpdateTime += deltaTime;
        if (this.lastUpdateTime > 3) {
            GameManager.inst.getRoomList();
            GameManager.inst.getMyRoomInfo();
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
    //准备游戏
    public gameReady() {
        GameManager.inst.gameReady();
        this.readyButton.node.getChildByName('Label').getComponent(Label).string='取消准备';
    }

}


