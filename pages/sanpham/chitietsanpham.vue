<template>
    <b-container>


        <div v-if='itemHoadon' style="font-size: 20px;" class="mt-5 border">
            <h4 class="text-center">CHI TIẾT SẢN PHẨM </h4>
            <b-table-simple small hover bordered responsive fixed>
                <b-tbody>
                    <b-tr>
                        <b-td>
                            <span class="title">Mã Hóa đơn Nhập</span>
                        </b-td>
                        <b-td>
                            <div class="">
                                <a :href="'/hoadon/chitiethoadonnhap?id=' + itemHoadon.sotheodoimuahang.id">{{
                                    itemHoadon.id }}</a>
                            </div>
                        </b-td>
                    </b-tr>
                    <b-tr>
                        <b-td>
                            <span class="title">Ngày nhập</span>
                        </b-td>
                        <b-td>
                            <div class="">
                                {{ $moment(itemHoadon.sotheodoimuahang.created_at).format('DD/MM/YYYY') }}
                            </div>
                        </b-td>
                    </b-tr>
                    <b-tr>
                        <b-td>
                            <span class="title">Tên khách nhập</span>
                        </b-td>
                        <b-td>
                            <div class="">
                                {{ itemHoadon.sotheodoimuahang.tenkhach }}
                            </div>
                        </b-td>
                    </b-tr>
                    <b-tr>
                        <b-td>
                            <span class="title">Địa chỉ</span>
                        </b-td>
                        <b-td>
                            <div class="">
                                {{ itemHoadon.sotheodoimuahang.diachi }}
                            </div>
                        </b-td>
                    </b-tr>
                    <b-tr>
                        <b-td>
                            <span class="title">Khối lượng tổng</span>
                        </b-td>
                        <b-td>
                            <div class="">
                                {{ $formatSoVang(itemHoadon.klt).fullStr }}
                            </div>
                        </b-td>
                    </b-tr>
                    <b-tr>
                        <b-td>
                            <span class="title">Khối lượng Hột</span>
                        </b-td>
                        <b-td>
                            <div class="">
                                {{ $formatSoVang(itemHoadon.klh).fullStr }}
                            </div>
                        </b-td>
                    </b-tr>
                    <b-tr>
                        <b-td>
                            <span class="title">Khối lượng Vàng nhập</span>
                        </b-td>
                        <b-td>
                            <div class="">
                                {{ $formatSoVang(itemHoadon.klv).fullStr }}
                            </div>
                        </b-td>
                    </b-tr>
                    <b-tr>
                        <b-td>
                            <span class="title">Sản phẩm</span>
                        </b-td>
                        <b-td>
                            <div class="">
                                {{ itemHoadon.name }}
                            </div>
                        </b-td>
                    </b-tr>
                    <b-tr>
                        <b-td>
                            <span class="title">Mã Sản phẩm</span>
                        </b-td>
                        <b-td>
                            <a :href="'/sanpham/chitietsanpham?id=' + itemHoadon.id">{{
                                itemHoadon.maso }}</a>

                        </b-td>
                    </b-tr>
                    <b-tr>
                        <b-td>
                            <span class="title">Giá nhập Sản phẩm</span>
                        </b-td>
                        <b-td>
                            {{ $formatN(itemHoadon.sotheodoimuahang.thanhtien) }} VNĐ
                        </b-td>
                    </b-tr>
                    <b-tr>
                        <b-td>
                            <span class="title">Ghi chú nhập</span>
                        </b-td>
                        <b-td>
                            <div class="">
                                {{ itemHoadon.sotheodoimuahang.ghichu }}
                            </div>
                        </b-td>
                    </b-tr>
                    <b-tr>

                        <b-td colspan="2">
                            <b-img :src="itemHoadon.anhsanpham">

                            </b-img>

                        </b-td>
                    </b-tr>
                </b-tbody>
            </b-table-simple>

        </div>
    </b-container>
</template>

<script>
export default {
    data() {
        return {
            itemHoadon: null
        };
    },
    async mounted() {
        console.log(this.$route.query.id);
        let id = this.$route.query.id
        if (id) {
            let data = await this.$supabase.from("sanpham").select("*,nhacungcap(*),banggia(*),sotheodoimuahang(*)").eq('id', id)
            this.itemHoadon = data.data[0]
            this.itemHoadon.sotheodoimuahang=this.itemHoadon.sotheodoimuahang[0]
        }
        //
    },
    methods: {},
};
</script>

<style></style>