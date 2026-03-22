import { _decorator, Component, Node } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('RoomPanel')
export class RoomPanel extends Component {
    start() {

    }

    update(deltaTime: number) {

    }
    //获取房间列表
    public getRoomList() {
        GameManager.inst.getRoomList();
    }
}


