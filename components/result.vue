<template>
  <div style="border: 1px solid black; min-height: 300px">
    <b-row>
      <b-col cols="12">
        <div class="container1">
          <img src="/ai.webp" alt="Avatar" />
          <p>Hello. How are you today?</p>
          <span class="time-right">11:00</span>
        </div>

        <div class="container1 darker">
          <img src="/bao.webp" alt="Avatar" class="right" />
          <p>Hey! I'm fine. Thanks for asking!</p>
          <span class="time-left">11:01</span>
        </div>

        <div class="container1">
          <img src="/w3images/bandmember.jpg" alt="Avatar" />
          <p>Sweet! So, what do you wanna do today?</p>
          <span class="time-right">11:02</span>
        </div>

        <div class="container1 darker">
          <img src="/w3images/avatar_g2.jpg" alt="Avatar" class="right" />
          <p>Nah, I dunno. Play soccer.. or learn more coding perhaps?</p>
          <span class="time-left">11:05</span>
        </div>
        <div>
          <b>{{ item.questionFromUI }}</b>
          <b>SQL{{ item.sql }}</b>
        </div>
      </b-col>

      <b-col cols="12">
        <pre>
            {{ JSON.parse(item.resultQuery) }}
        </pre>
        <b-table :items="[1, 2, 3, 4, 5]" show-empty></b-table>
      </b-col>
    </b-row>
  </div>
</template>


<script>
//  question
//  info:{

//}
//
//
export default {
  props: ["item"],
  data() {
    return {};
  },
};
</script>

<style>
.container1 {
  border: 2px solid #dedede;
  background-color: #f1f1f1;
  border-radius: 5px;
  padding: 10px;
  margin: 10px 0;
}

/* Darker chat container */
.darker {
  border-color: #ccc;
  background-color: #ddd;
}

/* Clear floats */
.container1::after {
  content: "";
  clear: both;
  display: table;
}

/* Style images */
.container1 img {
  float: left;
  max-width: 60px;
  width: 100%;
  margin-right: 20px;
  border-radius: 50%;
}

/* Style the right image */
.container1 img.right {
  float: right;
  margin-left: 20px;
  margin-right:0;
}

/* Style time text */
.time-right {
  float: right;
  color: #aaa;
}

/* Style time text */
.time-left {
  float: left;
  color: #999;
}
</style>