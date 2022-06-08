import React, { useEffect, useState } from 'react'
import NumberDisplay from '../components/NumberDisplay'

const apiCall = {
    event: "bts:subscribe",
    data: { channel: "order_book_btcusd" },
  };

function State() {
    const [steps, setSteps] = useState([])
    const [startTime, setStartTime] = useState('')

    useEffect(() => {
        const ws = new WebSocket('ws://148.71.176.77:9000/state');

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
    }, []);

  return (
    <div className='flex h-full w-full'>
        <div className="flex flex-col w-full gap-y-2">
            {steps.map((item) => (
                <div key={Object.keys(item)[0]} className='flex flex-row gap-5 w-full items-start justify-start'>
                    {Object.keys(item[Object.keys(item)[0]]).map((label) => (
                        <NumberDisplay key={label} label={label} data={item[Object.keys(item)[0]][label]} />
                    ))}
                </div>
            ))}
        </div>
    </div>
  )
}
export default State