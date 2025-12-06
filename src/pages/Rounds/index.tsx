import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useStores } from "@/store";
import Header from "@/views/Header";
import Card from "@/views/Card";
import './index.css'

export default observer(()=>{
  const {
    auth: {computedIsAdmin, logout}, 
    rounds: {load, data, pagination: {hasMore}, create}
  } = useStores()
  const isAdmin = computedIsAdmin.get()

  useEffect(()=>{
    load()
  },[])

  return <div className="rounds">
    <Header title="Список РАУНДОВ" onClickBack={logout}/>
    <div className="list">
      {isAdmin && <button onClick={create}>Создать раунд</button>}
      <div className="container">{
        data.map(item=> 
          <Card {...item} key={item.id}/>
        )}
        {hasMore && <button>Загрузить еще...</button>}
        </div>
    </div>
  </div>
})