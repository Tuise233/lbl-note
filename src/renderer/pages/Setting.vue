<template>
    <div class="app-setting">
        <div class="app-setting-header">
            <span>系统设置</span>
        </div>
    </div>
</template>

<script>

export default{
    data(){
        return {

        }
    },

    methods: {

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
</style>