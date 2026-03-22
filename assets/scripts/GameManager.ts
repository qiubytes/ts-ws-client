import { _decorator, Component, Game, instantiate, Label, Layout, Node, Prefab } from 'cc';

//import Colyseus from 'db://colyseus-sdk/colyseus.js';
const { ccclass, property } = _decorator;



@ccclass('GameManager')
export class GameManager extends Component {


    //websocket 客户端对象
    private ws: WebSocket | null = null;
    private roomId = "test_room";

    //计数
    @property(Label)
    countLabel: Label;
    //房间布局对象
    @property(Layout)
    roomLayout: Layout;
    //房间Item预制体
    @property(Prefab)
    roomItemPrefab: Prefab;
    //单例对象
    public static inst: GameManager = null;
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
            if (data.type == "listroomdata" && this.roomLayout) {
                let roomItem = instantiate(this.roomItemPrefab);
                roomItem.getChildByName("RoomLabel").getComponent(Label).string = data.data[0].roomId;
                roomItem.setParent(this.roomLayout.node);
            }
        };


    }
    update(deltaTime: number) {

    }
    //房间管理相关
    public getRoomList() {
        this.ws.send(JSON.stringify({ type: "list" }));
    }
}


