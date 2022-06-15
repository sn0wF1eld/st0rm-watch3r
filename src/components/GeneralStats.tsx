import React, { FC, useEffect, useState } from 'react'
import { HiRefresh } from 'react-icons/hi'

const apiCall = {
    event: "bts:subscribe",
    data: { channel: "order_book_btcusd" },
  };


const GeneralStats: FC<{ip:string}> = ({ip}) => {
    const [count, setCount] = useState(0);
    const [transactionsCount, setTransactionsCount] = useState({started: 0, terminated: 0})

    useEffect(() => {
        const ws = new WebSocket(`ws://${ip}/uptime`);
        const ws2 = new WebSocket(`ws://${ip}/transactions/count`);

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
        return () => {
            ws.close()
            ws2.close()
        };
    }, [ip]);

    function secondsToDaysHoursMinutesSeconds(seconds: number) {
        const d = Math.floor(seconds / 86400)
        const h = Math.floor(seconds % 86400 / 3600);
        const m = Math.floor(seconds % 86400 % 3600 / 60);
        const s = Math.floor(seconds % 86400 % 3600 % 60);
    
        const dDisplay = d > 0 ? d + (d === 1 ? " day, " : " days, ") : "";
        const hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
        const mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
        const sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";
        return dDisplay + hDisplay + mDisplay + sDisplay; 
    }

    return (
        <div className='flex flex-row gap-4 text-dark-blue'>
            <p><span className='font-bold'>Uptime: </span>{secondsToDaysHoursMinutesSeconds(count)}</p>
            <p><span className='font-bold'>Started: </span>{transactionsCount.started}</p>
            <p><span className='font-bold'>Terminated: </span>{transactionsCount.terminated}</p>
        </div>
    )
}

export default GeneralStats