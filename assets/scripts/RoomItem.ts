import { _decorator, Component, Node } from 'cc';
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
}


