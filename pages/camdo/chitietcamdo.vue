<template>
    <b-container v-if="dataReady" class="mt-5">
        <b-overlay :show="overlayHoadon">
            <h1>CHI TIẾT HÓA ĐƠN <span class="text-danger font-weight-bold">{{ itemHoadon.invoice_number }}</span></h1>
            <b-form>

                <b-row>
                    <b-col cols="6">
                        <b-form-group label="ID Món đồ:" description="ID duy nhất của món đồ">
                            <b-form-input disable v-model="itemHoadon.id"></b-form-input>
                        </b-form-group>
                        <b-form-group label="Tên khách :" description="Tên khách.">
                            <b-form-input v-model="itemHoadon.customer_name"></b-form-input>
                        </b-form-group>
                        <b-form-group label="Số tiền thế:" :description="$formatSoTien(itemHoadon.invoice_money)">
                            <b-form-input v-model="itemHoadon.invoice_money"></b-form-input>
                        </b-form-group>
                        <b-form-group label="Loại Đồ thế:" :description="$formatSoTien(itemHoadon.invoice_money)">
                            <b-form-select v-model="itemHoadon.invoice_type"
                                :options="option_invoice_type"></b-form-select>
                        </b-form-group>
                        <b-form-group label="Hình thức Đồ thế:" :description="$formatSoTien(itemHoadon.invoice_money)">
                            <b-form-input v-model="itemHoadon.invoice_money"></b-form-input>
                        </b-form-group>
                        <b-form-group label="Số điện thoại:" :description="$formatSoTien(itemHoadon.invoice_money)">
                            <b-form-input v-model="itemHoadon.invoice_money"></b-form-input>
                        </b-form-group>

                        <b-form-group label="Ghi chú:" :description="$formatSoTien(itemHoadon.invoice_money)">
                            <b-form-input v-model="itemHoadon.invoice_money"></b-form-input>
                        </b-form-group>

                    </b-col>
                    <b-col cols="6">
                        <b-form-group label="Ngày thế :" description="We'll never share your email with anyone else.">
                            <b-form-input></b-form-input>
                        </b-form-group>
                        <b-form-group label="Ngày lấy:" description="We'll never share your email with anyone else.">
                            <b-form-input></b-form-input>
                        </b-form-group>
                        <b-form-group label="Nơi Lưu:" description="We'll never share your email with anyone else.">
                            <b-form-input></b-form-input>
                        </b-form-group>
                        <b-form-group label="Loại Lưu:" description="We'll never share your email with anyone else.">
                            <b-form-input></b-form-input>
                        </b-form-group>
                        <b-form-group label="Món đồ:" description="We'll never share your email with anyone else.">
                            <b-form-input></b-form-input>
                        </b-form-group>
                        <b-form-group label="Email address:"
                            description="We'll never share your email with anyone else.">
                            <b-form-input></b-form-input>

                        </b-form-group>
                    </b-col>
                </b-row>


            </b-form>
            <b-card class="mt-3" header="Form Data Result">
                <pre class="m-0">{{ itemHoadon }}</pre>
            </b-card>
        </b-overlay>
    </b-container>
</template>
<script>

export default {
    data() {
        return {
            dataReady: false,
            overlayHoadon: true,
            itemHoadon: null,
            option_invoice_type: [
                { value: "", text: "" }
            ],

        }
    },
    async mounted() {
        let id = this.$route.query.id
        let result = await this.$supabase.from('invoice').select("*").eq('id', id)

        this.itemHoadon = result.data[0]
        this.dataReady = true
        this.overlayHoadon = false
    }
}
</script>