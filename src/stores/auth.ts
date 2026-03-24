import {defineStore} from 'pinia'
import {ref, computed} from 'vue'
export const useAuthStore = defineStore('auth', ()=>{
    const token = ref(localStorage.getItem('token') || '')
    const isLoggedIn = computed(()=> !!token.value)
    function login(username:string, password:string):boolean {
        if(username === 'admin' && password === '12345') {
            token.value = 'faketoken-nov-rain'
            localStorage.setItem('token', token.value)
            return true
        } 
        return false
    }
    function logout(){
        token.value = ''
        localStorage.removeItem('token')
    }
    return {token, isLoggedIn, login, logout}
})