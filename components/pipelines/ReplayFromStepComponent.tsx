import {useEffect, useState} from "react";
import {Connection} from "../layout/provider/Context";
import {Pipeline} from "./utils/PipelinesUtils";
import {errorToToast, successToToast} from "../graphs/utils/GraphUtils";
import {useForm} from "react-hook-form";
import Button from "../layout/Button";

type Props = {
  shardId: string
  pipelineId: string
  txId: string
  connection: Connection,
  closeModal: () => void
}

export default function ReplayFromStepComponent(props: Props) {
  const {register, handleSubmit} = useForm<{step: string}>()
  const [steps, setSteps] = useState<string[]>([]);

  useEffect(() => {
    if (!props.connection) return
    fetch(`${props.connection?.secure ? 'https' : 'http'}://${props.connection?.address}/sn0wst0rm/api/1/pipelines/${props.pipelineId}/transactions/failed/${props.txId}/shards/${props.shardId}/steps`,
      {method: 'GET', headers: {'content-type': 'application/json'}}
    ).then(res => res.json()
      .then((body: { steps: string[] }) => {
        if (body.steps?.length) {
          const conns = localStorage.getItem('connections')
          if (conns) {
            const pipelines = JSON.parse(conns).find((c: Connection) => c.id === props.connection?.id)?.pipelines
            if (pipelines) {
              const currentPipeline = pipelines?.find((pipeline: Pipeline) => pipeline.id === props.pipelineId)
              if (currentPipeline) {
                const filteredSteps = body.steps?.reduce((acc: string[], step: string) => {
                  console.log(currentPipeline.pipes, step, acc)
                  if (currentPipeline.pipes?.some((p: Pipeline['pipes']) => p.name === step)) return acc
                  return [...acc, step]
                }, [])
                return setSteps(filteredSteps)
              }
            }
          }
        }
        return setSteps(body.steps)
      }))
  }, []);

  const onReplayCurrent = () => {
    const prefix = props.connection?.secure ? 'https' : 'http'
    fetch(`${prefix}://${props.connection?.address}/sn0wst0rm/api/1/pipelines/${props.pipelineId}/transactions/failed/${props.txId}/replay`,
      {method: 'PUT', headers: {'content-type': 'application/json'}})
      .then(res => {
        if (res.ok) {
          successToToast(res)
          return props.closeModal()
        }
        errorToToast(res)
      })
      .catch(response => errorToToast(response))
  }

  const onReplaySelected = (step: string) => {
    const prefix = props.connection?.secure ? 'https' : 'http'
    fetch(`${prefix}://${props.connection?.address}/sn0wst0rm/api/1/pipelines/${props.pipelineId}/transactions/failed/${props.txId}/shards/${props.shardId}/step/${step}/replay`,
      {method: 'PUT', headers: {'content-type': 'application/json'}})
      .then(res => {
        if (res.ok) {
          successToToast(res)
          return props.closeModal()
        }
        errorToToast(res)
      })
      .catch(response => errorToToast(response))
  }

  const onSubmit = (data: { step: string }) => {
    if (data.step === 'current') return onReplayCurrent()
    return onReplaySelected(data.step)
  }

  return <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
    <select
      className={"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"}
      placeholder={'Select Step'}
      {...register("step", {required: true})}>
      <option value="current">Current</option>
      {
        steps?.length &&
        steps?.map((step: string) => <option value={step} key={step}>{step}</option>)
      }
    </select>
    <Button styles={'bg-light-blue hover:bg-dark-blue m-0'}>Replay</Button>
  </form>
}
