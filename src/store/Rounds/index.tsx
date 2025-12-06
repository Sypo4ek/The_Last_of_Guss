import { makeAutoObservable } from "mobx"
import { url } from "../../utils/env"

export type TItem = {
  id: string
  startTime: string
  endTime: string
  totalScore: number 
  createdAt: string
}

type TPagination = {
  limit: number
  nextCursor: null| unknown
  hasMore: boolean
}

export default class Rounds {
  data: TItem[] = []
  token: string | null = null
  pagination:TPagination ={
    limit: 1,
    nextCursor: null,
    hasMore: true
  }
  loading: boolean = false

  constructor(token: string){
    makeAutoObservable(this)
    this.token = token
  }


  load = async ():Promise<void>=>{
    if(!this.pagination.hasMore || this.loading) return

    let resp, status;
    try {
      resp = await fetch(`${url}/rounds`, {
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
    }
    finally{
      this.loading = false
      Object.assign(this, resp)
    }
  }

  create = async ():Promise<void>=>{
    let resp, status;
    try {
      resp = await fetch(`${url}/rounds`, {
        method: 'POST',
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
    }
    finally{
      this.data = [resp, ...this.data]
    }
  }
}