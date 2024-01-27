
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
    var profitPercent = 2;
    inject('formatN', (x) => {
        x = parseFloat(x)
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    })
    inject('getBangGia', () => {
        return new Promise((resolve, reject) => {
            app.$supabase
                .from("banggia")
                .select()
                .order("id", { ascending: true })
                .then((data) => {
                    resolve(data)
                });
        })

    })


    inject('getCountDateComponent', (item) => {
        let dateStart;
        let dateEnd;
        dateStart = item.invoice_date_create;

        if (item.invoice_status) {
            dateEnd = item.invoice_date_get;
            //đã chuộc, invoice_status : false. => đã chuộc, lấy ra invoice_date_get
        } else {
            dateEnd = new Date();
            //chưa chuộc, lấy ra invoice_date_create - now
        }
        let count = app.$getCountDate(dateStart, dateEnd);
        return count + 1;
    })
    inject('getCountDate', (dateStart, dateEnd) => {
        let _dateStart = app.$moment(dateStart);
        let _dateEnd = app.$moment(dateEnd);
        let count = _dateEnd.diff(_dateStart, "days");
        return count + 1;
    })

    inject('getTongTien', (itemEdit) => {
        let dayCount = app.$getCountDateComponent(itemEdit);
        let profitPercent = profitPercent / 3;
        let result =
            (dayCount * parseInt(itemEdit.invoice_money) * profitPercent) /
            1000;
        let total =
            parseInt(result.toFixed(0)) + parseInt(itemEdit.invoice_money);
        return total;
    })
    inject('uploadPicture', ({ fileName, base64Image }) => {
        return new Promise((resolve, reject) => {
            try {
                const apiKey = '99445a28159f1cd72b67666b9044ddee';
                // Dữ liệu form để gửi

                const data = new FormData();
                data.append('image', base64Image);
                data.append('name', fileName);

                // Tải lên ImgBB
                fetch('https://api.imgbb.com/1/upload?key=' + apiKey, {
                    method: 'POST',
                    body: data
                })
                    .then(response => response.json())
                    .then(data => {
                        resolve({ status: 'success', data })
                    })
                    .catch(error => {
                        reject({ status: 'fail', error })
                    });

            } catch (err) {
                reject({ status: 'fail', err })
            }

        })

        // let pictureObject = {
        //     name,
        //     URL,
        //     product_code,
        // }
        // return pictureObject;
    })
    inject("formatSoVang", (t) => {
        if (0 == t || null == t || null == t)
            return {
                fullStr: 0,
                raw: 0
            };
        var e = String(t);
        let fullStr = t >= 1e4 ? e.toString().replace(/\B(?=(\d{4})+(?!\d))/g, "L") : 1e3 <= t && t < 1e4 ? e.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "c") : 100 <= t < 1e3 ? e.toString().replace(/\B(?=(\d{2})+(?!\d))/g, "p") : void 0
        let objectFormat = {
            fullStr,
            raw: parseInt(t)
        }
        return objectFormat
    })
    inject("showToast", (x) => {
        console.log('showToast call')
    })
    inject("formatSoTien", (x) => {
        if (0 == x || null == x || null == x) {
            return 0;
        }
        else {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

    })
};