import { _decorator, Component, Node } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('PlayPanel')
export class PlayPanel extends Component {
    start() {

    }

    update(deltaTime: number) {

    }
    //出牌
    playACard(event: Event, customEventData: string) {
        //console.log(customEventData);
        GameManager.inst.playACard(customEventData);
    }
}


