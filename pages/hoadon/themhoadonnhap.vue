<template>
    <div>
        <b-overlay :show="dataReady" class="mt-5">
          
            <b-container>  <h3>THÊM HÓA ĐƠN NHẬP</h3>
                <b-form @submit.prevent="onSubmit">
                    <b-row>
                        <b-col cols="6">
                            <b-form-group label="TÊN KHÁCH">
                                <b-form-input autocomplete="off"></b-form-input>
                            </b-form-group>
                            <b-form-group label="ĐỊA CHỈ KHÁCH">
                                <b-form-input  autocomplete="off"></b-form-input>
                            </b-form-group>
                            <b-form-group label="NGÀY TẠO HÓA ĐƠN">
                                <b-form-input  autocomplete="off"></b-form-input>
                            </b-form-group>
                            <b-form-group label="TÊN SẢN PHẨM">
                                <b-form-input  autocomplete="off"></b-form-input>
                            </b-form-group>
                            <b-form-group label="LOẠI VÀNG">
                                <b-form-input  autocomplete="off"></b-form-input>
                            </b-form-group>
                            <b-form-group label="NHÀ CUNG CẤP">
                                <b-form-input  autocomplete="off"></b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col cols="6">
                            <b-form-group label="KHỐI LƯỢNG TỔNG">
                                <b-form-input  autocomplete="off"> </b-form-input>
                            </b-form-group>
                            <b-form-group label="KHỐI LƯỢNG HỘT">
                                <b-form-input  autocomplete="off"></b-form-input>
                            </b-form-group>
                            <b-form-group label="KHỐI LƯỢNG VÀNG">
                                <b-form-input  autocomplete="off"></b-form-input>
                            </b-form-group>
                            <b-form-group label="GIÁ MUA">
                                <b-form-input  autocomplete="off"></b-form-input>
                            </b-form-group>
                            <b-form-group label="THÀNH TIỀN">
                                <b-form-input  autocomplete="off"></b-form-input>
                            </b-form-group>

                        </b-col>
                    </b-row>




                    <b-button type="submit" variant="primary">Tạo mới hóa đơn nhập</b-button>
                </b-form>

            </b-container>
        </b-overlay>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dataReady: false
        }
    },
    methods: {
        onSubmit(event) {
            this.dataReady = true
        },

    }
}
</script>