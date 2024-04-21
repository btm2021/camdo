<template>
    <div>
        <b-overlay :show="dataReady" class="mt-5">
          
            <b-container>  <h3>KIỂM TRA CÂN</h3>
                <b-form @submit.prevent="onSubmit">
                    <b-row>
                        <b-col cols="6">
                            <b-form-group label="NGÀY KIỂM">
                                <b-form-input autocomplete="off"></b-form-input>
                            </b-form-group>
                            <b-form-group label="NGƯỜI KIỂM">
                                <b-form-input  autocomplete="off"></b-form-input>
                            </b-form-group>
                            <b-form-group label="CÒN HẠN">
                                <b-form-input  autocomplete="off"></b-form-input>
                            </b-form-group>
                            <b-form-group label="HẾT HẠN">
                                <b-form-input  autocomplete="off"></b-form-input>
                            </b-form-group>
                            <b-form-group label="CÂN KHÔNG ĐẠT">
                                <b-form-input  autocomplete="off"></b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col cols="6">
                            <b-form-group label="ĐẠT SỰ CÂN BẰNG">
                                <b-form-input  autocomplete="off"> </b-form-input>
                            </b-form-group>
                            <b-form-group label="KHÁC THƯỜNG">
                                <b-form-input  autocomplete="off"></b-form-input>
                            </b-form-group>
                            <b-form-group label="KHỐI LƯỢNG CÂN CHUẨN">
                                <b-form-input  autocomplete="off"></b-form-input>
                            </b-form-group>
                            <b-form-group label="KHỐI LƯỢNG HIỂN THỊ">
                                <b-form-input  autocomplete="off"></b-form-input>
                            </b-form-group>
                            <b-form-group label="CÂN ĐẠT">
                                <b-form-input  autocomplete="off"></b-form-input>
                            </b-form-group>

                        </b-col>
                    </b-row>




                    <b-button type="submit" variant="primary">Tạo mới kiểm cân hằng tuần</b-button>
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