import { observer } from "mobx-react";
import React, { FormEvent, useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { useStores } from "@/store";
import { TLogin } from "@/store/Auth";
import './index.css'

type TForm = {
    username: string | null
    password: string | null
  }

export default observer(()=>{    
  const navigate = useNavigate()
  const {auth: {login, loading, error}} = useStores()
  const [state, setState] = useState<TForm>({
    username: null,
    password: null
  })

  const handleChange = (event: FormEvent) => {
    const { name, value } = event.target;
    setState(prev=> ({...prev, [name]: value}))
  }

  const handleSubmit = useCallback((event: FormEvent)=>{
    event.preventDefault();
    if(loading || !Object.values(state).every(Boolean))
      return

    login(state as TLogin)
  },[login, loading, state])

  return <form id="form" onSubmit={handleSubmit}>
    <h3>Войти</h3>
    <div className="form-group">
      <label htmlFor="username"> Имя пользователя:</label>
      <input type="text" id="username" name="username" required onChange={handleChange}/>
      <div className="error">Это поле обязательно для заполнения</div>
    </div>
    <div className="form-group">
      <label htmlFor="password">Пароль:</label>
      <input type="password" id="password" name="password" required onChange={handleChange}/>
      <div className="error">Это поле обязательно для заполнения</div>
    </div>
    <button type="submit">Войти</button>
    {(error && !loading) && <div>Пароль не верный</div>}
  </form>
})