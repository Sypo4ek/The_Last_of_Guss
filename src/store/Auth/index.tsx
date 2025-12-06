import { computed, makeAutoObservable } from "mobx"
import { main_route, url } from '../../utils/env';

export type TLogin = {
  username: string
  password: string
}

export default class Auth {
  username: string | null = null 
  role: string | null = null
  token: string | null = null
  loading: boolean = false
  error: string | null = null

  constructor(){
    makeAutoObservable(this)

    this.init()
  }

  init(){
    if(this.getToken()){
      this.token = this.getToken()
      if(!window.location.href.includes(main_route)){
        window.location.href+=main_route
      }
      if(!this.username || !this.role){
        this.about()
      }
    }else {
       if(window.location.href.includes(main_route)){
        window.location.href = window.location.origin
      }
    }
  }

  computedIsAdmin = computed(()=>this.role?.toLowerCase() === 'admin')

  login = async (props: TLogin):Promise<void>=>{
    if(this.loading || this.token) return

    this.loading = true
    let resp, status;
    try{
      resp = await fetch(`${url}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(props)
      })
      status = resp.status
      resp = await resp.json()

      if(status !== 200){
        throw new Error(JSON.stringify(resp))
      }
    }catch(error){
      console.group('Error from login')
      console.log(error)
      console.groupEnd()
      this.error = error as string
    }finally{
      this.loading = false
      if(status !== 200) return

      const {token, ...other} = resp
      Object.assign(this, other)
      this.setToken(token) 
       if(!window.location.href.includes(main_route)){
        window.location.href+=main_route
      }
    }
  }

  logout = async ():Promise<Response | undefined>=>{
    if(this.loading) return
    this.loading = true
    let resp;
    try {
      resp = await fetch(`${url}/auth/logout`, {
        method: 'POST'
      })
    } catch (error) {}
    finally{
      this.deleteToken()
      window.location.href= window.location.origin
      return resp
    }
  }

  about = async ():Promise<void>=>{
    if(this.loading) return
    let resp, status;
    try {
      resp = await fetch(`${url}/auth/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        }
      })
      status = resp.status
      resp = await resp.json()
      if(status !== 200){
        throw new Error(JSON.stringify(resp))
      }
    } catch (error) {
      console.group('Error from about')
      console.log(error)
      console.groupEnd()
      this.error = error as string
    }
    finally{
      this.loading = false
      Object.assign(this, resp)
    }
  }

  setToken = (token: string | null = null): void => {
    document.cookie = `token=${token}`
    this.token = token
  }

  getToken = ():string | null => {
    return document.cookie.split('; ').find(item=> item.includes('token'))?.split('=')[1] ?? null
  }

  deleteToken = ():void => {
    document.cookie = `token=;expires=${new Date(0)}`
  }
}