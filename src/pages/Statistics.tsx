import React, {useEffect, useState} from 'react'
import {Line} from 'react-chartjs-2';
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
import NumberDisplay from '../components/NumberDisplay';
import Section from '../components/Section';
import Button from '../components/Button';
import {useParams} from 'react-router-dom';
import {useStateContext} from '../contexts/ContextProvider';

import Axios from 'axios';
import fileDownload from 'js-file-download';

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
    data: {channel: "order_book_btcusd"},
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
    const [gcTimePercent, setGcTimePercent] = useState([] as any)
    const [usedHeapMem, setUsedHeapMem] = useState([] as any)
    const [heapSize, setHeapSize] = useState([] as any)
    const [freeHeapMem, setFreeHeapMem] = useState([] as any)
    const [freeDiskSpace, setFreeDiskSpace] = useState(0)
    const [gcTotalPauses, setGcTotalPauses] = useState(0)
    const [gcTotalTime, setGcTotalTime] = useState(0)
    const [heapMaxSize, setHeapMaxSize] = useState(0)
    const [totalDiskSpace, setTotalDiskSpace] = useState(0)
    const [usableDiskSpace, setUsableDiskSpace] = useState(0)
    const [usedDiskSpace, setUsedDiskSpace] = useState(0)
    const [processCpuTime, setProcessCpuTime] = useState(0)
    const [connection, setConnection] = useState({} as any)
    const {connections, setLoading} = useStateContext()
    const {id} = useParams()

    useEffect(() => {
        setConnection(connections.find((item: any) => item.id === id))

        const ws = new WebSocket(`ws://${connection?.ip}/system/info`)

        ws.onopen = () => ws.send(JSON.stringify(apiCall))

        ws.onmessage = (event) => {
            const json = JSON.parse(event.data)

            try {
                setProcessCpuLoad((oldArray: any) => [...handleArraySize(oldArray), json['process-cpu-load']])
                setSystemCpuLoad((oldArray: any) => [...handleArraySize(oldArray), json['system-cpu-load']])
                setCurrTime((oldArray: any) => [...handleArraySize(oldArray), new Date(json['timestamp']).toLocaleString().split(', ')[1]])
                setGcAverageTime((oldArray: any) => [...handleArraySize(oldArray), json['gc-avg-time-ms']])
                setGcTimePercent((oldArray: any) => [...handleArraySize(oldArray), json['gc-time-percent']])
                setUsedHeapMem((oldArray: any) => [...handleArraySize(oldArray), json['heap-used-memory-mb']])
                setFreeHeapMem((oldArray: any) => [...handleArraySize(oldArray), json['heap-free-memory-mb']])
                setHeapSize((oldArray: any) => [...handleArraySize(oldArray), json['heap-size-mb']])
                setFreeDiskSpace(Math.floor(json['free-disk-space-mb']))
                setGcTotalPauses(json['gc-total-pauses'])
                setGcTotalTime(json['gc-total-time-ms'])
                setHeapMaxSize(json['heap-max-size-mb'])
                setTotalDiskSpace(Math.floor(json['total-disk-space-mb']))
                setUsableDiskSpace(Math.floor(json['usable-disk-space-mb']))
                setUsedDiskSpace(Math.floor(json['used-disk-space-mb']))
                setProcessCpuTime(json['process-cpu-time-ms'])
            } catch (err) {
                console.log(err)
            }
        }
        return () => ws.close()
    }, [id, connection, connections])

    function handleGCDump(): void {
        setLoading(true)
        Axios.get(`http://${connection.ip}/heap-dump/${connection.name.trim().replace(' ', '-')}`, {
            responseType: 'blob'
        }).then(res => {
            fileDownload(res.data, connection.name.trim().replace(' ', '-') + '.hprof');
            setLoading(false)
        })
        .catch(() => {
                alert("oh no!")
                return setLoading(false)
            });
    }

    function handlePerformGC(): void {
        fetch(`http://${connection.ip}/gc-collect`)
            .then(res => {
                console.log(res)
                return res
            })
    }

    return (
        <div>
            <div className="w-full">
                <span className='text-white font-extrabold text-xl ml-5'>{connection.name}</span>
            </div>
            <div className='flex h-full flex-row flex-wrap content-between'>
                <Section
                    label='GC'
                >
                    <div className="flex gap-10 mb-10">
                        <NumberDisplay
                            data={gcTotalPauses}
                            label='GC Total Pauses'
                        />
                        <NumberDisplay
                            data={gcTotalTime}
                            label='GC Total Time'
                            unit='ms'
                        />
                    </div>
                    <div>
                        <Line options={{
                            ...options,
                            scales: {
                                y: {
                                    type: 'linear' as const,
                                    display: true,
                                    position: 'left' as const,
                                    title: {
                                        text: 'ms',
                                        display: true
                                    }
                                },
                                y1: {
                                    type: 'linear' as const,
                                    display: true,
                                    position: 'right' as const,
                                    grid: {
                                        drawOnChartArea: false,
                                    },
                                    title: {
                                        text: '%',
                                        display: true
                                    }
                                }
                            }
                        }}
                              data={{
                                  labels: currTime,
                                  datasets: [{
                                      label: 'GC Average Time (ms)',
                                      data: gcAverageTime,
                                      borderColor: 'red',
                                      backgroundColor: 'red',
                                      yAxisID: 'y'
                                  },
                                      {
                                          label: 'Time in GC (%)',
                                          data: gcTimePercent,
                                          borderColor: 'lime',
                                          backgroundColor: 'lime',
                                          yAxisID: 'y1'
                                      }]
                              }}
                              redraw={true}
                        />
                    </div>
                </Section>
                <Section
                    label='CPU'
                >
                    <div className='mb-10'>
                        <NumberDisplay
                            data={processCpuTime}
                            label='Process Cpu Time'
                            unit='ms'
                        />
                    </div>
                    <div>
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
                </Section>
                <Section
                    label='Disk'
                >
                    <div className="flex flex-row flex-wrap gap-10">
                        <NumberDisplay
                            data={freeDiskSpace}
                            label='Free Disk Space'
                            unit='MB'
                        />
                        <NumberDisplay
                            data={totalDiskSpace}
                            label='Total Disk Space'
                            unit='MB'
                        />
                        <NumberDisplay
                            data={usableDiskSpace}
                            label='Usable Disk Space'
                            unit='MB'
                        />
                        <NumberDisplay
                            data={usedDiskSpace}
                            label='Used Disk Space'
                            unit='MB'
                        />
                    </div>
                </Section>
                <Section
                    label='Heap'
                >
                    <div className="mb-10 flex gap-10">
                        <NumberDisplay
                            data={heapMaxSize}
                            label='Heap Max Size'
                            unit='MB'
                        />
                        <div className="flex flex-col gap-y-3">
                            <Button
                                customFunction={handleGCDump}
                            >Heap Dump
                            </Button>
                            <Button
                                customFunction={handlePerformGC}
                            >Perform GC
                            </Button>
                        </div>
                    </div>
                    <div>
                        <Line
                            options={options}
                            data={{
                                labels: currTime,
                                datasets: [{
                                    label: 'Used Heap Memory (MB)',
                                    data: usedHeapMem,
                                    borderColor: 'orange',
                                    backgroundColor: 'orange'
                                },
                                    {
                                        label: 'Heap Size (MB)',
                                        data: heapSize,
                                        borderColor: 'purple',
                                        backgroundColor: 'purple'
                                    },
                                    {
                                        label: 'Free Heap Memory (MB)',
                                        data: freeHeapMem,
                                        borderColor: 'lightBlue',
                                        backgroundColor: 'lightBlue'
                                    },
                                ]
                            }}
                        />
                    </div>
                </Section>
            </div>
        </div>
    )
}

export default Statistics