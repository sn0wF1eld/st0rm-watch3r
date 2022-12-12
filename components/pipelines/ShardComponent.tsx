import {useEffect, useState} from "react";
import {Shard} from "./FailedTransactionComponent";
import {Connection, useContextProvider} from "../layout/provider/Context";
import {usePathname} from "next/navigation";
import LoadingIcon from "../layout/LoadingIcon";

type ShardProps = {
  shard: Shard
}

const buttonStyle = 'rounded bg-light-blue font-bold hover:bg-blue-400 cursor-pointer'

export default function ShardComponent({shard}: ShardProps) {
  const {connections} = useContextProvider()
  const [connection, setConnection] = useState({} as Connection)
  const [areaData, setAreaData] = useState('' as any)
  const [shardData, setShardData] = useState({} as Shard)
  const [loading, setLoading] = useState(false)
  const currentLink = usePathname()

  useEffect(() => {
    setConnection(connections.find((item: any) => currentLink?.indexOf(item.id) !== -1))
  }, [connections])

  useEffect(() => {
    console.log('shard', connection)
    if (!connection?.address) return

      console.log('resp', connection)
      setLoading(true)
      fetch(`http://${connection?.address}/sn0wst0rm/api/1/pipelines/${shard.pipelineId}/transactions/failed/${shard.txId}/shards/${shard.id}`,
        {method: 'GET', headers: {'content-type': 'application/json'}}
      ).then((res: any) => {
        res.json()
          .then((json: Shard) => {
            setLoading(false)
            setShardData(json)
          })
      })

  }, [connection])

  if (loading) return <LoadingIcon />
  console.log(shardData)
  return (
    <div className={'w-760 flex flex-col gap-5'}>
      <span className={'text-gray-400'}>transaction id: <span className={'text-white'}>{shard.txId}</span></span>
      <span className={'text-gray-400'}>shard id: <span className={'text-white'}>{shardData.id}</span></span>
      <span className={'text-gray-400'}>failed step name: <span className={'text-white'}>{shardData.failedStepName}</span></span>
      <span className={'text-gray-400'}>status: <span className={'text-white'}>{shardData.status}</span></span>
      <div className={'flex gap-10'}>
        <button className={buttonStyle} onClick={() => setAreaData(shardData?.value)}>Value</button>
        <button className={buttonStyle} onClick={() => setAreaData(shardData?.throw?.stackTrace)} >Throw</button>
      </div>
      <div className={'h-72 text-white'}>
        {
          shardData?.throw?.message &&
          <span>Exception: {shardData?.throw?.message}</span>
        }
        <textarea rows={15} cols={80} defaultValue={areaData ? JSON.stringify(areaData, undefined, 2) : ''}/>
      </div>
    </div>
  );
}