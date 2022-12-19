import {useForm} from "react-hook-form";
import {useState} from "react";
import Modal from "../modal/Modal";
import LoadingIcon from "../layout/LoadingIcon";
import Button from "../layout/Button";

type StepsFormProps = {
  modalType: string,
  data: any,
  onSubmit: (e: any) => void,
  stepType: string
}

const inputStyle = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
const inputErrorStyle = 'ring-red-500 border-red-500'
const errorElement = <span className='text-red-400'>This field is required</span>

export default function StepsForm({modalType, data, onSubmit, stepType}: StepsFormProps) {
  const {register, handleSubmit, formState: {errors}} = useForm()
  const [confirmationModal, setConfirmationModal] = useState(false)

  const beforeSubmit = (data: any) => {
    if (stepType === 'sink') {
      if (!confirmationModal) {
        return setConfirmationModal(true)
      }
      setConfirmationModal(false)
    }

    return onSubmit(data)
  }

  switch (modalType) {
    case 'test': {
      return (
        <>
          <form onSubmit={handleSubmit(beforeSubmit)} className='flex flex-col gap-3'>
            <div className={'flex gap-10'}>
              <div className='flex flex-col'>
                <span className={'text-white'}>Value</span>
                <textarea className={inputStyle + (errors.testValue && inputErrorStyle)}
                          disabled={stepType === 'source'}
                          rows={15} cols={30}
                          placeholder='Value' {...register('testValue', {required: stepType !== 'source'})}/>
                {errors.testValue && errorElement}
              </div>
              <div className='flex flex-col w-full'>
                <span className={'text-white'}>Result</span>
                <textarea disabled={true} className={'resize-none rounded-md h-full bg-white text-black'}
                          value={JSON.stringify(data, undefined, 2)}/>
              </div>
            </div>
            <Button styles='bg-light-blue hover:bg-dark-blue w-full justify-center'>
                        <span className='flex'>
                            Test
                        </span>
            </Button>
          </form>
          <Modal
            title={'Confirm Action'}
            onClose={() => setConfirmationModal(false)}
            open={confirmationModal}
          >
            <div className={'flex flex-col'}>
              <span className={'text-white'}>Are you sure you want to execute this action?</span>
              <div className={'flex gap-10 bg-card p-3 border border-solid border-gray-400 w-fit mx-auto'}>
                <Button styles={'bg-light-blue'} onClick={(e) => beforeSubmit(e)}>Confirm</Button>
                <Button styles={'bg-dark-blue'} onClick={() => setConfirmationModal(false)}>Cancel</Button>
              </div>
            </div>
          </Modal>
        </>
      )
    }
    case 'thread': {
      if (!data.threads) return <LoadingIcon/>
      return (
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-row gap-3'>
            <div className='flex flex-col'>
              <input className={inputStyle + (errors.numericValue && inputErrorStyle)} type="number"
                     min={1}
                     defaultValue={data.threads}
                     placeholder='Numeric Value' {...register('numericValue', {required: true})}/>
              {errors.numericValue && errorElement}
            </div>
            <Button styles='bg-light-blue'>
                      <span className='flex'>
                          Set
                      </span>
            </Button>
          </form>
        </div>)
    }
    case 'buffer': {
      if (!data) return <LoadingIcon/>
      return (
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-row gap-3'>
            <div className='flex flex-col'>
              <input className={inputStyle + (errors.numericValue && inputErrorStyle)} type="number"
                     defaultValue={data}
                     min={data + 1}
                     placeholder='Numeric Value' {...register('numericValue', {required: true})}/>
              {errors.numericValue && errorElement}
            </div>
            <Button styles='bg-light-blue'>
                      <span className='flex'>
                          Set
                      </span>
            </Button>
          </form>
        </div>)
    }
    case 'pollFrequency': {
      if (!data.timeUnit || !data.pollFrequency) return <LoadingIcon/>
      return (
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-row gap-3'>
            <div className='flex flex-col'>
              <input className={inputStyle + (errors.pollFrequency && inputErrorStyle)} type="number"
                     min={1}
                     defaultValue={data.pollFrequency}
                     placeholder='Poll Frequency' {...register('pollFrequency', {required: true})}/>
              {errors.pollFrequency && errorElement}
            </div>
            <div>
              <select
                defaultValue={data.timeUnit}
                className={inputStyle + (errors.timeUnit && inputErrorStyle)} {...register("timeUnit", {required: true})}>
                <option value="m">minute</option>
                <option value="s">second</option>
                <option value="ms">millisecond</option>
                <option value="us">microsecond</option>
                <option value="ns">nanosecond</option>
              </select>
              {errors.timeUnit && errorElement}
            </div>
            <Button styles='bg-light-blue'>
                      <span className='flex'>
                          Set
                      </span>
            </Button>
          </form>
        </div>)
    }
    case 'schedule': {
      return (
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-row gap-3'>
            <div className='flex flex-col'>
              <input className={inputStyle + (errors.cronJobPattern && inputErrorStyle)} type="text"
                     defaultValue={data.schedule}
                     placeholder='Cron Job Pattern' {...register('cronJobPattern', {required: true})}/>
              {errors.cronJobPattern && errorElement}
            </div>
            <Button styles='bg-light-blue'>
                      <span className='flex'>
                          Schedule
                      </span>
            </Button>
          </form>
        </div>)
    }

    default:
      return null
  }
}
