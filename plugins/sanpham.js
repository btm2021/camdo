
export default async ({
    app,
    store,
    route,
    params,
    query,
    env,
    isDev,
    isHMR,
    redirect,
    error,
    $config,
}, inject) => {
    inject('sp_laygiatri', async (item) => {
        console.log(item)
        let { data, error } = await app.$supabase.from("banggia").select().eq('code', item.product_type);
        let banggia = data[0]
        let gianhap = (item.product_gold_weight * item.product_price_import) + item.product_wage_in * 1000
        let giahientai = (item.product_gold_weight * banggia.sellingPrice) + item.product_wage * 1000
        let giaxuat = item.product_status ? giahientai : item.product_total_price
        let gialech = giaxuat - gianhap
        return {
            sellingPrice: banggia.sellingPrice,
            buyingPrice: banggia.buyingPrice,
            gianhap,
            giahientai,
            giaxuat,
            gialech
        }
    })
    inject('pl_sanpham_intem', (that, list_tem) => {
        return new Promise((resolve, reject) => {
            that.$pnPublish({
                channel: 'printserver',
                message: { type: 'intem', list: list_tem }
            }, (status, response) => {
                if (status.error) {
                    console.log(status);
                    resolve(false)
                } else {
                    resolve(true)
                    console.log("Message Published", response);
                }
            });

        })
        console.log('as')
        console.log(that.$pnPublish)


    })
    inject('pl_sanpham_getOne', (item) => {
        return "pl_sanpham_getOne"
    })
    inject('pl_sanpham_getMany', (item) => {
        return "pl_sanpham_getMany"
    })

    inject('pl_sanpham_deleteOne', (item) => {
        return "pl_sanpham_getOne"
    })
    inject('pl_sanpham_deleteMany', (item) => {
        return "pl_sanpham_getOne"
    })

    inject('pl_sanpham_chuocdoOne', (item) => {
        return "pl_sanpham_getOne"
    })
    inject('pl_sanpham_chuocdoMany', (item) => {
        return "pl_sanpham_getOne"
    })

};