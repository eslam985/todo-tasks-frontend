import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './api/interceptors.js'
import './assets/main.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {
    faEye,
    faTrash,
    faAnglesLeft,
    faAnglesRight,
    faPenToSquare,
    faUsersSlash,
    faSpinner,
    faIdCard,
    faEnvelope,
    faBriefcase,
    faTriangleExclamation,
    faArrowLeft,
    faCircleExclamation,
    faUser,
    faLock,
    faHouse,
    faUsers,
    faPlus,
    faUserPlus,
    faMagnifyingGlass,
    faRightFromBracket,
    faBars,
} from '@fortawesome/free-solid-svg-icons'

library.add(
    faEye,
    faTrash,
    faAnglesLeft,
    faAnglesRight,
    faPenToSquare,
    faUsersSlash,
    faSpinner,
    faIdCard,
    faEnvelope,
    faBriefcase,
    faTriangleExclamation,
    faArrowLeft,
    faCircleExclamation,
    faUser,
    faLock,
    faHouse,
    faUsers,
    faPlus,
    faUserPlus,
    faMagnifyingGlass,
    faRightFromBracket,
    faBars,
)

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
