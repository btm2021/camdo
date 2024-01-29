
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


Vue.directive('zoom-on-hover', {
    bind(el) {
        // Tạo và cấu hình phần tử popup zoom
        const zoomLens = document.createElement('div');
        window.zoomLens = zoomLens;
        zoomLens.style.position = 'absolute';
        zoomLens.style.border = '1px solid #d4d4d4';
        zoomLens.style.width = '200px';
        zoomLens.style.height = '200px';
        zoomLens.style.visibility = 'hidden';
        zoomLens.style.zIndex = "9999";

        // Thêm zoomLens vào DOM
        document.body.appendChild(zoomLens);

        // Xử lý sự kiện chuột
        el.addEventListener('mousemove', (e) => {
            zoomLens.style.visibility = 'visible';
            const rect = el.getBoundingClientRect();

            // Tính toán vị trí của zoomLens
            let lensX = e.clientX - rect.left - zoomLens.offsetWidth / 2;
            let lensY = e.clientY - rect.top - zoomLens.offsetHeight / 2;

            // Giới hạn vị trí của zoomLens bên trong hình ảnh
            lensX = Math.max(0, Math.min(lensX, el.offsetWidth - zoomLens.offsetWidth));
            lensY = Math.max(0, Math.min(lensY, el.offsetHeight - zoomLens.offsetHeight));

            zoomLens.style.left = lensX + 'px';
            zoomLens.style.top = lensY + 'px';

            // Tính toán và áp dụng thuộc tính transform cho zoomLens
            const scaleX = el.naturalWidth / el.offsetWidth;
            const scaleY = el.naturalHeight / el.offsetHeight;
            zoomLens.style.backgroundImage = `url('${el.src}')`;
            zoomLens.style.backgroundRepeat = 'no-repeat';
            zoomLens.style.backgroundSize = `${el.offsetWidth * scaleX}px ${el.offsetHeight * scaleY}px`;
            zoomLens.style.backgroundPosition = `-${lensX * scaleX}px -${lensY * scaleY}px`;
        });

        el.addEventListener('mouseout', () => {
            zoomLens.style.visibility = 'hidden';
        });
    }
});