import { _decorator, Component, Label, Node } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('RoomItem')
export class RoomItem extends Component {
    //房间ID
    private roomId: string = "";
    public setRoomId(id: string) {
        this.roomId = id;
    }
    public getRoomId(): string {
        return this.roomId;
    }
    start() {

    }

    update(deltaTime: number) {

    }
    //加入房间
    public joinRoom() {
        let roomLabel: Node = this.node.getChildByName("RoomLabel");
        let roomId: string = roomLabel.getComponent(Label).string;
        GameManager.inst.joinOrCreateRoom(roomId);
    }
}


