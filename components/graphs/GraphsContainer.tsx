import {Connection} from "../layout/provider/Context";
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
import Modal from "../modal/Modal";
import RulesComponent from "./RulesComponent";

type GraphsContainerProps = {
  connection: Connection,
  options: any,

}
type GraphData = {
  systemCpuLoad: number,
  totalClassesLoaded: number,
  threadCount: number,
  heapMaxSizeMb: number,
  classesLoaded: number,
  usableDiskSpaceGb: number,
  gcTotalPauses: number,
  gcTotalTimeMs: number,
  heapFreeMemoryMb: number,
  classesUnloaded: number,
  usedDiskSpaceGb: number,
  metaspaceMax: number,
  freeDiskSpaceGb: number,
  gcTimePercent: number,
  totalStartedThreads: number,
  totalDiskSpaceGb: number,
  metaspaceCommited: number,
  peakThreadCount: number,
  timestamp: number,
  heapUsedMemoryMb: number,
  heapSizeMb: number,
  processCpuLoad: number,
  metaspaceUsed: number,
  daemonThreadCount: number,
  gcAvgTimeMs: number,
  processCpuTimeMs: number
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function handleArraySize(oldArray: any[]): any[] {
  return oldArray.length > 50 ? oldArray.slice(-50) : oldArray
}

export default function GraphsContainer(props: GraphsContainerProps) {
  const [state, setState] = useState([] as GraphData[])
  const [lastValue, setLastValue] = useState({} as GraphData)
  const [rulesModal, setRulesModal] = useState(false)


  useEffect(() => {
    const ws = new WebSocket(`ws://${props.connection?.address}/jvm/info`)

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
    fetch(`http://${props.connection?.address}/jvm/gc-collect`,
      {method: 'GET', headers: {'content-type': 'application/json'}}
    )
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }

  const onHeapDump = () => {
    fetch(`http://${props.connection?.address}/jvm/heap-dump/dump`,
      {method: 'GET', headers: {'content-type': 'application/json'}}
    )
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }

  const onHeapDownload = () => {
    fetch(`http://${props.connection?.address}/jvm/heap-dump/download`,
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
    <div className={'flex flex-col -mt-10 pt-0'}>
      <div
        className={'flex flex-col gap-3 top-24 z-2 bg-secondary-bg sticky border-0 border-b-1 border-solid border-gray-400'}>
        <div className={'flex justify-between'}>
          <div className={'flex flex-col p-1'}>
            <span>Usable Disk Space (Gb)</span>
            <span>{lastValue.usableDiskSpaceGb}</span>
          </div>
          <div className={'flex flex-col p-1'}>
            <span>Total Disk Space (Gb)</span>
            <span>{lastValue.totalDiskSpaceGb}</span>
          </div>
          <div className={'flex flex-col p-1'}>
            <span>Used Disk Space (Gb)</span>
            <span>{lastValue.usedDiskSpaceGb}</span>
          </div>
          <div className={'flex flex-col p-1'}>
            <span>Free Disk Space (Gb)</span>
            <span>{lastValue.freeDiskSpaceGb}</span>
          </div>
          <div className={'flex flex-col p-1'}>
            <span>GC Total Pauses</span>
            <span>{lastValue.gcTotalPauses}</span>
          </div>
          <div className={'flex flex-col p-1'}>
            <span>GC Total Times (ms)</span>
            <span>{lastValue.gcTotalTimeMs}</span>
          </div>
          <div className={'flex flex-col p-1'}>
            <span>Process CPU Time (ms)</span>
            <span>{lastValue.processCpuTimeMs}</span>
          </div>
        </div>
        <div className={'flex justify-center gap-10'}>
          <button onClick={() => onGcCollect()}>GC Collect</button>
          <button onClick={() => onHeapDump()}>Heap Dump</button>
          <button onClick={() => onHeapDownload()}>Heap Download</button>
          <button onClick={() => setRulesModal(true)}>Rules</button>
          {
            rulesModal &&
            <Modal open={rulesModal} onClose={() => setRulesModal(false)} title={'Rules'}>
                <RulesComponent connection={props.connection} />
            </Modal>
          }
        </div>
      </div>
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
  )
}