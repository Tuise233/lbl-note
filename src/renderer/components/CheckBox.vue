<template>
    <div class="app-c-checkbox" v-on:click="toggleCheckBox">
        <img src="@/assets/icons/checked.png" v-if="isCheck == true"/>
    </div>
</template>

<script>
export default {
    name: "CheckBox",
    data(){
        return {
            isCheck: this.$props.state
        }
    },

    props: {
        name: "",
        state: false,
    },
    
    methods: {
        toggleCheckBox(){
            this.isCheck = !this.isCheck;
            this.$emit("change", this.$props.name, this.isCheck);
        }
    }
}

</script>

<style lang="less" scoped>
@import "../assets/style/index.less";

.app-c-checkbox{
    width: 24px;
    height: 24px;
    background-color: @checkbox-backcolor;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 5px;
}
</style>