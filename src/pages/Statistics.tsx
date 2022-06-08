import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const apiCall = {
  event: "bts:subscribe",
  data: { channel: "order_book_btcusd" },
};

const options = {
  responsive: true,
  elements: {
    line: {
      borderWidth: 1
    },
    point: {
      radius: 2
    }
  },
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
    title: {
      display: true,
      text: 'Node 1 Usage',
    },
  },
};

function handleArraySize(oldArray: any[]): any[] {
  return oldArray.length > 50 ? oldArray.slice(-50) : oldArray
}

function Statistics() {
  const [processCpuLoad, setProcessCpuLoad] = useState([] as any)
  const [systemCpuLoad, setSystemCpuLoad] = useState([] as any)
  const [currTime, setCurrTime] = useState([] as any)
  const [gcAverageTime, setGcAverageTime] = useState([] as any)
  const [usedHeapMem, setUsedHeapMem] = useState([] as any)
  const [heapSize, setHeapSize] = useState([] as any)
  const [freeHeapMem, setFreeHeapMem] = useState([] as any)

  useEffect(() => {
    const ws = new WebSocket('ws://148.71.176.77:9000/system/info')

    ws.onopen = () => ws.send(JSON.stringify(apiCall))

    ws.onmessage = (event) => {
      const json = JSON.parse(event.data)

      try {
        console.log(json)
        setProcessCpuLoad((oldArray: any) => [...handleArraySize(oldArray), json['process-cpu-load']])
        setSystemCpuLoad((oldArray: any) => [...handleArraySize(oldArray), json['system-cpu-load']])
        setCurrTime((oldArray: any) => [...handleArraySize(oldArray), new Date(json['timestamp']).toLocaleString().split(', ')[1]])
        setGcAverageTime((oldArray: any) => [...handleArraySize(oldArray), json['gc-avg-time-ms']])
        setUsedHeapMem((oldArray: any) => [...handleArraySize(oldArray), json['heap-used-memory-mb']])
        setFreeHeapMem((oldArray: any) => [...handleArraySize(oldArray), json['heap-free-memory-mb']])
        setHeapSize((oldArray: any) => [...handleArraySize(oldArray), json['heap-size-mb']])
      } catch (err) {
        console.log(err)
      }
    }

    return () => ws.close()
  }, [])

  return (
    <div className='flex h-full'>
      <div className="flex h-100 grow gap-5">
        <div className="grow flex-1 bg-button-bg">
          <Line options={options} data={{
            labels: currTime,
            datasets: [{
              label: 'Process CPU Load (%)',
              data: processCpuLoad,
              borderColor: 'yellow',
              backgroundColor: 'yellow'
            },
            {
              label: 'System CPU Load (%)',
              data: systemCpuLoad,
              borderColor: 'green',
              backgroundColor: 'green'
            }]
          }}
          />
        </div>
        <div className="grow flex-1 bg-button-bg">
          <Line options={options} data={{
              labels: currTime,
              datasets: [{
                label: 'GC Average Time (ms)',
                data: gcAverageTime,
                borderColor: 'yellow',
                backgroundColor: 'lightBlue'
              }]
            }}
            redraw={true}
          />
        </div>
        <div className="grow flex-1 bg-button-bg">
          <Line options={options} data={{
            labels: currTime,
            datasets: [{
              label: 'Used Heap Memory (mb)',
              data: usedHeapMem,
              borderColor: 'orange',
              backgroundColor: 'orange'
            },
            {
              label: 'Heap Size (mb)',
              data: heapSize,
              borderColor: 'purple',
              backgroundColor: 'purple'
            },
            {
              label: 'Free Heap Memory (mb)',
              data: freeHeapMem,
              borderColor: 'lightBlue',
              backgroundColor: 'lightBlue'
            },
          ]
          }}
          />
        </div>
      </div> 
    </div>
  )
}

export default Statistics