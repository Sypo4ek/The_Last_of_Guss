import React from "react";
import { observer } from "mobx-react";
import { useStores } from '@/store';
import './index.css'

type THeader = {
  title: string
  onClickBack?: ()=>void
}

export default observer(({title, onClickBack}:THeader)=>{
  const {auth: { username }} = useStores()

  return <div className="header">
    {onClickBack && <button onClick={onClickBack}>&times;</button>}
    <h3>{title}</h3>
    <h2>{username}</h2>
  </div>
  
})