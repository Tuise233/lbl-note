<template>
    <div class="app-c-togglebox" v-on:click="toggleBox">
        <div class="app-c-togglebox-item" :class="cState == false ? 'app-c-togglebox-item-enable' : ''">
            <span>{{ leftText }}</span>
        </div>
        <div class="app-c-togglebox-item" :class="cState == true ? 'app-c-togglebox-item-enable' : ''">
            <span>{{ rightText }}</span>
        </div>
    </div>
</template>

<script>

export default{
    name: "ToggleBox",
    props:{
        name: "",
        leftText: "",
        rightText: "",
        state: false
    },
    data(){
        return {
            cState: this.$props.state
        }
    },
    methods: {
        toggleBox(){
            this.cState = !this.cState;
            this.$emit("change", this.$props.name, this.cState);
        }
    }
}

</script>

<style lang="less">
@import "../assets/style/index.less";

.app-c-togglebox{
    width: 96px;
    height: 24px;
    display: flex;
}

.app-c-togglebox-item{
    width: 48px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: @togglebox-textcolor;
    background-color: @togglebox-disable-backcolor;
    cursor: pointer;
}

.app-c-togglebox-item:first-child{
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
}

.app-c-togglebox-item:nth-child(2){
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
}

.app-c-togglebox-item-enable{
    background-color: @togglebox-enable-backcolor;
}
</style>