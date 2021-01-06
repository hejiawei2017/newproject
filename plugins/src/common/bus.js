import Vue from 'vue';

// 使用 Event Bus
const bus = new Vue();

window.bus = bus;

export default bus;
