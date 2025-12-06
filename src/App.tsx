import React, { lazy, useEffect } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import { observer } from 'mobx-react'
import { StoreProvider, useStores } from '@/store'


const Auth = lazy(()=> import('./pages/Auth'))
const Rounds = lazy(()=> import('./pages/Rounds'))
const Round = lazy(()=> import('./pages/Round'))


const App = observer(() =>{
  const {auth:{token}} = useStores()
  
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          { !token ? 
              <Route path='/' element={<Auth/>}/>
            : <Route path="rounds">
               <Route path="" element={<Rounds/>}/>
                <Route path=":id" element={<Round/>}/>
              </Route>
          }
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
})

export default App
