import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import GeneralStats from '../components/GeneralStats';
import NumberDisplay from '../components/NumberDisplay'
import { useStateContext } from '../contexts/ContextProvider';

const apiCall = {
    event: "bts:subscribe",
    data: { channel: "order_book_btcusd" },
  };

  // move to app settings, context
  const filter = ['stopped', 'failed-tx-ids']


function State() {
    const [steps, setSteps] = useState([])
    const [startTime, setStartTime] = useState('')
    const { id } = useParams()
    const { connections } = useStateContext()
    const [connection, setConnection] = useState({} as any)

    
    useEffect(() => {
        setConnection(connections.find((item:any) => item.id === id))
        const ws = new WebSocket(`ws://${connection?.ip}/state`);

        ws.onopen = (event) => {
            ws.send(JSON.stringify(apiCall));
        };
        ws.onmessage = function (event) {
            const json = JSON.parse(event.data);
            try {
                setSteps(json.steps);
                setStartTime(json['start-time'])
            } catch (err) {
                console.log(err);
            }
        };
        //clean up function
        return () => {
            ws.close()
        };
    }, [id, connection, connections]);

  return (
    <div className='flex flex-col min-h-screen w-full ml-5 items-start'>
        <div className='w-full text-white font-extrabold text-xl'>{connection.name}</div>
        <GeneralStats ip={connection.ip}/>
        <div className="flex flex-col w-full gap-y-2 ml-5">
            {steps.map((item) => (
                <div key={Object.keys(item)[0]} className='flex flex-col mt-5'>
                    <span className='text-white mb-5'>{Object.keys(item)[0]}</span>
                    <div className='flex flex-row gap-5 w-full'>
                        {Object.keys(item[Object.keys(item)[0]]).map((label) => (
                            !filter.find(step => label === step) ?
                            <NumberDisplay key={label} label={label} data={item[Object.keys(item)[0]][label]} /> :
                            null
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}
export default State