<template>
    <div>
      <b-container class="mt-5">
        <h3>Thanh lý</h3>
        <b-input-group>
          <b-input
            v-model="inputMaGiay"
            size="lg"
            autocomplete="off"
            type="search"
            placeholder="Mã giấy..."
            @keypress="checkMaGiay($event)"
          ></b-input>
          <b-input-group-append>
            <b-button variant="outline-success" @click="checkInvoice()"
              >Check</b-button
            >
          </b-input-group-append>
        </b-input-group>
        <hr />
      </b-container>
  
      <b-container class="mt-5">
        <b-row>
          <b-col cols="3" v-for="(invoice, index) in listInvoice" :key="index">
            <b-card class="mt-3" header="Form Data Result" no-body>
              <template #header>
                <table
                  style="
                    width: 100%;
                    height: 100%;
                    color: blue;
  
                    font-weight: bold;
                    font-size: normalize;
                  "
                >
                  <tr>
                    <td style="text-align: left">{{ invoice.customer_name }}</td>
                    <td style="text-align: right; color: red">
                      {{ invoice.invoice_number }}
                    </td>
                    <td rowspan="2">
                      <b-badge class="ml-2" variant="danger" style="cursor: pointer;">X</b-badge>
                    </td>
                  </tr>
  
                  <tr>
                    <td style="text-align: left">
                      {{ formatN(invoice.invoice_money) }}
                    </td>
                    <td style="text-align: right">
                      {{ getNgay(invoice.invoice_date_create) }}
                    </td>
                  </tr>
                </table>
              </template>
            </b-card>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        inputMaGiay: null,
        listMaGiay: [],
        listInvoice: [],
      };
    },
    methods: {
      checkInvoice() {},
      getNgay(x) {
        let date = x.split("-");
        let newDate = new Date(date[0], date[1] - 1, date[1]);
        return `${date[2]}/${date[1]}/${date[0]}`;
      },
      formatN(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      checkMaGiay(event) {
        if (event.key === ",") {
          let listMaso = this.inputMaGiay.split(",");
          // listMaso.pop();
          console.log(listMaso);
          this.listMaGiay = listMaso;
          this.getData();
        }
      },
      async getData() {
        let query = this.$supabase
          .from("invoice")
          .select(
            "id,customer_name,invoice_number,invoice_date_create,invoice_money"
          )
          .in("invoice_number", this.listMaGiay);
        let r = await query;
        this.listInvoice = r.data;
      },
    },
  };
  </script>
  
  <style>
  </style>"