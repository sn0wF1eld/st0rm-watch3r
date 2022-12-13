import {Connection} from "../layout/provider/Context";
import {useEffect, useState} from "react";
import Modal from "../modal/Modal";
import FailedTransactionComponent from "./FailedTransactionComponent";
import LoadingIcon from "../layout/LoadingIcon";

type ActionsProps = {
  connection: Connection
  id: string,
  status: string
}

type FailedTransaction = {
  failedTxIds: string[]
}

export default function Actions({connection, id, status}: ActionsProps) {
  const [openModal, setOpenModal] = useState(false)
  const [failedTransactions, setFailedTransactions] = useState({} as FailedTransaction)
  const [selectedTx, setSelectedTx] = useState('')
  const [txData, setTxData] = useState({} as any)
  const [loading, setLoading] = useState(false)

  const url = `http://${connection.address}`

  const fetchFailed = () => {
    setLoading(true)
    return fetch(`${url}/sn0wst0rm/api/1/pipelines/${id}/transactions/failed`)
      .then(res => {
        return res.json()
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    if (!openModal) return setFailedTransactions({} as FailedTransaction)
    fetchFailed()
      .then(res => {
        setLoading(false)
        setFailedTransactions(res)
      })

  }, [openModal])
  const handleStart = () => {
    fetch(`${url}/sn0wst0rm/api/1/pipelines/${id}/start`,
      {method: 'PUT', headers: {'content-type': 'application/json'}}
    )
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }

  const handleStop = () => {
    fetch(`${url}/sn0wst0rm/api/1/pipelines/${id}/stop`,
      {method: 'PUT', headers: {'content-type': 'application/json'}}
    )
      .then(res => console.log(res))
      .catch(err => console.log(err))

  }

  const handleFailed = () => setOpenModal(true)

  const handleCloseModal = () => setTimeout(() => {
    console.log('here')
    setOpenModal(false)
    setSelectedTx('')
    setTxData({})
  }, 200)

  const onReplay = (tx: string) => {
    fetch(`${url}/sn0wst0rm/api/1/pipelines/${id}/transactions/failed/${tx}/replay`,
      {method: 'PUT', headers: {'content-type': 'application/json'}})
      .then(res => {
        if (res.ok) {
          fetchFailed()
            .then(json => {
              setLoading(false)
              setFailedTransactions(json)
            })
            .catch(err => console.log(err))
        }
      })
      .catch(err => console.log(err))
  }

  const onReplayAll = () => {
    fetch(`${url}/sn0wst0rm/api/1/pipelines/${id}/transactions/failed/replay`,
      {
        method: 'PUT', headers: {'content-type': 'application/json'}, body: JSON.stringify({
          ...failedTransactions
        })
      })
      .then(res => {
        if (res.ok) {
          fetchFailed()
            .then(json => {
              setLoading(false)
              setFailedTransactions(json)
            })
            .catch(err => console.log(err))
        }
      })
      .catch(err => console.log(err))
  }

  const onSelectTx = (tx: string) => {
    if (selectedTx === tx) {
      setTxData({})
      setSelectedTx('')
      return
    }
    fetch(`${url}/sn0wst0rm/api/1/pipelines/${id}/transactions/failed/${tx}`,
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
        {
          openModal && loading && (
            <Modal open={openModal} onClose={handleCloseModal} title={'Failed Transactions'} noOverlayClick={true}>
              <LoadingIcon/>
            </Modal>)
        }
        {
          openModal && !loading && (failedTransactions?.failedTxIds?.length < 1) && (
            <Modal open={openModal} onClose={handleCloseModal} title={'Failed Transactions'} noOverlayClick={true}>
              <span>There are no failed transactions</span>
            </Modal>)
        }
        {openModal && !loading && (failedTransactions?.failedTxIds?.length > 0) &&
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
                    <button disabled={status === 'offline'} onClick={() => onReplay(selectedTx)}>Replay</button>
                    <button disabled={status === 'offline'} onClick={() => onReplayAll()}>Replay All</button>
                </div>
            </Modal>
        }
      </button>
    </div>
  )

}