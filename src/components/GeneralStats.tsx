import React, { useEffect, useState } from 'react'
import { HiRefresh } from 'react-icons/hi'

const apiCall = {
    event: "bts:subscribe",
    data: { channel: "order_book_btcusd" },
  };


function GeneralStats() {
    const [count, setCount] = useState('');
    const [transactionsCount, setTransactionsCount] = useState({started: 0, terminated: 0})

    useEffect(() => {
        const ws = new WebSocket('ws://148.71.176.77:9000/uptime');
        const ws2 = new WebSocket('ws://148.71.176.77:9000/transactions/count');

        ws.onopen = (event) => {
            ws.send(JSON.stringify(apiCall));
        };
        ws2.onopen = (event) => {
            ws2.send(JSON.stringify(apiCall));
          };
        ws.onmessage = function (event) {
            const json = JSON.parse(event.data);
            try {
                setCount(json['uptime-s']);
            } catch (err) {
                console.log(err);
            }
        };
        ws2.onmessage = function (event) {
            const json = JSON.parse(event.data);
            try {
                setTransactionsCount({started: json.started, terminated: json.terminated})
            } catch (err) {
              console.log(err);
            }
          };
        //clean up function
        return () => {
            ws.close()
            ws2.close()
        };
    }, []);


    


    return (
        <div className='fixed flex flex-col right-4 bottom-4 border-5 border-color p-2 hover:cursor-pointer' style={{ zIndex: '2000' }}>
            <span className='absolute top-0 right-0'><HiRefresh className='hover:animate-spin' /></span>
            <p>Uptime: {count}</p>
            <p>Started: {transactionsCount.started}</p>
            <p>Terminated: {transactionsCount.terminated}</p>
        </div>
    )
}

export default GeneralStats