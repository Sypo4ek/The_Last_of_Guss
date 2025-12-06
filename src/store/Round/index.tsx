import { computed, makeAutoObservable } from "mobx"
import { url } from "../../utils/env"

type TRound = {
  id: string;
  startTime: string;
  endTime: string;
  totalScore: number;
  createdAt: string;
};

type TUser = {
  username: string;
};

type TTopStat = {
  taps: number;
  score: number;
  user: TUser;
};

type TMyStats = {
  taps: number;
  score: number;
};


export default class Round {
  round: TRound |null = null
  topStats: TTopStat[] | null  = null
  myStats: TMyStats | null  = null
  token: string | null = null
  loading: boolean = false

  constructor(token: string){
    makeAutoObservable(this)
    this.token = token
  }

  init = async (id: string):Promise<void>=>{
    if(this.loading) return

    let resp, status;
    try {
      resp = await fetch(`${url}/rounds/${id}`, {
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

  tap = async (id: string):Promise<void>=>{
    let resp, status;
    try {
      resp = await fetch(`${url}/rounds/${id}/tap`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({id}),
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
      Object.assign(this, {
        myStats: resp
      })
    }
  }
}