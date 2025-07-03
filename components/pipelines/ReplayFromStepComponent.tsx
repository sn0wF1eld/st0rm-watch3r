import {useEffect, useState} from "react";
import {useContextProvider} from "../layout/provider/Context";

type Props = {
  shardId: string
  pipelineId: string
  txId: string
}

export default function ReplayFromStepComponent(props: Props) {
  const {connection} = useContextProvider()
  const [steps, setSteps] = useState(['']);
  useEffect(() => {
    if (!connection) return
    fetch(`${connection?.secure ? 'https' : 'http'}://${connection?.address}/sn0wst0rm/api/1/pipelines/${props.pipelineId}/transactions/failed/${props.txId}/shards/${props.shardId}/steps`,
      {method: 'GET', headers: {'content-type': 'application/json'}}
    ).then(res => res.json()
      .then((body: string[]) => {
        return setSteps(body)
      }))
  }, [connection]);
  return <div>{JSON.stringify(steps)}</div>
}
