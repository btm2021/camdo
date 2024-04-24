<template>
    <div>
        <b-card>
            <b-row>
                <b-col cols="12">
                    <a href="/sanpham/taohoadonnhap">Tạo mới hóa đơn nhập hàng chành</a>
                </b-col>
                <b-col cols="6">
                    Danh sách hóa đơn
                </b-col>

                <b-col cols="6">
                    Danh sách sản phẩm
                </b-col>
            </b-row>
        </b-card>
    </div>
</template>
<script>

export default {
    data() {
        return {
            listhoadon: [],
            listsanpham: [],
            ngaychon: null,
        }
    },
    mounted() {

    },
    method: {
        getListhoadon() {

        },
        getListsanpham(dateranger) {

        }
    }
}

</script>