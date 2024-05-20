<template>
    <div>
        <b-container class="mt-5">
            <h3>Thanh Đổi Công</h3>
            <b-overlay :show="overlay_ipt">

                <b-input-group>

                    <b-input v-model="inputSanpham" size="lg" autocomplete="off"
                        class="text-center text-danger font-weight-bold" ref="ipt_sanpham" type="search"
                        placeholder="Mã sản phẩm..." @change=""></b-input>
                    <template #append>
                        <b-dropdown :text="!action ? 'Hành Động' : (action === 'cong') ? '+ Công' : '- Công'" variant="primary">
                            <b-dropdown-item @click="action = 'cong'">Cộng (+) Thêm Công</b-dropdown-item>
                            <b-dropdown-item @click="action = 'tru'">Trừ (-) Bớt Công</b-dropdown-item>
                        </b-dropdown>
                        <b-button variant="warning" @click="setThanhLy">Thay đổi</b-button>
                    </template>


                </b-input-group>
            </b-overlay>
            <hr />
        </b-container>


    </div>
</template>

<script>
export default {
    layout: 'thanhly',
    data() {
        return {
            listsanpham: [],
            inputSanpham: null,
            action: null,
            opts_action: [
                { value: "cong", text: "+ Thêm Công" },
                { value: "tru", text: "- Trừ Công" },
            ]

        }
    },
    methods: {


    },
    mounted() {
        //    this.$refs.ipt_sanpham.focus()
    }
};
</script>

<style scope>
body {
    font-family: Circular, custom-font, Helvetica Neue, Helvetica, Arial,
        sans-serif !important;

    height: 100vh;
    min-height: 100vh;
}

.my_table tr td {
    text-align: left;
    text-align: center !important;
    padding: 1px !important;
    margin: 0 !important;
}

.tdIndex {
    text-align: center !important;
}

.textLeft {
    text-align: left !important;
}

.myThClass {
    min-width: 200px !important;
    text-align: center;
}

.myThClass20percent {
    min-width: 20% !important;
    text-align: center;
}

.myThClass500px {
    min-width: 300px !important;
    text-align: center;
}

.filter_input {
    margin: 3px;
}

.my_table td:hover {
    cursor: cell;
    background-color: antiquewhite;
}
</style>