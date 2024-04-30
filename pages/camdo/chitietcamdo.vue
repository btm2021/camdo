<template>
    <b-container v-if="dataReady">
        <b-card>
            <b-card-body>
                <b-overlay :show="overlayHoadon">
                    <h1>CHI TIẾT HÓA ĐƠN <span class="text-danger font-weight-bold">{{ itemHoadon.invoice_number
                            }} </span>

                        <span v-if="itemHoadon.invoice_status">
                            <b-badge variant="success">ĐÃ CHUỘC</b-badge>
                        </span>
                        <span v-else>
                            <b-badge variant="warning">CHƯA CHUỘC</b-badge>
                        </span>
                    </h1>
                    <b-form>

                        <b-row>
                            <b-col cols="6">
                                <b-form-group label="ID Món đồ:" description="ID duy nhất của món đồ">
                                    <b-form-input disable v-model="itemHoadon.id"></b-form-input>
                                </b-form-group>
                                <b-form-group label="Tên khách :" description="Tên khách.">
                                    <b-form-input v-model="itemHoadon.customer_name"></b-form-input>
                                </b-form-group>
                                <b-form-group label="Số tiền thế:"
                                    :description="$formatSoTien(itemHoadon.invoice_money)">
                                    <b-form-input v-model="itemHoadon.invoice_money"></b-form-input>
                                </b-form-group>
                                <b-form-group label="Loại Đồ thế:"
                                    description="KIỂU ĐỒ THẾ (BÌNH THƯỜNG|THANH LÝ|MẤT GIẤY|KHÁC)">
                                    <b-form-select v-model="itemHoadon.invoice_type"
                                        :options="option_filter_type"></b-form-select>
                                </b-form-group>
                                <b-form-group label="Hình thức Đồ thế:" description="Loại thế (THẾ MỚI|ĐÓNG LÃI|KHÁC)">
                                    <b-form-select :options="option_filter_cat"
                                        v-model="itemHoadon.invoice_cat"></b-form-select>
                                </b-form-group>
                                <b-form-group label="Số điện thoại:" description="Số điện thoại của khách">
                                    <b-form-input v-model="itemHoadon.invoice_phone"></b-form-input>
                                </b-form-group>

                                <b-form-group label="Ghi chú:" description="Ghi chú">
                                    <b-form-textarea v-model="itemHoadon.invoice_comment"></b-form-textarea>
                                </b-form-group>

                            </b-col>
                            <b-col cols="6">
                                <b-form-group label="Ngày thế :" description="Ngày thế đồ">
                                    <b-form-datepicker v-model="itemHoadon.invoice_date_create"></b-form-datepicker>
                                </b-form-group>
                                <b-form-group label="Ngày lấy:" description="Ngày chuộc đồ">
                                    <b-form-datepicker v-model="itemHoadon.invoice_date_get"></b-form-datepicker>
                                </b-form-group>
                                <b-form-group label="Số ngày thế:" description="Ngày chuộc đồ">
                                    <b-form-datepicker v-model="itemHoadon.invoice_date_get"></b-form-datepicker>
                                </b-form-group>
                                <b-form-group label="Tiền lãi:" description="Ngày chuộc đồ">
                                    <b-form-datepicker v-model="itemHoadon.invoice_date_get"></b-form-datepicker>
                                </b-form-group>
                                <b-form-group label="Nơi Lưu:" description="Nơi Lưu">
                                    <b-form-select v-model="itemHoadon.invoice_store_type"
                                        :options="option_filter_store_type"></b-form-select>
                                </b-form-group>
                                <b-form-group label="Loại Lưu:" description="Loại Lưu">
                                    <b-form-select v-model="itemHoadon.invoice_store"
                                        :options="option_filter_store"></b-form-select>
                                </b-form-group>
                                <b-form-group label="Món đồ:" description="Danh sách món đồ">
                                    <b-form-tags v-model="itemTag" tag-variant="primary" remove-on-delete
                                        separator=","></b-form-tags>
                                </b-form-group>

                            </b-col>
                        </b-row>


                    </b-form>

                </b-overlay>
            </b-card-body>
        </b-card>

    </b-container>
</template>
<script>

export default {
    data() {
        return {
            dataReady: false,
            overlayHoadon: true,
            itemHoadon: null,
            itemTag: [],
            option_filter_status: [
                { value: true, text: "CHƯA CHUỘC" },
                { value: false, text: "ĐÃ CHUỘC" },
                { value: null, text: "TẤT CẢ" },
            ],
            option_filter_type: [
                "BÌNH THƯỜNG",
                "THANH LÝ",
                "MẤT GIẤY",
                "KHÁC",
            ],
            option_filter_store: [
                "BỊCH KÉO MIỆNG",
                "HỘP TRÁI BÍ TO",
                "HỘP TRÁI BÍ TRUNG",
                "HỘP TRÁI BÍ NHỎ",
                "HỘP HỒNG TRONG TO",
                "HỘP HỒNG DẸP",
                "HỘP NHUNG KIỀNG",
                "HỘP NHUNG DẸP",
                "HỘP KIỀNG",
                "KHÁC",
            ],

            option_filter_cat: [
                "THẾ MỚI",
                "ĐÓNG LÃI",
                "KHÁC",
            ],
            option_filter_store_type: [
                "KHAY",
                "KÉT",
                "KHÁC",
            ],

        }
    },
    /*
    {
    "id": 13787,
    "customer_name": "NONG",
    "invoice_number": 90577,
    "invoice_money": 2000000,
    "invoice_date_create": "2024-04-08",
    "invoice_status": true,
    "invoice_date_get": "2024-04-30",
    "invoice_comment": "không",
    "invoice_type": "BÌNH THƯỜNG",
    "invoice_profit": 32000,
    "invoice_phone": "không",
    "invoice_tag": "[\"MATDEN\"]",
    "invoice_store": "BỊCH KÉO MIỆNG",
    "invoice_store_type": "KHAY",
    "invoice_cat": "THẾ MỚI",
    "invoice_label": true,
    "id_matgiay": null
} */
    computed: {

    },
    methods: {
        getTag() {
            if (this.itemHoadon) {
                let str = String(this.itemHoadon.invoice_tag).replace("\\", "")
                let arr = JSON.parse(str)
                this.itemTag = arr
            } else {
                this.itemTag = []
            }
        }
    },
    async mounted() {
        let id = this.$route.query.id
        let result = await this.$supabase.from('invoice').select("*").eq('id', id)
        console.log(result.data[0])

        this.itemHoadon = result.data[0]
        this.getTag();
        this.dataReady = true
        this.overlayHoadon = false
    }
}
</script>