<template>
  <div class="main" v-if="giavang">
    <table class="banggia">
      <thead
        style="background-color: 
    background-color: rgba(255, 0, 0, 0.5); !important"
      >
        <tr>
          <th colspan="2" rowspan="3">
            <img src="~/assets/logo.png" alt="" width="30%" height="50%" />
          </th>
          <th colspan="4" rowspan="2">
            <h1 class="textGa">DNTN VÀNG BẠC BẢO PHƯƠNG</h1>
          </th>
          <th rowspan="3"></th>
        </tr>
        <tr></tr>
        <tr>
          <th></th>
          <th colspan="2">BẢNG GIÁ VÀNG</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colspan="7">
            <div style="float: right; font-size: 20px; font-style: italic">
              {{ thoigian }}
            </div>
          </td>
        </tr>
        <tr>
          <td class="isBordered">LOẠI VÀNG</td>
          <td class="isBordered">GIÁ MUA</td>
          <td class="isBordered">GIÁ BÁN</td>
          <td colspan="4" class="isBordered">
            <div>Đơn vị tính ngàn đồng / chỉ</div>
          </td>
        </tr>
        <tr>
          <td class="isBordered">9999</td>
          <td class="isBordered">
            {{ getGiaVang(giavang, "9999", "buyingPrice") }}
          </td>
          <td class="isBordered">
            {{ getGiaVang(giavang, "9999", "sellingPrice") }}
          </td>
          <td class="isBordered" colspan="4" rowspan="4">
            <img
              class="isBordered"
              src="https://goldprice.org/charts/gold_3d_b_o_usd_x.png"
              style="height: 90%; width: 90%"
            />
          </td>
        </tr>
        <tr>
          <td class="isBordered">980</td>
          <td class="isBordered">
            {{ getGiaVang(giavang, "980", "buyingPrice") }}
          </td>
          <td class="isBordered">
            {{ getGiaVang(giavang, "980", "sellingPrice") }}
          </td>
        </tr>
        <tr>
          <td class="isBordered">710</td>
          <td class="isBordered">
            {{ getGiaVang(giavang, "750", "buyingPrice") }}
          </td>
          <td class="isBordered">
            {{ getGiaVang(giavang, "750", "sellingPrice") }}
          </td>
        </tr>
        <tr>
          <td class="isBordered">610</td>
          <td class="isBordered">
            {{ getGiaVang(giavang, "610", "buyingPrice") }}
          </td>
          <td class="isBordered">
            {{ getGiaVang(giavang, "610", "sellingPrice") }}
          </td>
        </tr>
        <tr>
          <td colspan="7">
            <marquee>
              <h1 class="textGa">
                TIỆM VÀNG BẢO PHƯƠNG - SANG TRỌNG, TINH TẾ - CHUYÊN MUA BÁN, GIA
                CÔNG ĐỒ NỮ TRANG 18K 24K - UY TÍN - CHẤT LƯỢNG HÀI LÒNG QUÝ
                KHÁCH HOTLINE : 0329.998.4983 - 0982.646.754
              </h1>
            </marquee>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  layout: "tv",
  mounted() {
    this.getGia();
    this.getThoiGian();
  },
  data() {
    return {
      giavang: null,
      thoigian: null,
    };
  },
  methods: {
    getThoiGian() {
      setInterval(() => {
        this.getThoiGian();
      }, 100);
      this.thoigian = this.$moment().format("DD/MM/YYYY hh:mm:ss");
    },
    getGiaVang(data, type, cat) {
      let result = data.find((item) => item.code == type);
      if (result) return this.$formatN(parseInt(result[cat]));
      else {
        return 0;
      }
    },
    getGia() {
      this.$supabase
        .from("banggia")
        .select()
        .then((data) => {
          this.giavang = data.data;
        });
    },
  },
};
</script>
<style scoped>
.main {
  background-image: url("~/assets/background1.gif") !important;
  background-size: cover !important; /* Hoặc bạn có thể sử dụng 'contain' tùy thuộc vào cách bạn muốn ảnh GIF được hiển thị */
  background-repeat: no-repeat !important;
}
.textGa {
  text-align: center;
  background: linear-gradient(
    to right,
    #ff0000 0%,
    /* Đỏ */ #ff7f00 14.3%,
    /* Cam */ #ffff00 28.6%,
    /* Vàng */ #00ff00 42.9%,
    /* Xanh lá */ #0000ff 57.1%,
    /* Xanh dương */ #4b0082 71.4%,
    /* Chàm */ #8b00ff 85.7%,
    /* Tím */ #8b00ff 100%
  ); /* Tím */
  background-size: 200% auto;
  color: #000;

  background-clip: text;
  text-fill-color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shine 1s linear infinite;
}
@keyframes shine {
  to {
    background-position: 200% center;
  }
}
.isBordered {
  border: 1px solid yellow;
  border-collapse: false;
  background-color: red;
}
.banggia {
  z-index: 100 !important;
  /* background-color: rgba(255, 0, 0, 0.5); */
  color: yellow;
  table-layout: fixed;
  width: 100vw;
  height: 90vh;
  border-collapse: collapse;
  overflow: hidden;
  text-align: center;
  font-size: 30px;
}
</style>
