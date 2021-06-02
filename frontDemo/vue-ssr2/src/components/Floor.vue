<template>
    <div class="floor">
        <div class="title">定位导航</div>
        <b-list-group v-b-scrollspy:pageList>
            <b-list-group-item v-for="(item,index) of floorData.positionArr" :key="index" :href="item.id">{{item.text}}</b-list-group-item>
        </b-list-group>
    </div>
</template>

<script>
    export default {
        name: "Floor",
        props: {
            floorData: {
                type: Object,
                required: true
            }
        }
    }
</script>

<style scoped>

</style>
