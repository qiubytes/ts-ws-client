import { _decorator, Component, Game, Label, Node } from 'cc';

//import Colyseus from 'db://colyseus-sdk/colyseus.js';
const { ccclass, property } = _decorator;



@ccclass('GameManager')
export class GameManager extends Component {


    private ws: WebSocket | null = null;
    private roomId = "test_room";

    @property(Label)
    countLabel: Label;

    private static inst: GameManager = null;
    protected onLoad(): void {
        if (GameManager.inst == null) GameManager.inst = this;
    }
    start() {
        this.ws = new WebSocket("ws://localhost:3000");

        this.ws.onopen = () => {
            console.log("WebSocket 连接已打开");
            // 发送加入房间消息
            this.ws!.send(JSON.stringify({
                type: "join",
                roomId: this.roomId
            }));
        };



        this.ws.onerror = (error) => {
            console.error("WebSocket 错误:", error);
        };

        this.ws.onclose = () => {
            console.log("WebSocket 连接关闭");
        };

        this.ws.onmessage = (event) => {
          console.log("收到消息");
          console.log(event.data);
            const data = JSON.parse(event.data);
            if (data.type === "state" && this.countLabel) {
                this.countLabel.string = data.count;
                // this.countLabel.string = `计数: ${data.count}`;
            }
        };


    }



    update(deltaTime: number) {

    }
}


