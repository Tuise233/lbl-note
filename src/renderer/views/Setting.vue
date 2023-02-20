<template>
    <div class="app-setting">
        <div class="app-setting-header">
            <span>系统设置</span>
        </div>
        <div class="app-setting-content">
            <span style="margin-top: 24px; margin-left: 24px;">常规</span>
            <div class="app-setting-content-item">
                <div class="app-setting-content-item-row">
                    <span>开机自动启动</span>
                    <CheckBox name="autoboot" :state="isAutoBoot" v-on:change="onCheckBoxChange"/>
                </div>

                <div class="app-setting-content-item-row">
                    <span>待办事项系统弹窗提醒</span>
                    <CheckBox name="notify" :state="isNotify" v-on:change="onCheckBoxChange"/>
                </div>

                <div class="app-setting-content-item-row">
                    <span>颜色主题</span>
                    <ToggleBox name="theme" :state="darkTheme" leftText="常规" rightText="黑色" v-on:change="onToggleBoxChange"/>
                </div>
            </div>
            <span style="margin-top: 24px; margin-left: 24px;">数据</span>
            <div class="app-setting-content-item">
                <div class="app-setting-content-item-row">
                    <span>初始化</span>
                    <button v-on:click="clearData">清空数据</button>
                </div>

                <div class="app-setting-content-item-row">
                    <span>远程数据</span>
                    <button>拉取数据</button>
                </div>

                <div class="app-setting-content-item-row">
                    <span>本地数据</span>
                    <button>上传数据</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CheckBox from "../components/CheckBox.vue";
import ToggleBox from "../components/ToggleBox.vue";
import { ipcRenderer } from "electron";
import { clearData, getData, saveData, toggleTheme } from "../utils/utils";

export default{
    data(){
        return {
            isAutoBoot: true,
            isNotify: false,
            darkTheme: false
        }
    },

    created(){
        let data = getData();
        this.isAutoBoot = data['autoBoost'];
        this.darkTheme = data['darkTheme'];
    },

    components: {
        CheckBox,
        ToggleBox
    },

    methods: {
        onCheckBoxChange(name, state){
            switch(name){
                case "autoboot":{
                    this.isAutoBoot = state;
                    ipcRenderer.send('window:toggleAutoBoot', this.isAutoBoot);
                    saveData({
                        autoBoost: this.isAutoBoot
                    });
                    break;
                }
            }
        },

        onToggleBoxChange(name, state){
            switch(name){
                case "theme":{
                    this.darkTheme = state;
                    toggleTheme(state);
                    saveData({
                        darkTheme: this.darkTheme
                    });
                    break;
                }
            }
        },
        
        clearData(){
            clearData();
        }
    }
}

</script>

<style lang="less" scoped>
@import "../assets/style/index.less";
.app-setting{
    width: 100%;
    height: 100%;
}

.app-setting-header{
    width: 100%;
    height: 60px;
    display: flex;
    color: @todo-header-textcolor;
    border-bottom: 1px solid @todo-header-border-color;
}

.app-setting-header span{
    align-self: center;
    font-size: 24px;
    margin-top: 9px;
    margin-left: 24px;
}

.app-setting-content{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    color: @setting-textcolor;
    font-size: 18px;
}

.app-setting-content-item{
    width: 622px;
    box-sizing: border-box;
    padding: 24px;
    border-radius: 5px;
    align-self: center;
    margin-top: 6px;
    background-color: @setting-item-backcolor;
}

.app-setting-content-item-row{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 574px;
    align-self: center;
    margin-top: 24px;
}

.app-setting-content-item-row:first-child{
    margin-top: 0;
}

.app-setting-content-item-row button{
    width: 96px;
    height: 24px;
    outline: none;
    border: none;
    color: @togglebox-textcolor;
    background-color: @togglebox-disable-backcolor;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
}
</style>