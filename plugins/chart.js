
import Vue from 'vue'
import VueApexCharts from 'vue-apexcharts'
//pubnub
import PubNubVue from 'pubnub-vue';
Vue.use(PubNubVue, {
    subscribeKey: 'sub-c-1db3ee38-8f0e-11eb-968e-467c259650fa',
    publishKey: 'pub-c-2ecffcb0-ec4c-44c3-a88a-6f19b13057c3'
});

Vue.use(VueApexCharts)

Vue.component('apexchart', VueApexCharts)
import VueTheMask from 'vue-the-mask'
Vue.use(VueTheMask)

