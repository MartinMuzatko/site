import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import VeeValidate from 'vee-validate'
import App from './App.vue'
import 'bootstrap'
import "regenerator-runtime/runtime"

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(VeeValidate);

// Intro page
const Home = resolve => {
  require.ensure(['./Home.vue'], () => {
    resolve(require('./Home.vue'))
  })
}

// People page .. display persons from GitHub team
const People = resolve => {
  require.ensure(['./People.vue'], () => {
    resolve(require('./People.vue'))
  })
}

// Blog overview
const Blog = resolve => {
  require.ensure(['./Blog.vue'], () => {
    resolve(require('./Blog.vue'))
  })
}

// Detail page (blog post)
const Post = resolve => {
  require.ensure(['./Post.vue'], () => {
    resolve(require('./Post.vue'))
  })
}

// Detail page (blog post)
const Download = resolve => {
  require.ensure(['./Download.vue'], () => {
    resolve(require('./Download.vue'))
  })
}

const redirect = url => {
  return () => {
    window.location.href = url;
  }
}

const routes = [
  { path: "/home", component: Home, alias: "/", },
  { path: "/people", component: People },
  { path: "/blog", component: Blog },
  { path: "/download", component: Download },
  { path: "/post/:year/:title", component: Post },
  {
    path: "/yt",
    beforeEnter: redirect(
      "https://www.youtube.com/channel/UCKOcY8wxvWq8pGLcESSpfhw"
    )
  }
];

let routerConfig = {
  mode: 'history', // PLEASE note that this is buggy with webpack-dev-server
  routes: routes
}

if (process.env.NODE_ENV !== 'production') delete routerConfig['mode'] // This won't work in browsers, so it's fine

const router = new VueRouter(routerConfig);

router.afterEach((to, from) => {
  let from_page = from.path.substr(1,1).toUpperCase() + from.path.substr(2)
  let to_page = to.path.substr(1,1).toUpperCase() + to.path.substr(2)

  if (to.path === "/home" ||  to.path === "/") {
    document.title = "Inexor"
  }
  else if (to_page.substr(0, 4) !== "Post") {
    document.title = `Inexor | ${to_page}`;
  }

  $( "nav li" ).each(function() { // eslint-disable-line no-undef
    if ( $( this ).text() === from_page || from_page === "" || ( $( this ).text() === "Blog" && from.path.substr(1,4) === "post" ) ) { // eslint-disable-line no-undef
      $( this ).removeClass("active"); // eslint-disable-line no-undef
    }
    if ( $( this ).text() === to_page ||  ( $( this ).text() === "Home" && to.path === "/" ) || ( $( this ).text() === "Blog" && to.path.substr(1,4) === "post" ) ) { // eslint-disable-line no-undef
      $( this ).addClass("active"); // eslint-disable-line no-undef
    }
  });

})

const app = new Vue({ // eslint-disable-line no-unused-vars
  el: '#app',
  render: h => h(App),
  router,
}).$mount()
