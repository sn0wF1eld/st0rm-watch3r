import {useEffect, useState} from "react";
import {Connection} from "../layout/provider/Context";

type Props = {
  shardId: string
  pipelineId: string
  txId: string
  connection: Connection
}

export default function ReplayFromStepComponent(props: Props) {
  const [steps, setSteps] = useState(['']);
  useEffect(() => {
    if (!props.connection) return
    fetch(`${props.connection?.secure ? 'https' : 'http'}://${props.connection?.address}/sn0wst0rm/api/1/pipelines/${props.pipelineId}/transactions/failed/${props.txId}/shards/${props.shardId}/steps`,
      {method: 'GET', headers: {'content-type': 'application/json'}}
    ).then(res => res.json()
      .then((body: string[]) => {
        return setSteps(body)
      }))
  }, []);
  return <div>{JSON.stringify(steps)}</div>
}
