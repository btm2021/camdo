
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