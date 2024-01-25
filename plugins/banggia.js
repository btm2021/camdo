
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
    $config
}, inject) => {


    inject('pl_banggia_getOne', (list_tem) => {
        return "làm gì với in tem"
    })

    inject('pl_banggia_getAll', (list_tem) => {
        return "làm gì với in tem"
    })

    inject('pl_banggia_edit', (list_tem) => {
        return "làm gì với in tem"
    })

    inject('pl_banggiamihong_getAll', (list_tem) => {
        return "làm gì với in tem"
    })



};