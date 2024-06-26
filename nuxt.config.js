
export default {
  /*
  ** Headers of the page
  */
  ssr: false,
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [

    '~/plugins/chart.js', '~/plugins/myUtils.js', '~/plugins/s3.js',
    '~/plugins/veevalidator.js',
    '~/plugins/sanpham.js', '~/plugins/dothe.js',
    '~/plugins/banggia.js',
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    ['nuxt-supabase', {
      //  supabaseUrl: `https://spbp.trinhminhbao.workers.dev`,
      supabaseUrl: 'https://ajsrzteoovahabndebyp.supabase.co',
      supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqc3J6dGVvb3ZhaGFibmRlYnlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNDY4NjI1OCwiZXhwIjoyMDIwMjYyMjU4fQ.Q0lBT-HTcMLxLGpKgJ_-vz-prKH43nV9czOtm2HvMzU'
    }],
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    '@nuxtjs/moment',
    '@nuxtjs/axios',
    // '@nuxtjs/sentry'

  ],


  bootstrapVue: {
    icons: true
  },
  moment: {
    plugins: [
      'moment-lunar'
    ]

  },
  /*
  ** Build configuration
  */
  build: {

    transpile: ["vee-validate/dist/rules"],
    /*
    ** You can extend webpack config here
    */
    extend(config, { isClient }) {
      if (isClient)
        config.devtool = 'eval-source-map'
      else
        config.devtool = "inline-source-map"
    }
  },
  // server: {
  //   host: "0.0.0.0"
  // }

}
