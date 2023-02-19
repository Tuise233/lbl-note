<template>
    <div class="app-main">
        <div class="app-main-header">
            <img v-on:click="top()" src="@/assets/icons/screen-top-disable.png" v-if="isAlwaysTop == false"/>
            <img v-on:click="top()" src="@/assets/icons/screen-top-enable.png" v-else/>
            <img v-on:click="minimize()" style="margin-left: 0;" src="@/assets/icons/minimize.png" />
            <img v-on:click="close()" style="margin-left: 0;" src="@/assets/icons/close.png" />
        </div>   
        <div class="app-main-content">
            <div class="app-main-tabbar">
                <div class="app-main-tabbar-header">
                    <img src="@/assets/icons/logo.png" />
                    <span>拉布拉记</span>
                </div>
                <div v-on:click="togglePage('todo')" class="app-main-tabbar-item" :class="[ currentPage == 'todo' ? 'app-main-tabbar-item-selected' : '' ]">
                    <span>待办事项</span>
                </div>
                <div v-on:click="togglePage('done')" class="app-main-tabbar-item" :class="[ currentPage == 'done' ? 'app-main-tabbar-item-selected' : '' ]">
                    <span>已完成事项</span>
                </div>
                <!-- <div v-on:click="togglePage('todocal')" class="app-main-tabbar-item" :class="[ currentPage == 'todocal' ? 'app-main-tabbar-item-selected' : '' ]">
                    <span>TODO日历</span>
                </div>
                <div v-on:click="togglePage('tools')" class="app-main-tabbar-item" :class="[ currentPage == 'tools' ? 'app-main-tabbar-item-selected' : '' ]">
                    <span>小工具</span>
                </div> -->
                <div v-on:click="togglePage('setting')" class="app-main-tabbar-item" :class="[ currentPage == 'setting' ? 'app-main-tabbar-item-selected' : '' ]">
                    <span>系统设置</span>
                </div>
                <span class="app-main-tabbar-copyright">拉布拉马 Copyright © 2023</span>
            </div>
            
            <div class="app-main-content-pages">
                <ToDo v-if="currentPage == 'todo'"/>
                <Done v-if="currentPage == 'done'"/>
                <Setting v-if="currentPage == 'setting'"/>
            </div>
        </div>
    </div>
</template>

<script> 
import { ipcRenderer } from "electron";
import { getData, saveData } from "../utils/utils";

import ToDo from "@/views/ToDo.vue";
import Done from "@/views/Done.vue";
import Setting from "@/views/Setting.vue";

export default{
    components: {
        ToDo,
        Done,
        Setting,
    },

    data(){
        return {
            currentPage: 'todo', //todo done todocal tools setting
            isAlwaysTop: false,
        }
    },

    created(){
        let data = getData();
        this.isAlwaysTop = data['alwaysTop'];

        this.$nextTick(() => {
            let state = data['darkTheme'];
            let ele = document.getElementById("app");
            if(state){
                ele.classList.remove("primary_color");
                ele.classList.add("dark_color");
            } else {
                ele.classList.remove("dark_color");
                ele.classList.add("primary_color");
            }

            ipcRenderer.send('window:initTop', this.isAlwaysTop);
        });
    },
    
    methods: {
        togglePage(name){
            this.currentPage = name;
        },

        close(){
            ipcRenderer.send('window:close');
        },

        minimize(){
            ipcRenderer.send('window:minimize');
        },

        top(){
            this.isAlwaysTop = !this.isAlwaysTop;
            ipcRenderer.send('window:top');
            saveData({
                alwaysTop: this.isAlwaysTop
            });
        },
    }
}

</script>

<style lang="less" scoped>
@import "../assets/style/index.less";

.app-main{
    width: 100vw;
    height: 100vh;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    background-color: @main-backcolor;
}

.app-main-header{
    width: 100%;
    height: 24px;
    display: flex;
    align-items: center;
    background-color: @header-backcolor;
    -webkit-app-region: drag;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}

.app-main-header img{
    width: 18px;
    height: 18px;
    margin-left: auto;
    margin-right: 10px;
    cursor: pointer;
    -webkit-app-region: no-drag;
}

.app-main-content{
    width: 100%;
    height: 100%;
    display: flex;
}

.app-main-tabbar{
    width: 180px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: @tabbar-backcolor;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
}

.app-main-tabbar-header{
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid @tabbar-header-border-color;
}

.app-main-tabbar-header img{
    width: 60px;
    height: 60px;
    margin-left: 24px;
}

.app-main-tabbar-header span{
    font-size: 18px;
    color: @tabbar-header-textcolor;
}

.app-main-tabbar-item{
    width: 100%;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 18px;
    color: @tabbar-item-disable-textcolor;
    transition: all 0.1s;
}

.app-main-tabbar-item:hover{
    background-color: @tabbar-item-hover-backcolor;
}

.app-main-tabbar-item-selected{
    background-color: @tabbar-item-enable-backcolor;
    color: @tabbar-item-enable-textcolor;
}

.app-main-tabbar-copyright{
    margin-top: auto;
    margin-bottom: 12px;
    font-size: 12px;
    color: @tabbar-item-copyright-textcolor;
}

.app-main-content-pages{
    width: calc(100% - 180px);
    height: 100%;
}
</style>