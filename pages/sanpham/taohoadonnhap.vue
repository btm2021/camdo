<template>
    <b-container>
        <b-card class="mt">
            <b-row v-if="!dataReady">
                <b-col cols="12">
                    <b-progress height="5rem" :value="value" :max="max" show-progress animated>
                        <b-progress-bar :value="value">
                            <span>Tiến trình: <strong>{{ value.toFixed(2) }} / {{ max }}</strong></span>
                        </b-progress-bar>
                    </b-progress>
                </b-col>
            </b-row>


            <b-overlay :show="!dataReady">
                <b-row>

                    <b-col cols="12">
                        <table style="width: 100%">
                            <tr>
                                <td v-for="(src, index) in imageSrcs" :key="index">
                                    <b-img style="width: 100px; height: 100px" :src="src.url" alt="Preview Image" fluid
                                        class="mb-2"></b-img>
                                </td>
                            </tr>
                            <tr>
                                <td v-for="(src, index) in imageSrcs" :key="index">
                                    <b-button variant="danger" @click="removeImage(src)">Xóa</b-button>
                                </td>
                            </tr>
                        </table>
                        <ValidationObserver v-slot="{ invalid }" ref="formThem">

                            <b-form @submit.prevent="taomoi">
                                <ValidationProvider rules="required" v-slot="{ errors, valid, failedRules }">

                                    <b-form-group label="Ngày Tạo Hóa Đơn">
                                        <b-form-datepicker :state="valid" v-model="formHoadon.ngaytao"
                                            autocomplete="off"></b-form-datepicker>
                                        <b-form-invalid-feedback>
                                            Nhập sai ngày tạo hóa đơn
                                        </b-form-invalid-feedback>
                                    </b-form-group>

                                </ValidationProvider>
                                <ValidationProvider rules="required" v-slot="{ errors, valid, failedRules }">
                                    <b-form-group label="Nhà cung cấp">
                                        <b-select :state="valid" v-model="formHoadon.id_nhacungcap"
                                            :options="listnhacungcap"></b-select>
                                        <b-form-invalid-feedback>
                                            Thiếu nhà cung cấp
                                        </b-form-invalid-feedback>
                                    </b-form-group>
                                </ValidationProvider>

                                <b-form-group label="Thông tin hóa đơn">
                                    <b-form-textarea v-model="formHoadon.thongtin" placeholder="Nhập gì đó..." rows="3"
                                        max-rows="6"></b-form-textarea>
                                </b-form-group>

                                <ValidationProvider rules="required" v-slot="{ errors, valid, failedRules }">
                                    <b-form-group label="Ảnh">
                                        <b-form-file :state="valid" v-model="files"
                                            placeholder="Chọn file hoặc chụp ảnh..." accept="image/*" :capture="true"
                                            @change="handleFilesChange"></b-form-file>
                                        <b-form-invalid-feedback>
                                            Thiếu file ảnh
                                        </b-form-invalid-feedback>
                                    </b-form-group>
                                </ValidationProvider>
                                <b-button block type="submit" class="mt-2" variant="primary">Tạo hóa đơn</b-button>
                            </b-form>
                        </ValidationObserver>
                    </b-col>
                </b-row>
            </b-overlay>

        </b-card>
    </b-container>
</template>
<script>
import { v4 as uuidv4 } from "uuid";
import Compressor from "compressorjs";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { extend, configure } from "vee-validate";
import * as rules from "vee-validate/dist/rules";
Object.keys(rules).forEach((rule) => {
    extend(rule, rules[rule]);
});

export default {
    components: {
        ValidationProvider,
        ValidationObserver,
    },
    data() {
        return {
            max: 0,
            value: 0,
            dataReady: false,
            listnhacungcap: [],
            listsanpham: [],
            ngaychon: null,
            files: [],
            fileCompress: [],
            imageSrcs: [],
            formHoadon: {
                ngaytao: null,
                id_nhacungcap: null,
                thongtin: "không"
            }
        }
    },
    mounted() {
        this.getNhacungcap();
    },
    methods: {
        taomoi() {
            this.$refs.formThem.validate().then(async (data) => {
                if (data) {
                    this.dataReady = false;
                    this.max = this.imageSrcs.length * 2 + 1;

                    //đủ, tạo hóa đơn id trước
                    let objectInsert = {
                        id_nhacungcap: this.formHoadon.id_nhacungcap,
                        ngaytao: this.formHoadon.ngaytao,
                        ghichu: this.formHoadon.thongtin

                    }
                    let hoadon = await this.$supabase.from('hoadonnhap').insert(objectInsert)
                    hoadon = hoadon.data[0]
                    console.log(hoadon)
                    this.value++;
                    //upload lên storage
                    for (let i = 0; i < this.imageSrcs.length; i++) {
                        let f = await this.compressfile(this.imageSrcs[i].file);
                        let name = `hoadon_${uuidv4()}_${hoadon.id}.jpg`;
                        let anhUpload = await this.$supabase.storage
                            .from("anh")
                            .upload(name, f, {
                                cacheControl: "3600",
                                upsert: false,
                            });
                        this.value++;
                        console.log(anhUpload, hoadon);
                        let recordAnh = await this.$supabase.from("hinhanh").insert({
                            link: `https://ajsrzteoovahabndebyp.supabase.co/storage/v1/object/public/${anhUpload.data.Key}`, //anhUpload.data.Key,
                            id_hoadonnhap: hoadon.id,
                            loaianh: "HOADON",
                        });
                        this.value++;
                        console.log(recordAnh);
                    }
                    //reset
                    this.dataReady = true;
                    console.log(this.listnhacungcap)
                    let name = this.listnhacungcap.filter(i => i.value === this.formHoadon.id_nhacungcap)
                    console.log(name)
                    let str = `Tạo hóa đơn ngày ${this.$moment(this.formHoadon.ngaytao).format('DD/MM/YYYY')} MÃ [${hoadon.mahoadon}] - Nhà cung cấp ${name[0].text}`
                    alert(str)
                    window.location.reload()

                }
            })
        },
        compressfile(file) {
            return new Promise((resolve, reject) => {
                new Compressor(file, {
                    quality: 0.2,
                    success(result) {
                        resolve(result)
                    },
                    error: reject
                });
            });
        },
        handleFilesChange(event) {
            this.files = Array.from(event.target.files); // Lấy tất cả các file được chọn
            this.files.map((file) => {
                this.imageSrcs.push({ url: URL.createObjectURL(file), file });
            });
        },
        removeImage(src) {
            this.imageSrcs = this.imageSrcs.filter((i) => i != src);
        },
        insertAnh() {

        },
        insertHoaDon() {

        },
        getNhacungcap() {
            this.$supabase.from('nhacungcap').select().then(data => {
                this.listnhacungcap = data.data.map(item => {
                    return {
                        text: item.name,
                        value: item.id
                    }
                })
                this.dataReady = true
            })
        }
    }
}

</script>