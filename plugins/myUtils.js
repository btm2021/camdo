
import { config, Endpoint, S3 } from 'aws-sdk';
const CELLAR_ADDON_KEY_ID = '62e4c957f0069bcb02b970341b0e1fb3';
const CELLAR_ADDON_KEY_SECRET = 'e9fc7ca5e335b5e9a0b823d5858b66c727fffb6a59390d7803318f04f735d21c';
const CELLAR_ADDON_HOST = 'https://ceae6cba88ca971c49cdddb22ec35499.r2.cloudflarestorage.com';


config.update({ accessKeyId: CELLAR_ADDON_KEY_ID, secretAccessKey: CELLAR_ADDON_KEY_SECRET });
const endpoint = new Endpoint(CELLAR_ADDON_HOST);
const s3 = new S3({ endpoint });
function dataURItoBlob(dataURI) {
    var binary = atob(dataURI.split(",")[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: "image/webp" });
}
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
    inject('roundToThousand', (input, invoice_money) => {
        input = parseInt(input)
        if (invoice_money > 3000000) {
            return Math.max(10000, Math.ceil(input / 1000) * 1000);
        }

        // Làm tròn số đến số chẵn gần nhất chia hết cho 1000
        let rounded = Math.ceil(input / 1000) * 1000;

        // Nếu kết quả dưới 5000, trả về 5000
        return Math.max(5000, rounded);

    })

    inject('docsotien', (so) => {
        if (so === 0) return 'Không đồng';

        const donVi = ['', ' Mươi', ' Trăm', ' Ngàn', ' Triệu', ' Tỷ'];
        const chuSo = ['Không', 'Một', 'Hai', 'Ba', 'Bốn', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín'];

        let chuoi = "";
        let hauto = false;

        function docHang(trieu) {
            let tram;
            let chuc;
            let donvi;
            let ketqua = '';
            tram = parseInt(trieu / 100);
            chuc = parseInt((trieu % 100) / 10);
            donvi = trieu % 10;
            if (tram === 0 && chuc === 0 && donvi === 0) return '';
            if (tram !== 0) {
                ketqua += chuSo[tram] + donVi[2];
                if ((chuc === 0) && (donvi !== 0)) ketqua += ' Linh';
            }
            if ((chuc !== 0) && (chuc !== 1)) {
                ketqua += chuSo[chuc] + donVi[1];
                if ((chuc === 0) && (donvi !== 0)) ketqua = ketqua + ' Linh';
            }
            if (chuc === 1) ketqua += donVi[1];
            switch (donvi) {
                case 1:
                    if ((chuc !== 0) && (chuc !== 1)) {
                        ketqua += ' Mốt';
                    } else {
                        ketqua += chuSo[donvi];
                    }
                    break;
                case 5:
                    if (chuc === 0) {
                        ketqua += chuSo[donvi];
                    } else {
                        ketqua += ' Lăm';
                    }
                    break;
                default:
                    if (donvi !== 0) {
                        ketqua += chuSo[donvi];
                    }
                    break;
            }
            return ketqua;
        }

        do {
            let ty = so % 1000000000;
            so = Math.floor(so / 1000000000);
            if (so > 0) {
                chuoi = docHang(ty) + donVi[5] + chuoi;
            } else {
                chuoi = docHang(ty) + chuoi;
            }
            hauto = true;
        } while (so > 0);

        return chuoi.trim() + ' đồng';
    })
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
        return Math.round(total / 1000) * 1000;
    })
    inject('deletePicture', async (fileName) => {

        return new Promise((resolve, reject) => {
            var params = {
                Key: `${fileName}`,
                Bucket: "anhtiemvang1",
            };
            s3.deleteObject(params, (err, data) => {
                if (err) {
                    console.log(err);
                    reject(err)
                } else {
                    console.log(data);
                    resolve({ status: 'success', data })

                }
            });
        })

    })
    inject('uploadPicture', (fileName, image) => {

        return new Promise((resolve, reject) => {
            let img = dataURItoBlob(image);
            var params = {
                Key: `${fileName}.webp`,
                ContentType: "image/webp",
                Body: img,
                Bucket: "anhtiemvang1",
            };
            s3.upload(params, (err, data) => {
                if (err) {
                    console.log(err);
                    reject(err)
                } else {
                    console.log(data);
                    resolve({ status: 'success', data })

                }
            });
        })

        // Vue.prototype.$s3 = s3
        // return new Promise((resolve, reject) => {
        //     try {
        //         const apiKey = '99445a28159f1cd72b67666b9044ddee';
        //         // Dữ liệu form để gửi

        //         const data = new FormData();
        //         data.append('image', base64Image);
        //         data.append('name', fileName);

        //         // Tải lên ImgBB
        //         fetch('https://api.imgbb.com/1/upload?key=' + apiKey, {
        //             method: 'POST',
        //             body: data
        //         })
        //             .then(response => response.json())
        //             .then(data => {
        //                 resolve({ status: 'success', data })
        //             })
        //             .catch(error => {
        //                 reject({ status: 'fail', error })
        //             });

        //     } catch (err) {
        //         reject({ status: 'fail', err })
        //     }

        // })

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

    inject('getBill_code', async () => {
        return new Promise((resolve, reject) => {
            //lấy bill_code dựa trên ngày hôm nay
            app.$supabase.from('hoadon').select('id,bill_code')
                .gte('created_at', app.$moment().format('YYYY-MM-DD'))
                .lte('created_at', app.$moment().add(1, "days").format("YYYY-MM-DD"))
                .limit(1).order("id", { ascending: false }).then(data => {
                    if (data.data.length >= 1) {
                        let bill_code = data.data[0].bill_code
                        let index_bill_code = parseInt(bill_code.split('-')[0])
                        let id = index_bill_code + 1
                        resolve(`${id}-${app.$moment().format('DDMMYYYY')}`)
                    } else {
                        resolve(`1-${app.$moment().format('DDMMYYYY')}`)
                    }
                })
        })
    })
    inject('insertBill', async (item) => {
        return new Promise((resolve, reject) => {
            app.$supabase.from('hoadon').insert([item]).then(data => {
                resolve(data.data[0])
            })
        })
    })
};