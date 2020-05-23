<template>
    <div id="card">
        <header>
            <img class="avatar" v-bind:src="this.img" v-bind:alt="user.name">
            <p class="name">{{user.name}}</p>
        </header>
        <footer>
            <input class="search" type="text" v-model="$store.state.filterKey" placeholder="search user..." style="width: 150px">
        </footer>
    </div>
</template>

<script>
	import img4 from '../../assets/userface4.jpg';

    export default {
    name: 'card',
        data()
    {
        return {
        	img:img4,
            user: JSON.parse(window.sessionStorage.getItem("user"))
        }
    }
    }
</script>

<style lang="scss" scoped>
    #card {
        padding: 12px;

        .avatar {
            width: 40px;
            height: 40px;
            vertical-align: middle; /*这个是图片和文字居中对齐*/
        }

        .name {
            display: inline-block;
            padding: 10px;
            margin-bottom: 15px;
            font-size: 16px;
        }

        .search {
            background: #26292E;
            height: 30px;
            line-height: 30px;
            padding: 0 10px;
            border: 1px solid #3a3a3a;
            border-radius: 4px;
            outline: none; /*鼠标点击后不会出现蓝色边框*/
            color: #FFF;
        }
    }
</style>
