export const state = () => ({
    sanpham_optionCatalog: [
        { text: "NHẪN NỮ", value: "NT" },
        { text: "NHẪN CƯỚI", value: "NC" },
        { text: "NHẪN NAM", value: "NN" },
        { text: "BÔNG LỚN", value: "BL" },
        { text: "BÔNG EM BÉ", value: "BE" },
        { text: "DÂY LỚN", value: "DL" },
        { text: "DÂY EM BÉ", value: "DE" },
        { text: "MẶT", value: "MD" },
        { text: "VÒNG TRƠN", value: "VT" },
        { text: "VÒNG KIỂU", value: "VK" },
        { text: "VÒNG EM BÉ", value: "VE" },
        { text: "LẮC LỚN", value: "LL" },
        { text: "LẮC EM BÉ", value: "LE" },
        { text: "KIỀNG 18K", value: "KT" },
        { text: "KIỀNG CƯỚI", value: "KC" },
        { text: "XIMEN", value: "XM" },
        { text: "KHÁC", value: "KK" },
    ],
    sanpham_optionCatalog_view: [
        { text: "NHẪN NỮ", value: "NT" },
        { text: "NHẪN CƯỚI", value: "NC" },
        { text: "NHẪN NAM", value: "NN" },
        { text: "BÔNG LỚN", value: "BL" },
        { text: "BÔNG EM BÉ", value: "BE" },
        { text: "DÂY LỚN", value: "DL" },
        { text: "DÂY EM BÉ", value: "DE" },
        { text: "MẶT", value: "MD" },
        { text: "VÒNG TRƠN", value: "VT" },
        { text: "VÒNG KIỂU", value: "VK" },
        { text: "VÒNG EM BÉ", value: "VE" },
        { text: "LẮC LỚN", value: "LL" },
        { text: "LẮC EM BÉ", value: "LE" },
        { text: "KIỀNG 18K", value: "KT" },
        { text: "KIỀNG CƯỚI", value: "KC" },
        { text: "XIMEN", value: "XM" },
        { text: "KHÁC", value: "KK" },
        { text: "TOÀN BỘ", value: null },
    ],
    sanpham_optionLoaiVang: [
        { text: "Vàng 9999", value: "9999" },
        { text: "Vàng 980", value: "980" },
        { text: "Vàng 710", value: "710" },
        { text: "Vàng 610", value: "610" },
    ],
    sanpham_optionLoaiVang_view: [
        { text: "Vàng 9999", value: "9999" },
        { text: "Vàng 980", value: "980" },
        { text: "Vàng 710", value: "710" },
        { text: "Vàng 610", value: "610" },
        { text: "TOÀN BỘ", value: null }
    ],
})

export const getters = {
    optionCatalog(state) {
        return state.optionCatalog
    }
}