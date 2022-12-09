import {Connection} from "../../layout/provider/Context";

export const getNodeColor = (type: string) => {

  switch (type) {
    case 'source': {
      return 'orange'
    }
    case 'grinder': {
      return 'yellow'
    }
    case 'sink': {
      return 'green'
    }
    case 'enricher': {
      return 'light-blue'
    }
    case 'job': {
      return 'pink'
    }
    default:
      return 'green'
  }
}

export const getEdgeColor = (splittable: boolean, switchable: boolean) => {
  if (splittable) {
    if (switchable) {
      return 'orange'
    }
    return 'yellow'
  }

  if (switchable) {
    return 'red'
  }
  return
}

export type PipelineState = {
  started: number
  terminated: number
  backPressure: number
  stoppedAt: any
}

export type Pipeline = {
  id: string
  status: string
  stoppedAt: number
  pipeline: {
    connectsTo: Pipeline['pipeline'][]
    name: string
    splittable: boolean
    stepType: string
    switchable: boolean
  }
}

export type SystemConfigProps = {
  connection: Connection,
  step?: {
    label: string,
    type: string
    title?: string
  }
}

export type UptimeProps = {
  connection: Connection
}

export const getSystemConfigs = (connection: Connection) => {
  return fetch(`http://${connection?.address}/cdg/api/1/pipelines`,
    {method: 'GET', headers: {'content-type': 'application/json'}}
  )
    .then(res => res.json())
}

export const getStepConfigs = (connection: Connection, step: any) => {
  return fetch(`http://${connection?.address}/cdg/api/1/steps/${step.label}/config`,
    {method: 'GET', headers: {'content-type': 'application/json'}}
  )
    .then(res => res.json())
}

export type SystemConfigurations = {
  threadsType: string,
  queueConf: {
    bufferSize: number
  },
  sinks:
    {
      name: string,
      tx: {
        failFast?: true,
        retries: number
      },
      connectsTo: [
        string
      ],
      fns: {
        xFn: string,
        vFn: string
      },
      pollFrequency: number,
      timeUnit: string,
      threads: number
    }[],
  sources:
    {
      name: string,
      tx: {
        failFast?: true,
        retries: number
      },
      connectsTo: [
        string
      ],
      fns: {
        xFn: string,
        vFn: string
      },
      pollFrequency: number,
      timeUnit: string,
      threads: number
    }[],
  globalStateManager: {
    type: string,
    conf: string
  },
  jobs:
    {
      name: string,
      tx: {
        failFast?: true,
        retries: number
      },
      connectsTo: [
        string
      ],
      fns: {
        xFn: string,
        vFn: string
      },
      pollFrequency: number,
      timeUnit: string,
      threads: number
    }[],
  errorSink: {
    fns: {
      xFn: string
    },
    pollFrequency: number,
    timeUnit: string,
    threads: number
  },
  processingType: string,
  txManager: {
    type: string,
    conf: {
      file: string
    }
  },
  grinders: {
      name: string,
      tx: {
        failFast?: true,
        retries: number
      },
      connectsTo: [
        string
      ],
      fns: {
        xFn: string,
        vFn: string
      },
      pollFrequency: number,
      timeUnit: string,
      threads: number
    }[]
}

export const secondsToDaysHoursMinutesSeconds = (seconds: number) => {
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