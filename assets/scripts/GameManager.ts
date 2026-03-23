import { _decorator, Component, Game, instantiate, Label, Layout, Node, Prefab } from 'cc';
import { RoomItem } from './RoomItem';

//import Colyseus from 'db://colyseus-sdk/colyseus.js';
const { ccclass, property } = _decorator;



@ccclass('GameManager')
export class GameManager extends Component {


    //websocket 客户端对象
    private ws: WebSocket | null = null;
    //private roomId = "test_room";

    //计数
    @property(Label)
    countLabel: Label;
    //房间布局对象
    @property(Layout)
    roomLayout: Layout;
    //房间Item预制体
    @property(Prefab)
    roomItemPrefab: Prefab;
    //房间面板节点 用于网络控制
    @property(Node)
    roomPanel: Node;
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
            // this.ws!.send(JSON.stringify({
            //     type: "join",
            //     roomId: this.roomId
            // }));
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
            //获取房间列表数据
            if (data.type == "listroomdata" && this.roomLayout) {
                if (data.data.length <= 0) return;
                let children: Node[] = this.roomLayout.node.children;
                children.forEach(x => {
                    x.destroy();
                });
                let roomItem = instantiate(this.roomItemPrefab);
                roomItem.getChildByName("RoomLabel").getComponent(Label).string = data.data[0].roomId;
                roomItem.setParent(this.roomLayout.node);
                let rt: RoomItem = roomItem.getComponent(RoomItem);
                rt.setRoomId(data.data[0].roomId);
            }
            //我已加入房间
            if (data.type == "roomJoined" && this.roomPanel) {
                let topPanel: Node = this.roomPanel.getChildByName("TopPanel");
                let roomsScrollView: Node = this.roomPanel.getChildByName("RoomsScrollView");
                let roomDetail: Node = this.roomPanel.getChildByName("RoomDetail");
                topPanel.active = false;
                roomsScrollView.active = false;
                roomDetail.active = true;
            }
            //其他玩家加入我的房间
            if (data.type == "roomOtherJoined") {
                let targetNameLabel: Node = this.roomPanel.getChildByPath("RoomDetail/TargetPlayer/NameLabel");
                targetNameLabel.getComponent(Label).string = data.clientid;
            }
            //房间内信息（客户端）
            if (data.type == "MyRoomInfo") {
                let targetPlayerName: string = "";
                for (let i: number = 0; i < data.data.clients.length; i++) {
                    if (data.data.clients[i] != data.data.clientid) {
                        targetPlayerName = data.data.clients[i];
                        break;
                    }
                }
                console.log(targetPlayerName)
                let targetNameLabel: Node = this.roomPanel.getChildByPath("RoomDetail/TargetPlayer/NameLabel");
                targetNameLabel.getComponent(Label).string = targetPlayerName;
                let MyNameLabel: Node = this.roomPanel.getChildByPath("RoomDetail/MyPlayer/NameLabel");
                MyNameLabel.getComponent(Label).string = data.data.clientid;
            }
            //房间状态改变 比如开始游戏
            if (data.type == "RoomStateChanged") {
                if (data.roomState == "Play") {
                    this.roomPanel.active = false;
                }
            }
        };


    }
    update(deltaTime: number) {

    }
    //房间管理相关
    public getRoomList() {
        this.ws.send(JSON.stringify({ type: "list" }));
    }
    //加入或创建房间
    public joinOrCreateRoom(roomId: string) {
        if (roomId == "") return;

        this.ws!.send(JSON.stringify({
            type: "join",
            roomId: roomId
        }));
    }
    //获取我的房间信息
    public getMyRoomInfo() {
        this.ws.send(JSON.stringify({ type: "getMyRoomInfo" }));
    }
    //准备游戏
    public gameReady() {
        this.ws.send(JSON.stringify({ type: "changeRoomClientState", roomClientState: 'Ready' }));
    }
    //递增 测试
    public inc() {
        this.ws.send(JSON.stringify({ type: "inc" }));
    }
}


