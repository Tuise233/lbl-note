<template>
    <div class="app-main">
        <div class="app-header">
            <span style="font-size: 12px; margin-left: 10px;">拉布拉记</span>
            <div style="display: flex; margin-left: auto; margin-right: 10px;">
                <img v-on:click="boot" style="margin-left: auto; margin-right: 10px;" src="@/assets/icons/boot-disable.png" v-if="isAutoBoot == false" />
                <img v-on:click="boot" style="margin-left: auto; margin-right: 10px;" src="@/assets/icons/boot-enable.png" v-else />
                <img v-on:click="top" style="margin-left: auto; margin-right: 10px;" src="@/assets/icons/top-disable.png" v-if="isTopWindow == false" />
                <img v-on:click="top" style="margin-left: auto; margin-right: 10px;" src="@/assets/icons/top-enable.png" v-else />
                <img v-on:click="minimize" style="margin-left: auto; margin-right: 10px;" src="@/assets/icons/minimize.png" />
                <img v-on:click="close" src="@/assets/icons/close.png" />
            </div>
        </div>

        <div class="app-content">
            <div class="app-content-header">
                <div style="display: flex; align-items: center; height: 16px; margin-left: 10px;" v-if="currentPage == 'todo'">
                    <span style="cursor: pointer; font-size: 16px;">待办事项</span>
                    <span style="cursor: pointer; font-size: 10px; margin: auto 0 0 10px; color: #969696;" v-on:click="togglePage('done')">已完成</span>
                </div>

                <div style="display: flex; align-items: center; height: 16px; margin-left: 10px;" v-if="currentPage == 'done'">
                    <span style="cursor: pointer; font-size: 16px;">已完成</span>
                    <span style="cursor: pointer; font-size: 10px; margin: auto 0 0 10px; color: #969696;" v-on:click="togglePage('todo')">待办事项</span>
                </div>

                <img src="@/assets/icons/new.png" v-on:click="createNewNote">
            </div>
            
            <div class="app-content-item-list">
                <div style="display: flex; flex-direction: column; align-items: center; position: absolute; transform: translate(-50%, -50%); left: 50%; top: 50%;" v-if="currentList.length == 0">
                    <img src="@/assets/icons/empty.png" />
                    <span>这里没有任何东西</span>
                </div>

                <div class="app-content-item-list-children" v-for="item in currentList">
                    <div style="display: flex;">
                        <input type="text" style="margin-left: 10px; border: none; background-color: transparent; outline: none; font-size: 16px;" placeholder="请输入标题" v-model="item.title">
                        <div style="display: flex; align-items: center; margin-left: auto; margin-right: 10px;">
                            <img v-on:click="doneNote(item.id)" style="cursor: pointer; width: 16px; margin-left: 8px; height: 16px;" src="@/assets/icons/done.png" />
                            <img v-on:click="topNote(item.id)" style="cursor: pointer; width: 16px; margin-left: 8px; height: 16px;" src="@/assets/icons/top.png" />
                            <!-- <img style="cursor: pointer; width: 16px; margin-left: 8px; height: 16px;" src="@/assets/icons/edit.png" /> -->
                            <img v-on:click="removeNote(item.id)" style="cursor: pointer; width: 16px; margin-left: 8px; height: 16px;" src="@/assets/icons/delete.png" />
                        </div>
                    </div>
                    <span style="margin-left: 10px; margin-top: 10px; width: calc(100% - 20px); font-size: 14px; outline: none;" contenteditable="true" @focus="onTextFocus" @blur="onTextBlur($event, item.id)">{{ item.text }}</span>
                    <span style="margin-left: auto; margin-right: 10px; font-size: 12px; color: #989595;">{{ item.datetime }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ipcRenderer } from 'electron';

export default{
    data(){
        return {
            currentPage: 'todo', //todo done
            currentList: [],
            todo: [],
            done: [],
            isTopWindow: false,
            isAutoBoot: false,

            isCtrlDown: false,
            isEnterDown : false
        }
    },

    created(){
        //判断是否存在数据
        let data = localStorage.getItem("lbl-note-data2");
        if(data == null){
            localStorage.setItem("lbl-note-data2", JSON.stringify({
                todo: [],
                done: [],
                isAutoBoot: false
            }));
        } else {
            data = JSON.parse(data);
            this.todo = data['todo'];
            this.done = data['done'];
            this.isAutoBoot = data['isAutoBoot'];
            this.currentList = this.todo;
        }

        setInterval(() => {
            this.saveData();
            
            if(this.isCtrlDown == true && this.isEnterDown == true){
                this.createNewNote();
                this.isCtrlDown = false;
                this.isEnterDown = false;
            }
        }, 200);

        document.onkeydown = (e) => {
            switch(e.code){
                case "ControlLeft":{
                    this.isCtrlDown = true;
                    break;
                }

                case "Enter":{
                    this.isEnterDown = true;
                    break;
                }
            }
        };

        document.onkeyup = (e) => {
            switch(e.code){
                case "ControlLeft":{
                    this.isCtrlDown = false;
                    break;
                }

                case "Enter":{
                    this.isEnterDown = false;
                    break;
                }
            }
        };
    },

    methods: {
        close(){
            ipcRenderer.send('window:close');
        },

        minimize(){
            ipcRenderer.send('window:minimize');
        },

        top(){
            ipcRenderer.send('window:top');
            this.isTopWindow = !this.isTopWindow;
        },

        boot(){
            this.isAutoBoot = !this.isAutoBoot;
            ipcRenderer.send('window:toggleAutoBoot', this.isAutoBoot);
            this.saveData();
        },

        togglePage(type){
            this.currentPage = type;
            
            switch(type){
                case "todo":{
                    this.currentList = this.todo;
                    break;
                }

                case "done":{
                    this.currentList = this.done;
                    break;
                }
            }
        },

        createNewNote(){
            this.currentList.push({
                id: Date.now(),
                title: "",
                text: "请输入内容",
                datetime: this.formatDateTime()
            });
            this.saveData();
        },

        removeNote(id){
            for(let i = 0; i < this.currentList.length; i++){
                if(this.currentList[i].id == id){
                    this.currentList.splice(i, 1);
                    break;
                }
            }
            this.saveData();
        },
        
        topNote(id){
            for(let i = 0; i < this.currentList.length; i++){
                if(this.currentList[i].id == id){
                    let data = this.currentList[i];
                    this.currentList.splice(i, 1);
                    this.currentList.splice(0, 0, data);
                    break;
                }
            }
            this.saveData();
        },

        doneNote(id){
            for(let i = 0; i < this.currentList.length; i++){
                if(this.currentList[i].id == id){
                    let data = this.currentList[i];
                    this.currentList.splice(i, 1);
                    this.done.push(data);
                    break;
                }
            }
            this.saveData();
        },

        onTextFocus(e){
            if(e.target.innerText == "请输入内容"){
                e.target.innerText = "";
            }
        },

        onTextBlur(e, id){
            if(e.target.innerText.length == 0){
                e.target.innerText = "请输入内容";
            }
            for(let i = 0; i < this.currentList.length; i++){
                if(this.currentList[i].id == id){
                    this.currentList[i].text = e.target.innerText;
                }
            }
            this.saveData();
        },

        formatDateTime(){
            let date = new Date();
            let y = date.getFullYear();
            let m = date.getMonth() + 1;
            let d = date.getDate();
            return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + date.toTimeString().substr(0, 8);
        },

        saveData(){
            switch(this.currentPage){
                case 'todo':{
                    this.todo = this.currentList;
                    break;
                }

                case 'done':{
                    this.done = this.currentList;
                    break;
                }
            }
            localStorage.setItem('lbl-note-data2', JSON.stringify({
                todo: this.todo,
                done: this.done,
                isAutoBoot: this.isAutoBoot
            }));
        }
    }
}
</script>

<style lang="less" scoped>
@import "../assets/style/index.less";
.app-main{
    width: 350px;
    height: 100vh;
    margin: 0;
    padding: 0;

    display: flex;
    flex-direction: column;
    border-radius: 5px;
}

.app-header{
    width: 100%;
    height: 28px;
    display: flex;
    align-items: center;
    background-color: @navbar-backcolor;
    color: @navbar-textcolor;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    -webkit-app-region: drag;
}

.app-header img{
    cursor: pointer;
    -webkit-app-region: no-drag;
}

.app-content{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: white;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
}

.app-content-header{
    width: 100%;
    height: 36px;
    box-shadow: 0px 4px 5px -5px rgba(0, 0, 0, 0.25);
    display: flex;
    align-items: center;
}

.app-content-header img{
    margin-left: auto;
    margin-right: 10px;
    cursor: pointer;
}

.app-content-item-list{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    padding: 10px;
    overflow-y: scroll;
}

.app-content-item-list-children{
    width: calc(100% - 10px);
    box-sizing: border-box;
    padding: 10px 0;
    background-color: #F0F5F9;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    flex-shrink: 0;
}
</style>