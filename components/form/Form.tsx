import {useState} from "react";
import {Connection, useContextProvider} from "../layout/provider/Context";
import {useForm} from "react-hook-form";
import uuid from "react-uuid";
import {TbPlugConnected} from "react-icons/tb";
import Modal from "../modal/Modal";
import Button from "../layout/Button";


function Form() {
  const {register, handleSubmit, formState: {errors}, reset} = useForm()
  const {addConnection, connections} = useContextProvider()
  const [openModal, setOpenModal] = useState(false)

  function onSubmit(connection: any) {
    if (connections.find((item: Connection) => item.address === connection.address)) {
      setOpenModal(() => true)
      reset()

      return
    }
    addConnection(connection)
    reset()
  }

  const inputStyle = "shadow appearance-none border rounded p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
  const inputErrorStyle = 'ring-red-500 border-red-500'
  const errorElement = <span className='text-red-400'>This field is required</span>

  return (
    <div className='flex flex-col pb-9 w-fit container bg-card rounded p-5'>
      <h3 className='text-light-blue'>Instance Details</h3>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-row w-full gap-3'>
        <div className="flex gap-3">
          <div className='flex flex-col'>
            <input className={inputStyle + (errors.name && inputErrorStyle)} type="text"
                   placeholder='Connection Name' {...register('name', {required: true})}/>
            {errors.name && errorElement}
          </div>
          <div className='flex flex-col'>
            <input className={inputStyle + (errors.address && inputErrorStyle)} type="text"
                   placeholder='Connection IP' {...register('address', {required: true})}/>
            {errors.address && errorElement}
          </div>
          <input hidden value={uuid()} {...register('id')}/>
          <Button styles='bg-light-blue hover:bg-dark-blue'>
              <span className='flex font-bold'>
                Add <TbPlugConnected className={'text-16'}/>
              </span>
          </Button>
        </div>
      </form>
      {openModal &&
          <Modal
              open={openModal}
              title='Error Adding Connection'
              onClose={() => setOpenModal(false)}
          >
              <h3 className="text-center text-light-blue">Connection already exists.</h3>
          </Modal>}
    </div>
  )
}

export default Form