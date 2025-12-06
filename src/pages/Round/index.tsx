import { observer } from "mobx-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Goose from '@/assets/goose.svg?react'
import Header from "@/views/Header";
import { useStores } from "@/store";
import './index.css'

export default observer(()=>{
  const title = {
      2:'Раунд завершен',
      1:'Cooldown',
      0: 'Раунды'
  }
  const desc = {
    1: 'Cooldown',
    0: "Раунд активен!"
  }

  const { round: {
    init, round, myStats, topStats, tap
  } } = useStores()
  const {id} = useParams()
  const navigate = useNavigate()
  const [clicked, setClicked] = useState<boolean>(false)
  const [timeStart, setTimeStart] = useState<string | null>(null)
  const [statusKey, setStatusKey] = useState<number | null>(null)

  const topUser = useMemo(()=>{
    if(statusKey !== 2) return

    return topStats?.reduce((prev, curr) => prev.score > curr.score ? prev : curr, {
      score: 0
    })
  },[statusKey, topStats])

  const calcTime = useCallback((time)=>{
    const diff = new Date(time) - new Date()
    const hour = Math.floor(diff / (1000 * 60 * 60))
    const remineHour = diff % (1000 * 60 * 60)
    const minutes = Math.floor(remineHour / (1000 * 60))
    const remineMinute = remineHour % (1000 * 60);
    const seconds =  Math.floor(remineMinute / (1000 ))

    if(hour < 0 && minutes < 0 && seconds < 0){
      setStatusKey(prev=> {
        if(prev === 1 )return 0
        if(prev === 0){
          init(id)
          return 2
        }
        return prev
      })
      return
    }
    setTimeStart(`${hour}:${minutes > 9 ? minutes: '0'+minutes}:${seconds > 9 ? seconds : `0`+seconds}`)
    setTimeout(()=>calcTime(time), 1000)
  },[statusKey, round, id])

  const handleClick = useCallback(()=> 
    navigate('/rounds'),
  [navigate])

  const handleTap = useCallback(()=>{
    if(statusKey !== 0) return

    setClicked(true)
    tap(id)
  },[statusKey, id])

  useEffect(()=>{
    init(id)
  },[id])

  useEffect(()=>{
    if(!round?.startTime && !round?.endTime || statusKey === 2) return 

    calcTime(statusKey === 1 ? round.startTime : round.endTime)
  },[statusKey, round])

  useEffect(()=>{
    setTimeout(()=>setClicked(false),300)
  },[clicked])

  useEffect(()=>{
   setStatusKey((prev)=>{ 
      if(new Date().getTime() > new Date(round?.endTime).getTime())
        return 2
      if(new Date().getTime() < new Date(round?.startTime).getTime())
        return 1
      if(new Date().getTime() < new Date(round?.endTime).getTime())
        return 0
      return prev
    })
  },[round])

  if(statusKey === null)
    return <div>Загрузка...</div>

  return <div className="round">
    <Header title={title[statusKey]} onClickBack={handleClick}/>
    <div className="goose">
      <Goose alt="" className={clicked? 'clicked': ''} onClick={handleTap} onContextMenu={handleTap}/>
    </div>
    <div className="bar">
        {desc[statusKey]}
        {statusKey === 0 && 
          <div>
            <div className="row">
              <p>До конца осталось:</p>
              {timeStart}
            </div>
            <div className="row">
              <p>Мои очки -</p>
              <p>{myStats.score}</p>
            </div>
          </div>
        }
        {statusKey === 1 && 
          <div className="row">
            <p>До начала раунда:</p> 
            {timeStart}
          </div>
        }
        {statusKey === 2 && 
          <div className="info">
            <div className="col"><p>Всего</p> <p>{round?.totalScore}</p></div>
            <div className="col"><p>Победитель - {topUser?.user?.username}</p> <p>{topUser?.score}</p></div>
            <div className="col"><p>Мои очки</p> <p>{myStats?.score}</p></div>
          </div>
        }
    </div>
  </div> 
})