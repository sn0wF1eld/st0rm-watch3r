import {Connection} from "../layout/provider/Context";
import {useEffect, useState} from "react";
import Modal from "../modal/Modal";
import StepsForm from "./StepsForm";
import {FiSettings} from "react-icons/fi";
import SystemConfigModal from "./SystemConfigModal";

type StepProps = {
  connection: Connection,
  step: {
    label: string,
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

export default function StepsModal({connection, step, isEdge, status}: StepProps) {
  const [stats, setStats] = useState({} as Statistics)
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

  const linkPrefix = connection.secure ? 'https' : 'http'
  const socketPrefix = connection.secure ? 'wss' : 'ws'

  useEffect(() => {
    if (!connection || !step) return

    if (!isEdge) {
      const ws = new WebSocket(`${socketPrefix}://${connection?.address}/sn0wst0rm/api/1/steps/${step.label}/statistics`)
      const ws2 = new WebSocket(`${socketPrefix}://${connection?.address}/sn0wst0rm/api/1/steps/${step.label}/state`)

      ws.onmessage = (event) => {
        const json = JSON.parse(event.data)
        if (json) {
          setStats(json)
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

    const ws = new WebSocket(`${socketPrefix}://${connection?.address}/sn0wst0rm/api/1/queues/${step.title}/statistics`)
    const ws2 = new WebSocket(`${socketPrefix}://${connection?.address}/sn0wst0rm/api/1/queues/${step.title}/state`)

    ws.onmessage = (event) => {
      const json = JSON.parse(event.data)
      if (json) {
        setQueueStatistics(json)
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
        .then(res => console.log(res))
        .catch(err => console.log(err))
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
        .then(res => console.log(res))
        .catch(err => console.log(err))
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
        .then(res => console.log(res))
        .catch(err => console.log(err))
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
      fetch(`${linkPrefix}://${connection?.address}/sn0wst0rm/api/1/queues/${step.title}/set-buffer-size`,
        {
          method: 'PUT',
          headers: {'content-type': 'application/json'},
          body: JSON.stringify({
            bufferSize: parseInt(data.numericValue, 10),
          })
        })
        .then(res => console.log(res))
        .catch(err => console.log(err))
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
      .then(res => console.log(res))
      .catch(err => console.log(err))
// TODO: Message
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
      .then(res => console.log(res))
      .catch(err => console.log(err))

  }

  const handleStopStep = () => {
    fetch(`${linkPrefix}://${connection?.address}/sn0wst0rm/api/1/steps/${step.label}/stop`,
      {method: 'PUT', headers: {'content-type': 'application/json'}}
    )
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }

  const handleOnBufferSize = () => {
    setOpenModal(true)
    setBufferSizeModal(true)
    setModalTitle('Set Buffer Size')
  }

  if (isEdge) {
    return (<div className={'flex flex-col text-white gap-5'}>
      <span>Put Statistics</span>
      <div className={'flex gap-5'}>
        <span>Mean Execution Time(ms): {queueStatistics?.put?.meanExecutionTimeMs}</span>
        <span>Median Execution Time(ms): {queueStatistics?.put?.medianExecutionTimeMs}</span>
        <span>Standard Deviation Execution Time: {queueStatistics?.put?.standardDeviationExecutionTimeMs}</span>
        <span>Puts: {queueState.puts}</span>
      </div>
      <span>Take Statistics</span>
      <div className={'flex gap-5'}>
        <span>Mean Execution Time(ms): {queueStatistics?.take?.meanExecutionTimeMs}</span>
        <span>Median Execution Time(ms): {queueStatistics?.take?.medianExecutionTimeMs}</span>
        <span>Standard Deviation Execution Time: {queueStatistics?.take?.standardDeviationExecutionTimeMs}</span>
        <span>Takes: {queueState.takes}</span>
      </div>
      <button disabled={queueState.closed || status === 'online'} onClick={() => handleOnBufferSize()}>Set Buffer Size</button>
      {
        openModal && bufferSizeModal &&
          <Modal onClose={handleClose} title={modalTitle} open={openModal} noOverlayClick={true}>
              <StepsForm modalType={'buffer'} data={queueState.bufferSize} onSubmit={onSubmit} stepType={step.type}/>
          </Modal>
      }
    </div>)
  }

  return (
    <div>
      <div className={'flex gap-5'}>
        <span>Mean Execution Time(ms): {stats.meanExecutionTimeMs}</span>
        <span>Median Execution Time(ms): {stats.medianExecutionTimeMs}</span>
        <span>Standard Deviation Execution Time: {stats.standardDeviationExecutionTimeMs}</span>
      </div>
      {
        step?.type !== 'job' &&
          <>
              <div className={'flex gap-5'}>
                  <span>Total Calls: {state.totalStepCalls}</span>
                  <span>Successful Calls: {state.successfulStepCalls}</span>
                  <span>Unsuccessful Calls: {state.unsuccessfulStepCalls}</span>
              </div>
              <div>
                  <button onClick={() => handleOnTest()}>Test</button>
                  <button disabled={status === 'online'} onClick={() => handleOnThreads()}>Threads</button>
                  <button disabled={status === 'online'} onClick={() => handleOnPollFrequency()}>Poll Frequency</button>
                  <button disabled={!state.stopped} onClick={() => handleStartStep()}>Start</button>
                  <button disabled={state.stopped} onClick={() => handleStopStep()}>Stop</button>
                  <button >
                      <FiSettings onClick={() => setConfigurationsModal(true)}/>
                  </button>
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
              <div className={'flex gap-5'}>
                  <span>Last Trigger: {jobState.lastTrigger}</span>
                  <span>Last Running Attempt: {jobState.lastAttempt}</span>
                  <span>Triggered: {jobState.triggered}</span>
                  <span>Status: {jobState.status}</span>
              </div>
              <div>
                  <button onClick={() => handleOnTrigger()}>Trigger</button>
                  <button disabled={status === 'online'} onClick={() => handleOnSchedule()}>Schedule</button>
                  <button disabled={!jobState.stopped} onClick={() => handleStartStep()}>Start</button>
                  <button disabled={jobState.stopped} onClick={() => handleStopStep()}>Stop</button>
                  <button >
                      <FiSettings onClick={() => setConfigurationsModal(true)}/>
                  </button>
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
                <StepsForm modalType={'thread'} data={state} onSubmit={onSubmit} stepType={step.type}/>
            }
            {
              pollFrequencyModal &&
                <StepsForm modalType={'pollFrequency'} data={state} onSubmit={onSubmit} stepType={step.type}/>
            }
            {
              scheduleModal &&
                <StepsForm modalType={'schedule'} data={jobState} onSubmit={onSubmit} stepType={step.type}/>
            }
            {
              testModal &&
                <StepsForm modalType={'test'} data={testResult} onSubmit={onSubmit} stepType={step.type}/>
            }
          </Modal>
      }
    </div>
  )
}