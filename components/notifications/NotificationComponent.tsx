import {IoMdNotifications} from "react-icons/io";
import {Connection, useContextProvider} from "../layout/provider/Context";
import {MutableRefObject, useEffect, useState} from "react";
import Modal from "../modal/Modal";
import ShardComponent from "../pipelines/ShardComponent";
import {Shard} from "../pipelines/FailedTransactionComponent";
import {timeConverter, useOutsideClick} from "../pipelines/utils/NavUtils";
import {MdClearAll} from "react-icons/md";

type Notification = {
  id: string
  type: string
  value: any
  timestamp: number
  address?: string
  txId?: string
  pipelineId?: string
  txShardId?: string
  level: string,
  secure: boolean
}


export default function NotificationComponent() {
  const {connections} = useContextProvider()
  const [notifications, setNotifications] = useState([] as Notification[])
  const [openNotifications, setOpenNotifications] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState({} as Notification)

  const markAsRead = (notification: Notification) => {
    setNotifications(cur => cur.filter(item => item.id !== notification.id))

    const prefix = notification.secure ? 'https' : 'http'
    fetch(`${prefix}://${notification.address}/jvm/notifications/${notification.id}/read`,
      {
        method: 'PUT',
        headers: {'content-type': 'application/json'}
      })
      .then(res => console.log('res', res))
      .catch(err => console.log(err))
  }

  useEffect(() => {

    connections.forEach((connection: Connection) => {
      const prefix = connection?.secure ? 'wss' : 'ws'
      const ws = new WebSocket(`${prefix}://${connection?.address}/jvm/notifications`)

      ws.onmessage = (event) => {
        const json = JSON.parse(event.data)
        if (json) {
          if (json.type === 'keep-alive') return

          setNotifications(e => [...e, {...json, address: connection.address, secure: connection.secure}])
        }
      }
      const ws2 = new WebSocket(`${prefix}://${connection?.address}/sn0wst0rm/api/1/pipelines/errors`)

      ws2.onmessage = (event) => {
        const json = JSON.parse(event.data)
        if (json) {
          if (json.type === 'keep-alive') return
          setNotifications(e => [...e, {...json, address: connection.address, secure: connection.secure}])
        }
      }
      return () => {
        ws.close();
        ws2.close()
      }
    })
  }, [connections])

  const handleCloseModal = () => {
    setTimeout(() => {
      setOpenModal(false)
      setSelectedNotification({} as Notification)
    }, 200)
  }

  const handleSelectNotification = (notification: Notification) => {
    setSelectedNotification(notification)
    setOpenModal(true)
    setOpenNotifications(false)
    markAsRead(notification)
  }

  const handleOutsideClick = () => setOpenNotifications(false)

  const notificationRef = useOutsideClick(handleOutsideClick) as MutableRefObject<HTMLDivElement>

  const onClearAll = () => {
    setNotifications(cur => cur.filter(item => item.type !== 'pipeline-error'))
  }

  return (
    <div>
      <div className="inline-flex relative w-fit">
        {notifications && <span
            className="absolute inline-block top-0 right-0 bottom-auto left-auto translate-x-2/4 -translate-y-1/2 rotate-0 skew-x-0 skew-y-0 scale-x-100 scale-y-100 py-1 px-2.5 text-xs leading-none text-center whitespace-nowrap align-baseline font-bold bg-red-500 text-white rounded-full z-10">
            {notifications.length}
          </span>
        }
        <IoMdNotifications
          className=" cursor-pointer text-white text-4xl focus:ring-4 focus:outline-none focus:ring-blue-300"
          onClick={() => setOpenNotifications(e => !e)}
        />
      </div>
      {
        openNotifications && <div
              ref={notificationRef}
              className={'z-10 h-40 overflow-auto absolute right-10 w-96 bg-secondary-bg text-white rounded border-solid border-1 border-gray-500'}>
          {
            !!notifications.length &&
              <button className={'absolute bg-transparent text-light-blue right-0 cursor-pointer'}
                      onClick={() => onClearAll()}><MdClearAll/></button>
          }
              <ul className={'flex flex-col list-none p-0 mt-6 border border-gray-100 rounded-lg'}>
                {
                  notifications.length ?
                    notifications.map((notification, idx) => (
                      <li key={`${notification.timestamp}${idx}`}>
                        <div
                          className={'flex text-xs content-between p-3 hover:bg-button-bg border-l-0 border-r-0 border-t-1 border-solid border-b-0 border-gray-500 cursor-pointer'}
                          onClick={() => handleSelectNotification(notification)}
                        >
                          <div className={'flex justify-between w-full'}>
                            <span>{notification.type}</span>
                            <span>{notification.level}</span>
                            <span>{notification.pipelineId}</span>
                            <span>{timeConverter(notification.timestamp)}</span>
                          </div>
                        </div>
                      </li>
                    )) : <span
                      className={'w-full text-center text-light-blue'}
                    >No Notifications</span>
                }
              </ul>
          </div>
      }
      {
        openModal && selectedNotification?.type === 'pipeline-error' &&
          <Modal onClose={() => handleCloseModal()} open={openModal} title={''}
                 noOverlayClick={true}>
              <ShardComponent
                  shard={
                    {
                      id: selectedNotification.txShardId,
                      pipelineId: selectedNotification.pipelineId,
                      txId: selectedNotification.txId
                    } as Shard}/>
          </Modal>
      }
      {
        openModal && selectedNotification.type !== 'pipeline-error' &&
          <Modal
              open={openModal}
              onClose={() => handleCloseModal()}
              title={selectedNotification.level[0].toUpperCase() + selectedNotification.level.substring(1)}>
              <div>
                <pre id={'json'} className={'overflow-auto w-full text-red-400'}>
                  {JSON.stringify(selectedNotification.value, undefined, 2)}
                </pre>
              </div>
          </Modal>
      }
    </div>
  )
}