<template>
    <div class="app-todo">
        <div class="app-todo-header">
            <span>{{ doneList.length }}</span>
            <span>个已完成事项</span>
        </div>
        
        <div class="app-todo-content">
            <div class="app-todo-list-content">
                <div class="app-todo-list">
                    <div class="app-todo-list-item" v-for="item in doneLeft">
                        <span style="font-size: 18px;">{{ item.title }}</span>
                        <span style="font-size: 12px; margin-top: 12px;">{{ item.text }}</span>
                        <div style="display: flex; align-items: center; margin-top: 12px;">
                            <div style="display: flex; align-items: center;">
                                <div v-on:click="topDone(item)" class="app-todo-list-item-img-container"><img src="@/assets/icons/top.png"></div>
                                <div v-on:click="backDone(item)" class="app-todo-list-item-img-container"><img src="@/assets/icons/back.png"></div>
                                <div v-on:click="deleteDone(item)" class="app-todo-list-item-img-container"><img src="@/assets/icons/delete.png"></div>
                            </div>
                            <span class="app-todo-list-item-datetime">完成于 {{ item.date }}</span>
                        </div>
                    </div>
                </div>

                <div class="app-todo-list" style="margin-left: 12px;">
                    <div class="app-todo-list-item" v-for="item in doneRight">
                        <span style="font-size: 18px;">{{ item.title }}</span>
                        <span style="font-size: 12px; margin-top: 12px;">{{ item.text }}</span>
                        <div style="display: flex; align-items: center; margin-top: 12px;">
                            <div style="display: flex; align-items: center;">
                                <div v-on:click="topDone(item)" class="app-todo-list-item-img-container"><img src="@/assets/icons/top.png"></div>
                                <div v-on:click="backDone(item)" class="app-todo-list-item-img-container"><img src="@/assets/icons/back.png"></div>
                                <div v-on:click="deleteDone(item)" class="app-todo-list-item-img-container"><img src="@/assets/icons/delete.png"></div>
                            </div>
                            <span class="app-todo-list-item-datetime">完成于 {{ item.date }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { formatDateTime, getData, saveData } from "../utils/utils";

export default{
    data(){
        return {
            doneList: [],
            doneLeft: [],
            doneRight: []
        }
    },

    created(){
        let data = getData();
        this.doneList = data['doneList'];
        for(let i = 0; i < this.doneList.length; i++){
            this.doneList[i].text = this.doneList[i].text.replace(/\\n/g, "\n");
        }
        this.sortdoneList();
    },

    methods: {
        createNewTodo(){
            this.doneList.push({
                id: Date.now(),
                title: "请输入标题",
                text: "请输入内容",
                date: formatDateTime(),
                notifyDate: null
            });
            this.sortdoneList();
            saveData({
                doneList: this.doneList
            });
        },

        topDone(item){
            let index = this.doneList.indexOf(item);
            this.doneList.splice(index, 1);
            this.doneList.splice(0, 0, item);
            this.sortdoneList();
            saveData({
                doneList: this.doneList
            });
        },

        backDone(item){
            let index = this.doneList.indexOf(item);
            this.doneList.splice(index, 1);
            this.sortdoneList();
            let data = getData();
            data['todoList'].push(item);
            saveData({
                todoList: data['todoList'],
                doneList: this.doneList
            });
        },

        deleteDone(item){
            let index = this.doneList.indexOf(item);
            this.doneList.splice(index, 1);
            this.sortdoneList();
            saveData({
                doneList: this.doneList
            });
        },

        sortdoneList(){
            this.doneLeft.length = 0;
            this.doneRight.length = 0;
            for(let i = 0; i < this.doneList.length; i++){
                if(i % 2 == 0){
                    this.doneLeft.push(this.doneList[i]);
                } else {
                    this.doneRight.push(this.doneList[i]);
                }
            }
        }
    }
}
</script>

<style lang="less" scoped>
@import "../assets/style/index.less";

::-webkit-scrollbar{
    display: none;
}

.app-todo{
    width: 100%;
    height: 100%;
}

.app-todo-header{
    width: 100%;
    height: 60px;
    display: flex;
    color: @todo-header-textcolor;
    border-bottom: 1px solid @todo-header-border-color;
}

.app-todo-header span{
    align-self: center;
    font-size: 24px;
    margin-top: 9px;
}

.app-todo-header span:first-child{
    font-size: 36px;
    align-self: center;
    margin-left: 24px;
    margin-top: 0;
}

.app-todo-header-btn{
    width: 60px;
    height: 36px;
    display: flex;
    align-self: center;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    margin-right: 24px;
    box-shadow: 0px 1px 10px -3px rgba(0, 0, 0, 0.25);
    background-color: @todo-header-button-backcolor;
    border-radius: 5px;
    cursor: pointer;
}

.app-todo-content{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
}

.app-todo-list-content{
    width: 634px;
    height: calc(100% - 60px);
    display: flex;
    overflow-y: scroll;
}

.app-todo-list{
    width: 311px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding-top: 12px;
}

.app-todo-list-item{
    width: 100%;
    box-sizing: border-box;
    padding: 12px;
    margin-bottom: 12px;
    color: @todo-list-item-textcolor;
    background-color: @todo-list-item-backcolor;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
    flex-shrink: 0;
}

.app-todo-list-item span{
    outline: none;
    white-space: pre-wrap;
}

.app-todo-list-item-img-container{
    width: 18px;
    height: 18px;
    border-radius: 5px;
    background-color: @todo-list-item-img-container-backcolor;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-right: 6px; 
}

.app-todo-list-item-datetime{
    margin-left: auto;
    margin-right: 0;
    font-size: 10px;
}
</style>