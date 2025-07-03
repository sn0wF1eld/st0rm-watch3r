import {useEffect, useState} from "react";
import {Connection} from "../layout/provider/Context";
import {Pipeline} from "./utils/PipelinesUtils";

type Props = {
  shardId: string
  pipelineId: string
  txId: string
  connection: Connection
}

export default function ReplayFromStepComponent(props: Props) {
  const [steps, setSteps] = useState<string[]>([]);
  useEffect(() => {
    if (!props.connection) return
    fetch(`${props.connection?.secure ? 'https' : 'http'}://${props.connection?.address}/sn0wst0rm/api/1/pipelines/${props.pipelineId}/transactions/failed/${props.txId}/shards/${props.shardId}/steps`,
      {method: 'GET', headers: {'content-type': 'application/json'}}
    ).then(res => res.json()
      .then((body: string[]) => {
        if (body.length) {
          const conns = localStorage.getItem('connections')
          if (conns){
            const pipelines = JSON.parse(conns).find((c: Connection) => c.id === props.connection?.id)?.pipelines
            if (pipelines) {
              const currentPipeline =  pipelines?.find((pipeline: Pipeline) => pipeline.id === props.pipelineId)
              if (currentPipeline) {
                const filteredSteps = body?.reduce((acc: string[], step: string) => {
                  if (currentPipeline.pipes?.some((p: Pipeline['pipes']) => p.name === step)) return acc
                  return [...acc, step]
                }, [])
                return setSteps(filteredSteps)
              }
            }
          }
        }
        return setSteps(body)
      }))
  }, []);
  return <div>{JSON.stringify(steps)}</div>
}
