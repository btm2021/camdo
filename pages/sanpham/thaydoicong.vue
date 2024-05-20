<template>
    <div>
        <b-container class="mt-5">
            <h3>Thay Đổi Công</h3>
            <b-overlay :show="overlay_ipt">

                <b-input-group>

                    <b-input @change="findSp" v-model="inputSanpham" size="lg" autocomplete="off"
                        class="text-center text-danger font-weight-bold" ref="ipt_sanpham" type="search"
                        placeholder="Mã sản phẩm..."></b-input>
                    <template #append>
                        <b-dropdown :text="!action ? 'Hành Động' : (action === 'cong') ? '+ Công' : '- Công'"
                            variant="primary">
                            <b-dropdown-item @click="action = 'cong'">Cộng (+) Thêm Công</b-dropdown-item>
                            <b-dropdown-item @click="action = 'tru'">Trừ (-) Bớt Công</b-dropdown-item>
                        </b-dropdown>

                        <b-input-group-text>
                            <b-input autocomplete="off" type="number" min="0" max="1000" v-model="congchange"></b-input>
                        </b-input-group-text>
                        <b-button variant="warning" @click="setThayDoi">Thay đổi</b-button>
                    </template>


                </b-input-group>
            </b-overlay>
            <hr />
            <b-overlay :show="overlay_tbl">
                <b-table class="text-center" small responsive bordered :fields="fieldSanpham" show-empty
                    :items="listsanpham">
                    <template #cell(maso)="data">
                        <b-badge variant="success">{{ data.value }}</b-badge>
                    </template>
                    <template #cell(stt)="data">
                        <b>{{ data.index + 1 }}</b>
                    </template>

                    <template #cell(klv)="data">
                        <code>{{ $formatSoVang(data.value).fullStr }}</code>
                    </template>
                    <template #cell(anhsanpham)="data">
                        <b-img lazy :src="data.value" style="width:50px;height:50px" center fluid />
                    </template>
                </b-table>
            </b-overlay>
        </b-container>


    </div>
</template>

<script>
export default {
    layout: 'thanhly',
    data() {
        return {
            overlay_ipt: false,
            overlay_tbl: false,
            congchange: 0,
            listsanpham: [],
            fieldSanpham: [
                { key: 'stt', label: "Stt" },
                { key: 'anhsanpham', label: "Ảnh" },
                { key: 'maso', label: "Mã Số" },
                { key: 'klv', label: "TL.Vàng" },
                { key: 'cong', label: "Công" },

            ],
            inputSanpham: null,
            action: null,
            opts_action: [
                { value: "cong", text: "+ Thêm Công" },
                { value: "tru", text: "- Trừ Công" },
            ]

        }
    },
    methods: {
        async setThayDoi() {
            if (this.action && this.congchange > 0) {
                let str = `Bạn muốn ${this.action === 'cong' ? 'Cộng thêm' : 'Trừ Bớt'} ${this.$formatN(parseInt(this.congchange) * 1000)} Tiền Công của những món trên ?`
                let x = confirm(str)
                if (x) {
                    this.overlay_ipt = true
                    this.overlay_tbl = true;
                    let r = await this.doitiencong()
                    alert(`Đã đổi tiền công cho ${this.listsanpham.length} sản phẩm`)
                    window.location.reload()

                }
            } else {
                alert('Vui Lòng Chọn Hành động và số tiền thay đổi')
            }

        },
        async doitiencong() {
            return new Promise(async (resolve, reject) => {
                for (let i = 0; i < this.listsanpham.length; i++) {
                    let tiencongmoi = 0;
                    if (this.action === 'cong') {
                        tiencongmoi = parseInt(this.listsanpham[i].cong || 0) + parseInt(this.congchange)
                    }
                    if (this.action === 'tru') {
                        tiencongmoi = parseInt(this.listsanpham[i].cong || 0) - parseInt(this.congchange)
                    }

                    await this.$supabase.from('sanpham').update({ 'cong': tiencongmoi }).eq('id', this.listsanpham[i].id)

                }
                resolve(true)
            })
        },
        async findSp() {
            this.overlay_ipt = true
            let isExist = this.listsanpham.find(i => i.maso === this.inputSanpham)
            console.log(isExist)
            if (!isExist) {
                this.overlay_tbl = true;
                let r = await this.$supabase.from("sanpham").select().eq("maso", this.inputSanpham)
                this.listsanpham.push(r.data[0])

            }

            this.inputSanpham = null
            this.$refs.ipt_sanpham.focus()
            this.overlay_tbl = false;
            this.overlay_ipt = false;
        }

    },
    mounted() {
        this.$refs.ipt_sanpham.focus()
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