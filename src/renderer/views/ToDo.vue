<template>
    <div class="app-todo">
        <div class="app-todo-header">
            <span>{{ todoList.length }}</span>
            <span>个待办事项</span>
            <div class="app-todo-header-btn" v-on:click="createNewTodo()">
                <img src="@/assets/icons/new.png" v-if="$store.state.darkTheme == false"/>
                <img src="@/assets/icons/new-white.png" v-else/>
            </div>
        </div>
        
        <div class="app-todo-content">
            <div class="app-todo-list-content">
                <div class="app-todo-list">
                    <div class="app-todo-list-item" v-for="item in todoLeft">
                        <span style="font-size: 18px;" contenteditable @focus="focusTodoTitle(item)" @focusout="unfocusTodoTitle($event, item)">{{ item.title }}</span>
                        <span style="font-size: 12px; margin-top: 12px;" contenteditable @focus="focusTodoText(item)" @focusout="unfocusTodoText($event, item)">{{ item.text }}</span>
                        <div style="display: flex; align-items: center; margin-top: 12px;">
                            <div style="display: flex; align-items: center;">
                                <div v-on:click="topTodo(item)" class="app-todo-list-item-img-container" v-if="$store.state.darkTheme == false"><img src="@/assets/icons/top.png"></div>
                                <div v-on:click="topTodo(item)" class="app-todo-list-item-img-container"  v-else><img src="@/assets/icons/top-white.png"></div>
                                <div v-on:click="doneTodo(item)" class="app-todo-list-item-img-container" v-if="$store.state.darkTheme == false"><img src="@/assets/icons/done.png"></div>
                                <div v-on:click="doneTodo(item)" class="app-todo-list-item-img-container" v-else><img src="@/assets/icons/done-white.png"></div>
                                <div v-on:click="deleteTodo(item)" class="app-todo-list-item-img-container" v-if="$store.state.darkTheme == false"><img src="@/assets/icons/delete.png"></div>
                                <div v-on:click="deleteTodo(item)" class="app-todo-list-item-img-container" v-else><img src="@/assets/icons/delete-white.png"></div>
                                <div v-on:click="openSetting(item)" class="app-todo-list-item-img-container" v-if="$store.state.darkTheme == false"><img src="@/assets/icons/setting.png"></div>
                                <div v-on:click="openSetting(item)" class="app-todo-list-item-img-container" v-else><img src="@/assets/icons/setting-white.png"></div>
                            </div>
                            <span class="app-todo-list-item-datetime">创建于 {{ item.date }}</span>
                        </div>
                    </div>
                </div>

                <div class="app-todo-list" style="margin-left: 12px;">
                    <div class="app-todo-list-item" v-for="item in todoRight">
                        <span style="font-size: 18px;" contenteditable @focus="focusTodoTitle(item)" @focusout="unfocusTodoTitle($event, item)">{{ item.title }}</span>
                        <span style="font-size: 12px; margin-top: 12px;" contenteditable @focus="focusTodoText(item)" @focusout="unfocusTodoText($event, item)">{{ item.text }}</span>
                        <div style="display: flex; align-items: center; margin-top: 12px;">
                            <div style="display: flex; align-items: center;">
                                <div v-on:click="topTodo(item)" class="app-todo-list-item-img-container" v-if="$store.state.darkTheme == false"><img src="@/assets/icons/top.png"></div>
                                <div v-on:click="topTodo(item)" class="app-todo-list-item-img-container"  v-else><img src="@/assets/icons/top-white.png"></div>
                                <div v-on:click="doneTodo(item)" class="app-todo-list-item-img-container" v-if="$store.state.darkTheme == false"><img src="@/assets/icons/done.png"></div>
                                <div v-on:click="doneTodo(item)" class="app-todo-list-item-img-container" v-else><img src="@/assets/icons/done-white.png"></div>
                                <div v-on:click="deleteTodo(item)" class="app-todo-list-item-img-container" v-if="$store.state.darkTheme == false"><img src="@/assets/icons/delete.png"></div>
                                <div v-on:click="deleteTodo(item)" class="app-todo-list-item-img-container" v-else><img src="@/assets/icons/delete-white.png"></div>
                                <div class="app-todo-list-item-img-container" v-if="$store.state.darkTheme == false"><img src="@/assets/icons/setting.png"></div>
                                <div class="app-todo-list-item-img-container" v-else><img src="@/assets/icons/setting-white.png"></div>
                            </div>
                            <span class="app-todo-list-item-datetime">创建于 {{ item.date }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { formatDateTime } from "../utils/datetime";
import { getData, saveData } from "../utils/localstorage";

export default{
    data(){
        return {
            todoList: [],
            todoLeft: [],
            todoRight: []
        }
    },

    created(){
        let data = getData();
        this.todoList = data['todoList'];
        for(let i = 0; i < this.todoList.length; i++){
            this.todoList[i].text = this.todoList[i].text.replace(/\\n/g, "\n");
        }
        this.sortTodoList();
    },

    methods: {
        createNewTodo(){
            this.todoList.push({
                id: Date.now(),
                title: "请输入标题",
                text: "请输入内容",
                date: formatDateTime(),
                notifyDate: null
            });
            this.sortTodoList();
            saveData({
                todoList: this.todoList
            });
        },

        deleteTodo(item){
            let index = this.todoList.indexOf(item);
            this.todoList.splice(index, 1);
            this.sortTodoList();
            saveData({
                todoList: this.todoList
            });
        },

        topTodo(item){
            let index = this.todoList.indexOf(item);
            this.todoList.splice(index, 1);
            this.todoList.splice(0, 0, item);
            this.sortTodoList();
            saveData({
                todoList: this.todoList
            });
        },

        doneTodo(item){
            let index = this.todoList.indexOf(item);
            this.todoList.splice(index, 1);
            this.sortTodoList();
            let data = getData();
            item.date = formatDateTime();
            data['doneList'].push(item);
            saveData({
                todoList: this.todoList,
                doneList: data['doneList']
            });
        },

        focusTodoTitle(item){
            if(item.title == "请输入标题"){
                item.title = "";
            }
        },

        unfocusTodoTitle(event, item){
            if(event.target.innerText == ""){
                item.title = "请输入标题";
            } else {
                item.title = event.target.innerText;
                event.target.innerText = item.title;
            }
            
            for(let i = 0; i < this.todoList.length; i++){
                if(this.todoList[i].id == item.id){
                    this.todoList[i] = item;
                    break;
                }
            }                                                             
            saveData({
                todoList: this.todoList
            });
        },

        focusTodoText(item){
            if(item.text == "请输入内容"){
                item.text = "";
            }
        },

        unfocusTodoText(event, item){
            if(event.target.innerText == ""){
                item.text = "请输入内容";
            } else {
                item.text = event.target.innerText;
                event.target.innerText = item.text;
            }
            
            for(let i = 0; i < this.todoList.length; i++){
                if(this.todoList[i].id == item.id){
                    this.todoList[i] = item;
                    item.text = String(item.text).replace(/\n/g, "\\n");
                    break;
                }
            }
            saveData({
                todoList: this.todoList
            });
        },

        sortTodoList(){
            this.todoLeft.length = 0;
            this.todoRight.length = 0;
            for(let i = 0; i < this.todoList.length; i++){
                if(i % 2 == 0){
                    this.todoLeft.push(this.todoList[i]);
                } else {
                    this.todoRight.push(this.todoList[i]);
                }
            }
        },

        openSetting(item){
            console.log(item);
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