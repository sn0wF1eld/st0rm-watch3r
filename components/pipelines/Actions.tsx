import {Connection} from "../layout/provider/Context";
import {useEffect, useState} from "react";
import Modal from "../modal/Modal";
import FailedTransactionComponent from "./FailedTransactionComponent";
import LoadingIcon from "../layout/LoadingIcon";
import Button from "../layout/Button";
import {showToastFailMessage, successToToast, errorToToast} from "../graphs/utils/GraphUtils";

type ActionsProps = {
  connection: Connection
  name: string,
  status: string
}

type FailedTransaction = {
  failedTxIds: string[]
}

export default function Actions({connection, name, status}: ActionsProps) {
  const [openModal, setOpenModal] = useState(false)
  const [failedTransactions, setFailedTransactions] = useState({} as FailedTransaction)
  const [selectedTx, setSelectedTx] = useState('')
  const [txData, setTxData] = useState({} as any)
  const [loading, setLoading] = useState(false)

  const url = `${connection?.secure ? 'https' : 'http'}://${connection.address}`

  const fetchFailed = () => {
    setLoading(true)
    return fetch(`${url}/sn0wst0rm/api/1/pipelines/${name}/transactions/failed`)
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
    fetch(`${url}/sn0wst0rm/api/1/pipelines/${name}/start`,
      {method: 'PUT', headers: {'content-type': 'application/json'}}
    )
        .then(response => successToToast(response))
      .catch(() => showToastFailMessage('Failed to start'))
  }

  const handleStop = () => {
    fetch(`${url}/sn0wst0rm/api/1/pipelines/${name}/stop`,
      {method: 'PUT', headers: {'content-type': 'application/json'}}
    )
        .then(response => successToToast(response))
        .catch(response => errorToToast(response))

  }

  const handleFailed = () => setOpenModal(true)

  const handleCloseModal = () => setTimeout(() => {
    setOpenModal(false)
    setSelectedTx('')
    setTxData({})
  }, 200)

  const handleRefetch = () => {
    fetchFailed()
      .then(json => {
        setLoading(false)
        setFailedTransactions(json)
      })
      .catch(response => errorToToast(response))
  }

  const onReplay = (tx: string) => {
    fetch(`${url}/sn0wst0rm/api/1/pipelines/${name}/transactions/failed/${tx}/replay`,
      {method: 'PUT', headers: {'content-type': 'application/json'}})
      .then(res => {
        if (res.ok) {
          successToToast(res)
          fetchFailed()
            .then(json => {
              setLoading(false)
              setFailedTransactions(json)
            })
            .catch(response => errorToToast(response))
        }
      })
      .catch(response => errorToToast(response))
  }

    const onCleanup = (tx: string) => {
        fetch(`${url}/sn0wst0rm/api/1/pipelines/${name}/transactions/failed/${tx}/cleanup`,
            {method: 'PUT', headers: {'content-type': 'application/json'}})
            .then(res => {
                if (res.ok) {
                    successToToast(res)
                    fetchFailed()
                        .then(json => {
                            setLoading(false)
                            setFailedTransactions(json)
                        })
                        .catch(response => errorToToast(response))
                }
            })
            .catch(response => errorToToast(response))
    }

    const onCleanupAll = () => {
        fetch(`${url}/sn0wst0rm/api/1/pipelines/${name}/transactions/failed/cleanup`,
            {
                method: 'PUT', headers: {'content-type': 'application/json'}, body: JSON.stringify({
                    ...failedTransactions
                })
            })
            .then(res => {
                if (res.ok) {
                    successToToast(res)
                    fetchFailed()
                        .then(json => {
                            setLoading(false)
                            setFailedTransactions(json)
                        })
                        .catch(response => errorToToast(response))
                }
            })
            .catch(response => errorToToast(response))
    }

  const onReplayAll = () => {
    fetch(`${url}/sn0wst0rm/api/1/pipelines/${name}/transactions/failed/replay`,
      {
        method: 'PUT', headers: {'content-type': 'application/json'}, body: JSON.stringify({
          ...failedTransactions
        })
      })
      .then(res => {
        if (res.ok) {
            successToToast(res)
          fetchFailed()
            .then(json => {
              setLoading(false)
              setFailedTransactions(json)
            })
              .catch(response => errorToToast(response))
        }
      })
      .catch(response => errorToToast(response))
  }

  const onSelectTx = (tx: string) => {
    if (selectedTx === tx) {
      setTxData({})
      setSelectedTx('')
      return
    }
    fetch(`${url}/sn0wst0rm/api/1/pipelines/${name}/transactions/failed/${tx}`,
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
    <div className={'flex gap-10 justify-center bg-card p-3 border border-solid border-gray-400 w-fit m-auto'}>
      <Button
        styles={'m-0 font-bold p-3 bg-light-blue cursor-pointer'}
        onClick={() => handleStart()}
        disabled={status === 'online'}
      >
        Start
      </Button>
      <Button
        styles={'m-0 font-bold p-3 bg-light-blue cursor-pointer'}
        onClick={() => handleStop()}
        disabled={status === 'offline'}
      >
        Stop
      </Button>
      <Button
        styles={'m-0 font-bold p-3 bg-red-500 hover:bg-red-600 cursor-pointer'}
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
          openModal && !loading && ((failedTransactions?.failedTxIds?.length < 1) || !failedTransactions?.failedTxIds) && (
            <Modal open={openModal} onClose={handleCloseModal} title={'Failed Transactions'} noOverlayClick={true}>
              <span className={'text-light-blue'}>There are no failed transactions</span>
            </Modal>)
        }
        {openModal && !loading && (failedTransactions?.failedTxIds?.length > 0) &&
            <Modal open={openModal} onClose={handleCloseModal} title={'Failed Transactions'} noOverlayClick={true}>
                <div className={'w-400 flex flex-col'}>
                    <span className={'w-full p-2 text-end text-xs text-light-blue'}>
                        Transactions: {failedTransactions?.failedTxIds?.length}
                    </span>
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
                                <FailedTransactionComponent transaction={{...txData, pipelineId: name, pipelineName: name}} refreshTransactions={() => handleRefetch()}/>
                            }
                          </li>
                        ))
                      }

                    </ul>

                </div>
                <div className={'flex justify-center gap-10'}>
                    <Button styles={'bg-light-blue'} disabled={!selectedTx} onClick={() => onCleanup(selectedTx)}>Cleanup</Button>
                    <Button styles={'bg-light-blue'} onClick={() => onCleanupAll()}>Cleanup All</Button>
                    <Button styles={'bg-light-blue'} disabled={status === 'offline' || !selectedTx} onClick={() => onReplay(selectedTx)}>Replay</Button>
                    <Button styles={'bg-light-blue'} disabled={status === 'offline'} onClick={() => onReplayAll()}>Replay All</Button>
                </div>
            </Modal>
        }
      </Button>
    </div>
  )

}