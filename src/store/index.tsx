import { observer } from "mobx-react"
import React, { createContext, useContext } from "react"
import Auth from "./Auth"
import Rounds from "./Rounds"
import { reaction } from "mobx"
import Round from "./Round"

class Store {
  auth: Auth
  rounds: Rounds
  round: Round

  constructor(){
    this.auth = new Auth()
    
    reaction(()=>this.auth.token, this.init)
    this.init()
  }

  init(){
    if(!this.auth.token) return
    
    this.rounds = new Rounds(this.auth.token)
    this.round = new Round(this.auth.token)
  }
}

const store = new Store()

const StoreContext = createContext(store)

export const useStores = (): typeof store => useContext(StoreContext)

export const StoreProvider = observer(({ children }) => (
  <StoreContext.Provider value={store}>
    {children}
  </StoreContext.Provider>
))