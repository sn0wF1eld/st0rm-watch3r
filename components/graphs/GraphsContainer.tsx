import {useEffect, useState} from "react";
import {Line} from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from "chart.js";
import fileDownload from "js-file-download";
import {GraphData, GraphsContainerProps, handleArraySize} from "./utils/GraphUtils";
import StateDataContainer from "./StateDataContainer";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function GraphsContainer(props: GraphsContainerProps) {
  const [state, setState] = useState([] as GraphData[])
  const [lastValue, setLastValue] = useState({} as GraphData)
  const socketPrefix = props.connection?.secure ? 'wss' : 'ws'
  const linkPrefix = props.connection?.secure ? 'https' : 'http'

  useEffect(() => {
    setState([])
    setLastValue({} as GraphData)
    const ws = new WebSocket(`${socketPrefix}://${props.connection?.address}/jvm/info`)

    ws.onmessage = (event) => {
      const json = JSON.parse(event.data)
      try {
        setState((oldArray: any) => [...handleArraySize(oldArray), json])
        setLastValue(json)
      } catch (err) {
        console.log(err)
      }
    }
    return () => ws.close()
  }, [props.connection])

  const onGcCollect = () => {
    fetch(`${linkPrefix}://${props.connection?.address}/jvm/gc-collect`,
      {method: 'GET', headers: {'content-type': 'application/json'}}
    )
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }

  const onHeapDump = () => {
    fetch(`${linkPrefix}://${props.connection?.address}/jvm/heap-dump/dump`,
      {method: 'GET', headers: {'content-type': 'application/json'}}
    )
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }

  const onHeapDownload = () => {
    fetch(`${linkPrefix}://${props.connection?.address}/jvm/heap-dump/download`,
      {method: 'GET', headers: {'response-type': 'blob'}}
    )
      .then(res => {
        console.log(res)
        res.blob()
          .then(blob => fileDownload(blob, 'dump.hprof'))
      })
      .catch(err => console.log(err))
  }

  return (
    <>
      <StateDataContainer data={lastValue} onGcCollect={onGcCollect} onHeapDump={onHeapDump}
                          onHeapDownload={onHeapDownload} connection={props.connection}/>
    <div className={'flex flex-col -mt-10 pt-0'}>
      <div className={'flex justify-between'}>
        <div className='w-2/5 mb-10'>
          <div className='flex flex-col w-full pl-10 pb-10 pr-10'>
            <div className="flex w-full flex-col mt-5">
              <Line options={{
                ...props.options,
                plugins: {...props.options.plugins, title: {display: true, text: 'CPU Usage'}}
              }}
                    data={{
                      labels: state.map((item: GraphData) => new Date(item.timestamp).toLocaleString().split(', ')[1]),
                      datasets: [{
                        label: 'Process CPU Load (%)',
                        data: state.map((item: GraphData) => item.processCpuLoad),
                        borderColor: 'orange',
                        backgroundColor: 'orange'
                      },
                        {
                          label: 'System CPU Load (%)',
                          data: state.map((item: GraphData) => item.systemCpuLoad),
                          borderColor: 'green',
                          backgroundColor: 'green'
                        }]
                    }}
              />
            </div>
          </div>
        </div>
        <div className='w-2/5 mb-10 mr-10'>
          <div className='flex flex-col w-full'>
            <div className="flex w-full flex-col mt-5">
              <Line options={{
                ...props.options,
                plugins: {...props.options.plugins, title: {display: true, text: 'Heap Usage'}}
              }}
                    data={{
                      labels: state.map((item: GraphData) => new Date(item.timestamp).toLocaleString().split(', ')[1]),
                      datasets: [{
                        label: 'Heap Max Size (mb)',
                        data: state.map((item: GraphData) => item.heapMaxSizeMb),
                        borderColor: 'orange',
                        backgroundColor: 'orange'
                      },
                        {
                          label: 'Heap Free Memory (mb)',
                          data: state.map((item: GraphData) => item.heapFreeMemoryMb),
                          borderColor: 'green',
                          backgroundColor: 'green'
                        },
                        {
                          label: 'Heap Used Memory (mb)',
                          data: state.map((item: GraphData) => item.heapUsedMemoryMb),
                          borderColor: 'lightBlue',
                          backgroundColor: 'lightBlue'
                        }]
                    }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={'flex justify-between'}>
        <div className='w-2/5 mb-10'>
          <div className='flex flex-col w-full pl-10 pb-10 pr-10'>
            <div className="flex w-full flex-col mt-5">
              <Line options={{
                ...props.options,
                plugins: {...props.options.plugins, title: {display: true, text: 'Thread Count'}}
              }}
                    data={{
                      labels: state.map((item: GraphData) => new Date(item.timestamp).toLocaleString().split(', ')[1]),
                      datasets: [{
                        label: 'Thread Count',
                        data: state.map((item: GraphData) => item.threadCount),
                        borderColor: 'orange',
                        backgroundColor: 'orange'
                      },
                        {
                          label: 'Total Started Threads',
                          data: state.map((item: GraphData) => item.totalStartedThreads),
                          borderColor: 'green',
                          backgroundColor: 'green'
                        },
                        {
                          label: 'Peak Thread Count',
                          data: state.map((item: GraphData) => item.peakThreadCount),
                          borderColor: 'lightBlue',
                          backgroundColor: 'lightBlue'
                        },
                        {
                          label: 'Daemon Thread Count',
                          data: state.map((item: GraphData) => item.daemonThreadCount),
                          borderColor: 'red',
                          backgroundColor: 'red'
                        }]
                    }}
              />
            </div>
          </div>
        </div>
        <div className='w-2/5 mb-10 mr-10'>
          <div className='flex flex-col w-full'>
            <div className="flex w-full flex-col mt-5">
              <Line options={{
                ...props.options,
                plugins: {...props.options.plugins, title: {display: true, text: 'Metaspace Usage'}}
              }}
                    data={{
                      labels: state.map((item: GraphData) => new Date(item.timestamp).toLocaleString().split(', ')[1]),
                      datasets: [{
                        label: 'Metaspace Max',
                        data: state.map((item: GraphData) => item.metaspaceMax),
                        borderColor: 'orange',
                        backgroundColor: 'orange'
                      },
                        {
                          label: 'Metaspace Committed',
                          data: state.map((item: GraphData) => item.metaspaceCommited),
                          borderColor: 'green',
                          backgroundColor: 'green'
                        },
                        {
                          label: 'Metaspace Used',
                          data: state.map((item: GraphData) => item.metaspaceUsed),
                          borderColor: 'lightBlue',
                          backgroundColor: 'lightBlue'
                        }]
                    }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={'flex justify-between'}>
        <div className='w-2/5 mb-10'>
          <div className='flex flex-col w-full pl-10 pb-10 pr-10'>
            <div className="flex w-full flex-col mt-5">
              <Line options={{
                ...props.options,
                plugins: {...props.options.plugins, title: {display: true, text: 'GC Time'}}
              }}
                    data={{
                      labels: state.map((item: GraphData) => new Date(item.timestamp).toLocaleString().split(', ')[1]),
                      datasets: [{
                        label: 'GC Time (%)',
                        data: state.map((item: GraphData) => item.gcTimePercent),
                        borderColor: 'orange',
                        backgroundColor: 'orange'
                      },
                        {
                          label: 'GC Average Time (ms)',
                          data: state.map((item: GraphData) => item.gcAvgTimeMs),
                          borderColor: 'green',
                          backgroundColor: 'green'
                        }]
                    }}
              />
            </div>
          </div>
        </div>
        <div className='w-2/5 mb-10 mr-10'>
          <div className='flex flex-col w-full'>
            <div className="flex w-full flex-col mt-5">
              <Line options={{
                ...props.options,
                plugins: {...props.options.plugins, title: {display: true, text: 'Classes'}}
              }}
                    data={{
                      labels: state.map((item: GraphData) => new Date(item.timestamp).toLocaleString().split(', ')[1]),
                      datasets: [{
                        label: 'Total Classes Loaded',
                        data: state.map((item: GraphData) => item.totalClassesLoaded),
                        borderColor: 'orange',
                        backgroundColor: 'orange'
                      },
                        {
                          label: 'Classes Loaded',
                          data: state.map((item: GraphData) => item.classesLoaded),
                          borderColor: 'green',
                          backgroundColor: 'green'
                        },
                        {
                          label: 'Classes Unloaded',
                          data: state.map((item: GraphData) => item.classesUnloaded),
                          borderColor: 'lightBlue',
                          backgroundColor: 'lightBlue'
                        }]
                    }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}