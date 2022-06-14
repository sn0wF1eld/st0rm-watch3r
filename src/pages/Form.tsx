import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useStateContext } from '../contexts/ContextProvider'

const apiCall = {
  event: "bts:subscribe",
  data: { channel: "order_book_btcusd" },
};

function Form() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { addConnection, removeConnection, connections } = useStateContext()
  const [ state, setState ] = useState({})
  const onSubmit = (data: any) => console.log(data)

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
    <div className='flex flex-col h-full w-full'>
      <form onSubmit={handleSubmit(addConnection)} className='flex flex-row gap-3 justify-between'>
        <input className='grow' type="text" placeholder='Connection Name' {...register('name', { required: true })}/>
        <input className='grow' type="text" placeholder='Enter new connection' {...register('ip', { required: true })}/>
      
        <input type="submit" className='p-2 rounded bg-green-600 hover:cursor-pointer hover:bg-green-400'/>
      </form>
      <div className="flex flex-col">
        {
          connections.map((connection: any) => (
            <p key={connection.ip}>
              <span className='text-green-600 p-3 mt-2'>{connection.ip}</span>
              <span className='text-red-600 hover:cursor-pointer' onClick={() => removeConnection(connection)}>Remove</span>
              <span className='text-green-200'>Uptime: {state[connection.name as keyof typeof state]}</span>
            </p>
          ))
        }
      </div>
    </div>
  )
}

export default Form
