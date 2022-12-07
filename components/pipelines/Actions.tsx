import {Connection} from "../layout/provider/Context";
import {useEffect, useState} from "react";
import Modal from "../modal/Modal";
import FailedTransactionComponent from "./FailedTransactionComponent";

type ActionsProps = {
  connection: Connection
  id: string
}

type FailedTransaction = {
  failedTxIds: string[]
}

export default function Actions({connection, id}: ActionsProps) {
  const [openModal, setOpenModal] = useState(false)
  const [failedTransactions, setFailedTransactions] = useState({} as FailedTransaction)
  const [selectedTx, setSelectedTx] = useState('')
  const [txData, setTxData] = useState({} as any)

  const url = `http://${connection.address}`

  useEffect(() => {
    if (!openModal) return setFailedTransactions({} as FailedTransaction)

    fetch(`${url}/cdg/api/1/pipelines/${id}/transactions/failed`)
      .then(res => {
        res.json()
          .then((json) => {
            if (json) {
              setFailedTransactions(json)
            }
          })
          .catch(err => console.log(err))
      })
  }, [openModal])
  const handleStart = () => {
    fetch(`${url}/cdg/api/1/pipelines/${id}/start`,
      {method: 'PUT', headers: {'content-type': 'application/json'}}
    )
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }

  const handleStop = () => {
    fetch(`${url}/cdg/api/1/pipelines/${id}/stop`,
      {method: 'PUT', headers: {'content-type': 'application/json'}}
    )
      .then(res => console.log(res))
      .catch(err => console.log(err))

  }

  const handleFailed = () => setOpenModal(true)

  const handleCloseModal = () => setTimeout(() => {
    setOpenModal(false)
    setSelectedTx('')
    setTxData({})
  }, 200)

  const onReplay = (tx: string) => {
    fetch(`${url}/cdg/api/1/pipelines/${id}/transactions/failed/${tx}/replay`,
      {method: 'PUT', headers: {'content-type': 'application/json'}})
      .then(res => console.log('replay', res))
  }

  const onSelectTx = (tx: string) => {
    if (selectedTx === tx) {
      setTxData({})
      setSelectedTx('')
      return
    }
    fetch(`${url}/cdg/api/1/pipelines/${id}/transactions/failed/${tx}`,
      {method: 'GET', headers: {'content-type': 'application/json'}})
      .then(res => {
        res.json()
          .then((json) => {
            if (json) {
              setTxData(json)
              setSelectedTx(tx)
            }
          })
      })
  }

  return (
    <div className={'flex gap-10 justify-center'}>
      <button
        className={'rounded text-white font-bold p-3 bg-blue-500 cursor-pointer'}
        onClick={() => handleStart()}
      >
        Start
      </button>
      <button
        className={'rounded text-white font-bold p-3 bg-blue-500 cursor-pointer'}
        onClick={() => handleStop()}
      >
        Stop
      </button>
      <button
        className={'rounded text-white font-bold p-3 bg-red-500 cursor-pointer'}
        onClick={() => handleFailed()}
      >
        Failed
        {openModal &&
            <Modal open={openModal} onClose={handleCloseModal} title={'Failed Transactions'} noOverlayClick={true}>
                <div className={'w-400'}>
                    <ul className={'list-none p-0 overflow-auto h-72'}>
                      {
                        failedTransactions?.failedTxIds?.map(tx => (
                          <li key={tx}>
                            <button
                              className={`w-full rounded p-3 text-light-blue bg-button-bg hover:bg-gray-600 cursor-pointer ${tx === selectedTx ? 'bg-gray-600 font-bold text-white' : ''}`}
                              onClick={() => onSelectTx(tx)}>
                              {tx}
                            </button>
                            {
                              selectedTx === tx &&
                                <FailedTransactionComponent transaction={{...txData, pipelineId: id}}/>
                            }
                          </li>
                        ))
                      }

                    </ul>

                </div>
                <div>
                    <button onClick={() => onReplay(selectedTx)}>Replay</button>
                </div>
            </Modal>
        }
      </button>
    </div>
  )

}