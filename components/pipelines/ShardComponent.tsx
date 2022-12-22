import {useEffect, useState} from "react";
import {Shard} from "./FailedTransactionComponent";
import {Connection, useContextProvider} from "../layout/provider/Context";
import {usePathname} from "next/navigation";
import LoadingIcon from "../layout/LoadingIcon";
import Button from "../layout/Button";

type ShardProps = {
  shard: Shard
}

const buttonStyle = 'bg-light-blue hover:bg-dark-blue m-0'

export default function ShardComponent({shard}: ShardProps) {
  const {connections} = useContextProvider()
  const [connection, setConnection] = useState({} as Connection)
  const [areaData, setAreaData] = useState('' as any)
  const [showMessage, setShowMessage] = useState(false)
  const [shardData, setShardData] = useState({} as Shard)
  const [loading, setLoading] = useState(false)
  const currentLink = usePathname()

  useEffect(() => {
    setConnection(connections.find((item: any) => currentLink?.indexOf(item.id) !== -1))
  }, [connections])

  useEffect(() => {
    if (!connection?.address) return

    setLoading(true)
    const prefix = connection?.secure ? 'https' : 'http'
    fetch(`${prefix}://${connection?.address}/sn0wst0rm/api/1/pipelines/${shard.pipelineId}/transactions/failed/${shard.txId}/shards/${shard.id}`,
      {method: 'GET', headers: {'content-type': 'application/json'}}
    ).then((res: any) => {
      res.json()
        .then((json: Shard) => {
          setLoading(false)
          setShardData(json)
        })
    })

  }, [connection])

  const handleThrow = () => {
    setShowMessage(true)
    setAreaData(shardData?.throw?.stackTrace)
  }

  const handleValue = () => {
    setShowMessage(false)
    setAreaData(shardData?.value)
  }

  if (loading) return <LoadingIcon/>
  return (
    <div className={'w-760 flex flex-col gap-5'}>
      <span className={'text-gray-400'}>transaction id: <span className={'text-white'}>{shard.txId}</span></span>
      <span className={'text-gray-400'}>shard id: <span className={'text-white'}>{shardData.id}</span></span>
      <span className={'text-gray-400'}>failed step name: <span
        className={'text-white'}>{shardData.failedStepName}</span></span>
      <span className={'text-gray-400'}>failed thread: <span
          className={'text-white'}>{shardData.failedThread}</span></span>
      <span className={'text-gray-400'}>status: <span className={'text-white'}>{shardData.status}</span></span>
      <div className={'flex gap-10 bg-card p-3 border border-solid border-gray-400 w-fit mx-auto'}>
        <Button styles={buttonStyle} onClick={() => handleValue()}>Value</Button>
        <Button styles={buttonStyle} onClick={() => handleThrow()}>Throw</Button>
      </div>
      {
        showMessage &&
          <span className={'flex flex-wrap break-words text-red-400'}>Exception: {shardData?.throw?.message}</span>
      }
      {
        areaData &&
          <div className={'h-72 text-white overflow-auto'}>
              <textarea rows={15} cols={80} readOnly={true} value={JSON.stringify(areaData, undefined, 2)}/>
          </div>
      }
    </div>
  );
}