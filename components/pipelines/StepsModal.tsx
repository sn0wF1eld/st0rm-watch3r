import {Connection} from "../layout/provider/Context";
import {useEffect, useState} from "react";
import Modal from "../modal/Modal";
import StepsForm from "./StepsForm";
import {FiSettings} from "react-icons/fi";
import SystemConfigModal from "./SystemConfigModal";
import Button from "../layout/Button";
import {trimNumber, successToToast, errorToToast, GraphData, handleArraySize} from "../graphs/utils/GraphUtils";
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

type StepProps = {
  connection: Connection,
  step: {
    label: string,
    name: string,
    type: string
    title?: string
  },
  isEdge: boolean,
  status: string
}

type Statistics = {
  meanExecutionTimeMs: number
  medianExecutionTimeMs: number
  standardDeviationExecutionTimeMs: number
}

type QueueStatistics = {
  put: Statistics,
  take: Statistics
}

export type StepState = {
  totalStepCalls: number,
  successfulStepCalls: number,
  unsuccessfulStepCalls: number,
  stopped: boolean,
  threads: number,
  pollFrequency: number,
  timeUnit: string
}

export type JobState = {
  lastTrigger: string
  lastAttempt: string
  status: string
  triggered: boolean
  schedule: string
  stopped: boolean
}

export type QueueState = {
  puts: number,
  takes: number,
  closed: boolean,
  bufferSize: number
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

const options = {
  responsive: true,
  maintainAspectRatio: false,
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
  },
};

export default function StepsModal({connection, step, isEdge, status}: StepProps) {
  const [stats, setStats] = useState({} as Statistics)
  const [graphStats, setGraphStats] = useState([] as any)
  const [queueStatistics, setQueueStatistics] = useState({} as QueueStatistics)
  const [state, setState] = useState({} as StepState)
  const [jobState, setJobState] = useState({} as JobState)
  const [openModal, setOpenModal] = useState(false)
  const [testModal, setTestModal] = useState(false)
  const [threadModal, setThreadModal] = useState(false)
  const [pollFrequencyModal, setPollFrequency] = useState(false)
  const [scheduleModal, setScheduleModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [testResult, setTestResult] = useState('')
  const [queueState, setQueueState] = useState({} as QueueState)
  const [bufferSizeModal, setBufferSizeModal] = useState(false)
  const [configurationsModal, setConfigurationsModal] = useState(false)

  const linkPrefix = connection?.secure ? 'https' : 'http'
  const socketPrefix = connection?.secure ? 'wss' : 'ws'

  useEffect(() => {
    if (!connection || !step) return

    if (!isEdge) {
      const ws = new WebSocket(`${socketPrefix}://${connection?.address}/sn0wst0rm/api/1/steps/${step.label}/statistics`)
      const ws2 = new WebSocket(`${socketPrefix}://${connection?.address}/sn0wst0rm/api/1/steps/${step.label}/state`)

      ws.onmessage = (event) => {
        const json = JSON.parse(event.data)
        if (json) {
          setStats(json)
          setGraphStats((old: any) => [...handleArraySize(old), json])
        }
      }


      ws2.onmessage = (event) => {
        const json = JSON.parse(event.data)
        if (json) {
          if (step.type !== 'job') {
            return setState(json)
          }
          return setJobState(json)
        }
      }

      return () => {
        ws.close();
        ws2.close()
      }
    }

    const ws = new WebSocket(`${socketPrefix}://${connection?.address}/sn0wst0rm/api/1/queues/${step.name}/statistics`)
    const ws2 = new WebSocket(`${socketPrefix}://${connection?.address}/sn0wst0rm/api/1/queues/${step.name}/state`)

    ws.onmessage = (event) => {
      const json = JSON.parse(event.data)
      if (json) {
        setQueueStatistics(json)
        setGraphStats((old: any) => [...handleArraySize(old), json])
      }
    }

    ws2.onmessage = (event) => {
      const json = JSON.parse(event.data)
      if (json) {
        setQueueState(json)
      }
    }

    return () => {
      ws.close()
      ws2.close()
    }
  }, [connection, step])

  const onSubmit = (data: any) => {
    if (threadModal) {
      fetch(`${linkPrefix}://${connection?.address}/sn0wst0rm/api/1/steps/${step.label}/threads`,
        {
          method: 'POST',
          headers: {'content-type': 'application/json'},
          body: JSON.stringify({threads: parseInt(data.numericValue, 10)})
        })
        .then(response => successToToast(response))
        .catch(response => errorToToast(response))
    }
    if (pollFrequencyModal) {
      fetch(`${linkPrefix}://${connection?.address}/sn0wst0rm/api/1/steps/${step.label}/poll-frequency`,
        {
          method: 'POST',
          headers: {'content-type': 'application/json'},
          body: JSON.stringify({
            pollFrequency: parseInt(data.pollFrequency, 10),
            timeUnit: data.timeUnit
          })
        })
        .then(response => successToToast(response))
        .catch(response => errorToToast(response))
    }
    if (scheduleModal) {
      fetch(`${linkPrefix}://${connection?.address}/sn0wst0rm/api/1/jobs/${step.label}/schedule`,
        {
          method: 'POST',
          headers: {'content-type': 'application/json'},
          body: JSON.stringify({
            schedule: data.cronJobPattern,
          })
        })
        .then(response => successToToast(response))
        .catch(response => errorToToast(response))
    }
    if (testModal) {
      fetch(`${linkPrefix}://${connection?.address}/sn0wst0rm/api/1/steps/${step.label}/test`,
        {
          method: 'POST',
          headers: {'content-type': 'application/json'},
          body: JSON.stringify({
            value: data.testValue,
          })
        })
        .then(res => {
          if (!res.ok) {

            return Promise.reject(res)
          }
          return res.json()
        })
        .then(json => setTestResult(json))
        .catch((err) => {
          err.json()
            .then((json: any) => {
              setTestResult(json)
            })
        });
    }
    if (bufferSizeModal) {
      fetch(`${linkPrefix}://${connection?.address}/sn0wst0rm/api/1/queues/${step.name}/set-buffer-size`,
        {
          method: 'PUT',
          headers: {'content-type': 'application/json'},
          body: JSON.stringify({
            bufferSize: parseInt(data.numericValue, 10),
          })
        })
        .then(response => successToToast(response))
        .catch(response => errorToToast(response))
    }

  }

  const handleClose = () => {
    setOpenModal(false)
    setTestModal(false)
    setThreadModal(false)
    setPollFrequency(false)
    setScheduleModal(false)
    setModalTitle('')
  }

  const handleOnTest = () => {
    setOpenModal(true)
    setTestModal(true)
    setTestResult('')
    setModalTitle('Test')
  }
  const handleOnThreads = () => {
    setOpenModal(true)
    setThreadModal(true)
    setModalTitle('Set Threads')
  }
  const handleOnPollFrequency = () => {
    setOpenModal(true)
    setPollFrequency(true)
    setModalTitle('Poll Frequency')
  }
  const handleOnTrigger = () => {
    fetch(`${linkPrefix}://${connection?.address}/sn0wst0rm/api/1/jobs/${step.label}/trigger`,
      {method: 'GET', headers: {'content-type': 'application/json'}}
    )
      .then(response => successToToast(response))
      .catch(response => errorToToast(response))
  }

  const handleOnSchedule = () => {
    setOpenModal(true)
    setScheduleModal(true)
    setModalTitle('Schedule Job')
  }

  const handleStartStep = () => {
    fetch(`${linkPrefix}://${connection?.address}/sn0wst0rm/api/1/steps/${step.label}/start`,
      {method: 'PUT', headers: {'content-type': 'application/json'}}
    )
      .then(response => successToToast(response))
      .catch(response => errorToToast(response))

  }

  const handleStopStep = () => {
    fetch(`${linkPrefix}://${connection?.address}/sn0wst0rm/api/1/steps/${step.label}/stop`,
      {method: 'PUT', headers: {'content-type': 'application/json'}}
    )
      .then(response => successToToast(response))
      .catch(response => errorToToast(response))
  }

  const handleOnBufferSize = () => {
    setOpenModal(true)
    setBufferSizeModal(true)
    setModalTitle('Set Buffer Size')
  }

  if (isEdge) {
    return (
      <div className={'flex flex-col text-white gap-5'}>
        <div className={'flex flex-col gap-5 text-light-blue'}>
          <div className="flex h-96 w-1400">
            <div className='w-full h-full'>
              <Line
                options={{
                ...options,
                plugins: {...options.plugins, title: {display: true, text: 'Put Statistics'}}
              }}
                    updateMode={'resize'}
                    data={{
                      labels: graphStats.map((item: GraphData) => new Date(item.timestamp).toLocaleString().split(', ')[1]),
                      datasets: [{
                        label: 'Mean Execution Time(ms)',
                        data: graphStats.map((item: any) => trimNumber(item.put?.meanExecutionTimeMs)),
                        borderColor: 'orange',
                        backgroundColor: 'orange'
                      },
                        {
                          label: 'Median Execution Time(ms)',
                          data: graphStats.map((item: any) => trimNumber(item.put?.medianExecutionTimeMs)),
                          borderColor: 'green',
                          backgroundColor: 'green'
                        },
                        {
                          label: 'Standard Deviation Execution Time',
                          data: graphStats.map((item: any) => trimNumber(item.put?.standardDeviationExecutionTimeMs)),
                          borderColor: 'lightBlue',
                          backgroundColor: 'lightBlue'
                        }]
                    }}
              />
            </div>

            <div className='w-full h-full'>
              <Line options={{
                ...options,
                plugins: {...options.plugins, title: {display: true, text: 'Take Statistics'}}
              }}
                    updateMode={'resize'}
                    data={{
                      labels: graphStats.map((item: GraphData) => new Date(item.timestamp).toLocaleString().split(', ')[1]),
                      datasets: [{
                        label: 'Mean Execution Time(ms)',
                        data: graphStats.map((item: any) => trimNumber(item.take?.meanExecutionTimeMs)),
                        borderColor: 'orange',
                        backgroundColor: 'orange'
                      },
                        {
                          label: 'Median Execution Time(ms)',
                          data: graphStats.map((item: any) => trimNumber(item.take?.medianExecutionTimeMs)),
                          borderColor: 'green',
                          backgroundColor: 'green'
                        },
                        {
                          label: 'Standard Deviation Execution Time',
                          data: graphStats.map((item: any) => trimNumber(item.take?.standardDeviationExecutionTimeMs)),
                          borderColor: 'lightBlue',
                          backgroundColor: 'lightBlue'
                        }]
                    }}
              />
            </div>
          </div>

          <div className="flex justify-between">
            <span
              className={'flex gap-10 bg-card p-3 border border-solid border-gray-400 w-1/5'}>Puts: {queueState.puts}</span>
            <span
              className={'flex gap-10 bg-card p-3 border border-solid border-gray-400 w-1/5'}>Takes: {queueState.takes}</span>
          </div>
        </div>

        <Button styles={'bg-light-blue'} onClick={() => handleOnBufferSize()}>Set Buffer Size</Button>
        {
          openModal && bufferSizeModal &&
            <Modal onClose={handleClose} title={modalTitle} open={openModal} noOverlayClick={true}>
                <StepsForm modalType={'buffer'} data={queueState.bufferSize} onSubmit={onSubmit} stepType={step.type}
                           status={queueState.closed || status === 'online'}/>
            </Modal>
        }
      </div>)
  }

  return (
    <div className={'flex flex-col gap-5'}>
      <div className='w-full h-96'>
        <Line options={{
          ...options,
          plugins: {...options.plugins, title: {display: true, text: 'Take Statistics'}}
        }}
              updateMode={'resize'}
              data={{
                labels: graphStats.map((item: GraphData) => new Date(item.timestamp).toLocaleString().split(', ')[1]),
                datasets: [{
                  label: 'Mean Execution Time(ms)',
                  data: graphStats.map((item: any) => trimNumber(item.meanExecutionTimeMs)),
                  borderColor: 'orange',
                  backgroundColor: 'orange'
                },
                  {
                    label: 'Median Execution Time(ms)',
                    data: graphStats.map((item: any) => trimNumber(item.medianExecutionTimeMs)),
                    borderColor: 'green',
                    backgroundColor: 'green'
                  },
                  {
                    label: 'Standard Deviation Execution Time',
                    data: graphStats.map((item: any) => trimNumber(item.standardDeviationExecutionTimeMs)),
                    borderColor: 'lightBlue',
                    backgroundColor: 'lightBlue'
                  }]
              }}
        />
      </div>
      {
        step?.type !== 'job' &&
          <>
              <div className={'flex gap-5 justify-between text-light-blue'}>
                  <span
                      className={'flex gap-10 bg-card p-3 border border-solid border-gray-400 w-1/4'}>Total Calls: {state.totalStepCalls}</span>
                  <span className={'flex gap-10 bg-card p-3 border border-solid border-gray-400 w-1/4'}>Successful Calls: {state.successfulStepCalls}</span>
                  <span className={'flex gap-10 bg-card p-3 border border-solid border-gray-400 w-1/4'}>Unsuccessful Calls: {state.unsuccessfulStepCalls}</span>
              </div>
              <div className={'flex gap-10 bg-card p-3 border border-solid border-gray-400'}>
                  <Button styles={'bg-light-blue'} onClick={() => handleOnTest()}>Test</Button>
                  <Button styles={'bg-light-blue'} onClick={() => handleOnThreads()}>Threads</Button>
                  <Button styles={'bg-light-blue'} onClick={() => handleOnPollFrequency()}>Poll Frequency</Button>
                  <Button styles={'bg-light-blue'} disabled={!state.stopped}
                          onClick={() => handleStartStep()}>Start</Button>
                  <Button styles={'bg-light-blue'} disabled={state.stopped}
                          onClick={() => handleStopStep()}>Stop</Button>
                  <Button styles={'bg-light-blue font-bold text-16'}>
                      <FiSettings onClick={() => setConfigurationsModal(true)}/>
                  </Button>
                {
                  configurationsModal &&
                    <Modal
                        open={configurationsModal}
                        onClose={() => setConfigurationsModal(false)}
                        title={'Configurations'}
                    >
                        <SystemConfigModal connection={connection} step={step}/>
                    </Modal>
                }
              </div>
          </>
      }
      {
        step.type === 'job' &&
          <>
              <div className={'flex gap-5 text-light-blue'}>
                  <span
                      className={'flex gap-10 bg-card p-3 border border-solid border-gray-400 w-1/5'}>Last Trigger: {jobState.lastTrigger}</span>
                  <span className={'flex gap-10 bg-card p-3 border border-solid border-gray-400 w-1/5'}>Last Running Attempt: {jobState.lastAttempt}</span>
                  <span
                      className={'flex gap-10 bg-card p-3 border border-solid border-gray-400 w-1/5'}>Triggered: {jobState.triggered}</span>
                  <span
                      className={'flex gap-10 bg-card p-3 border border-solid border-gray-400 w-1/5'}>Status: {jobState.status}</span>
              </div>
              <div className={'flex bg-card p-3 border border-solid border-gray-400'}>
                  <Button styles={'bg-light-blue'} onClick={() => handleOnTrigger()}>Trigger</Button>
                  <Button styles={'bg-light-blue'} onClick={() => handleOnSchedule()}>Schedule</Button>
                  <Button styles={'bg-light-blue'} disabled={!jobState.stopped}
                          onClick={() => handleStartStep()}>Start</Button>
                  <Button styles={'bg-light-blue'} disabled={jobState.stopped}
                          onClick={() => handleStopStep()}>Stop</Button>
                  <Button styles={'bg-light-blue font-bold text-16'}>
                      <FiSettings onClick={() => setConfigurationsModal(true)}/>
                  </Button>
                {
                  configurationsModal &&
                    <Modal
                        open={configurationsModal}
                        onClose={() => setConfigurationsModal(false)}
                        title={'Configurations'}
                    >
                        <SystemConfigModal connection={connection} step={step}/>
                    </Modal>
                }
              </div>
          </>
      }
      {
        openModal &&
          <Modal onClose={handleClose} title={modalTitle} open={openModal} noOverlayClick={true}>
            {
              threadModal &&
                <StepsForm modalType={'thread'} data={state} onSubmit={onSubmit} stepType={step.type}
                           status={status === 'online'}/>
            }
            {
              pollFrequencyModal &&
                <StepsForm modalType={'pollFrequency'} data={state} onSubmit={onSubmit} stepType={step.type}
                           status={status === 'online'}/>
            }
            {
              scheduleModal &&
                <StepsForm modalType={'schedule'} data={jobState} onSubmit={onSubmit} stepType={step.type}
                           status={status === 'online'}/>
            }
            {
              testModal &&
                <StepsForm modalType={'test'} data={testResult} onSubmit={onSubmit} stepType={step.type}
                           status={status === 'online'}/>
            }
          </Modal>
      }
    </div>
  )
}