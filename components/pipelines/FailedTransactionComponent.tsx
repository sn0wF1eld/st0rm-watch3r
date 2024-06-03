import Modal from "../modal/Modal";
import {useState} from "react";
import ShardComponent from "./ShardComponent";

export type Shard = {
  id: string,
  value?: string,
  failedStepName?: string,
  failedThread?: number,
  status?: string,
  failedTs?: number,
  throw?: {
    stackTrace: string[],
    data: any,
    message: string
  }
  txId: string,
  pipelineId: string,
  pipelineName: string,
  isEditable?: boolean
}

type FailedTransactionProps = {
  transaction: {
    id: string,
    shards: string[]
    pipelineId: string,
    pipelineName: string,
    failedAt: number
  },
  refreshTransactions: () => void
}

export default function FailedTransactionComponent({transaction, refreshTransactions}: FailedTransactionProps) {
  const [openModal, setOpenModal] = useState(false)
  const [shardId, setShardId] = useState('')

  const handleOpenShard = (shardId: string) => {
    setOpenModal(true)
    setShardId(shardId)
  }

  const handleClose = () => {
    setTimeout(() => {
      setOpenModal(false)
      setShardId('')
      refreshTransactions()
    }, 50)
  }

  return (
    <div className={'flex flex-col border-solid border-1 border-light-blue'}>
      <ul className={'list-none p-0'}>
        {
          transaction.shards.map(shard => (
            <li
              key={shard}
              className={'p-2 border-b-1 border-t-0 border-l-0 border-r-0 border-solid border-gray-400'}>
              <div className={'flex flex-col gap-2 text-gray-300'}>
                <button className={'p-2 cursor-pointer'} onClick={() => handleOpenShard(shard)}>
                  id: <span className={'text-dark-blue'}>{shard}</span>
                </button>
              </div>
              {shardId === shard && openModal &&
                  <Modal onClose={() => handleClose()} open={openModal} title={''} noOverlayClick={true}>
                      <ShardComponent shard={{id: shard, txId: transaction.id, pipelineId: transaction.pipelineId, pipelineName: transaction.pipelineName} }  closeModal={() => handleClose()}/>
                  </Modal>}
            </li>
          ))
        }
      </ul>
    </div>
  )
}