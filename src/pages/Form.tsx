import { randomUUID } from 'crypto';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useStateContext } from '../contexts/ContextProvider'

const apiCall = {
  event: "bts:subscribe",
  data: { channel: "order_book_btcusd" },
};

function Form() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const { addConnection, removeConnection, connections } = useStateContext()
  const [ state, setState ] = useState({})
  const onSubmit = (data: any) => {
    addConnection(data)
    reset()
  }
  

  useEffect(() => {
    connections.map((connection: any) => {
      const ws = new WebSocket(`ws://${connection.ip}/uptime`)
      
      ws.onopen = (event) => {
        ws.send(JSON.stringify(apiCall));
      };
      
      ws.onmessage = function (event) {
        const json = JSON.parse(event.data);
        try {
          setTimeout(() => {
            setState(state => ({...state, [connection.name]: json['uptime-s']}));
          }, 200)
        } catch (err) {
            console.log(err);
        }
      };
      return () => {
        ws.close()
      };
    })
  }, [connections])
  
  return (
    <div className='flex flex-col h-full w-full ml-10'>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-row gap-3'>
        <div>
        <div className="flex gap-3">
          <input className='w-52' type="text" placeholder='Connection Name' {...register('name', { required: true })}/>
          <input className='w-52' type="text" placeholder='Connection IP' {...register('ip', { required: true })}/>
          <input hidden value={crypto.randomUUID()} {...register('id')}/>
          <input type="submit" className='p-2 rounded bg-green-600 hover:cursor-pointer hover:bg-green-400'/>
        </div>
        <div className="flex gap-3">
          {errors.name && <span className='text-red-400 w-52'>This field is required</span>}
          {errors.ip && <span className='text-red-400 w-52'>This field is required</span>}
          </div>
        </div>
      </form>
      <div className="flex flex-col mt-10">
        {
          connections.map((connection: any) => (
            <div key={connection.ip} className='mt-5 p-4 flex bg-button-bg w-2/3 justify-between'>
              <span className='text-green-600 flex-1'>{connection.name}</span>
              <span className='text-green-600 flex-1'>{connection.ip}</span>
              <span className='text-red-600 hover:cursor-pointer' onClick={() => removeConnection(connection)}>X</span>
              <span className='text-green-200 ml-3'>Uptime: {state[connection.name as keyof typeof state]}</span>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Form
