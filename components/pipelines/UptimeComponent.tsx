import {secondsToDaysHoursMinutesSeconds, UptimeProps} from "./utils/PipelinesUtils";
import {useEffect, useState} from "react";

export default function UptimeComponent({connection}: UptimeProps) {
  const [uptime, setUptime] = useState(null)
  const socketPrefix = connection?.secure ? 'wss' : 'ws'

  useEffect(() => {
    const ws = new WebSocket(`${socketPrefix}://${connection?.address}/sn0wst0rm/api/1/system/uptime`)

    ws.onmessage = (event) => {
      const json = JSON.parse(event.data)
      if (json) {
        setUptime(json?.uptimeSeconds)
      }
    }

    return () => ws.close()
  }, [])
  if (!uptime) return <div>-</div>
  return <div className={'flex text-light-blue text-center items-center justify-center'}>Uptime: {secondsToDaysHoursMinutesSeconds(uptime)}</div>
}