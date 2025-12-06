import React from "react";
import { TItem } from "@/store/Rounds";
import { NavLink } from "react-router";
import './index.css'

type TCard = TItem

export default ({
  id, startTime, endTime
}:TCard)=>{
  const OPTIONS = {
    hour: 'numeric', minute: 'numeric', second: 'numeric' 
  }

  const status = () => {
    if(new Date().getTime() > new Date(endTime).getTime())
      return 'Завершен'
    if(new Date().getTime() < new Date(startTime).getTime()){
      return 'Cooldown'
    }
    return 'Активен'
  }

  return <div className="card">
    <NavLink to={id} className="id">Round ID: {id}</NavLink>
    <div>Start: {new Date(startTime).toLocaleDateString('ru-Ru', OPTIONS)}</div>
    <div>End: {new Date(endTime).toLocaleDateString('ru-Ru', OPTIONS)}</div>
    <div className="status">Статус:{status()}</div>
  </div>
}