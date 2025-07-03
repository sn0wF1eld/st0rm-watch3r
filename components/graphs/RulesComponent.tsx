import {useForm} from "react-hook-form";
import {
  activeDropdown,
  dropdownElement,
  errorElement,
  inputErrorStyle,
  inputStyle,
  Rule,
  rulesTypes,
  showToastFailMessage,
  showToastSuccessMessage
} from "./utils/GraphUtils";
import {Connection} from "../layout/provider/Context";
import {useEffect, useState} from "react";
import Button from "../layout/Button";

type RulesComponentProps = {
  connection: Connection
}


export default function RulesComponent({connection}: RulesComponentProps) {
  const {register, handleSubmit, formState: {errors}, reset} = useForm()
  const [openDropdown, setOpenDropdown] = useState(false)
  const [selectedType, setSelectedType] = useState({} as Rule)
  const [existingRules, setExistingRules] = useState({} as any)

  const prefix = connection?.secure ? 'https' : 'http'

  const getRules = () => {
    return fetch(`${prefix}://${connection?.address}/jvm/notifications/rules`,
      {method: 'GET', headers: {'content-type': 'application/json'}}
    )
      .then(res => res.json())
      .catch(err => console.log(err))
  }

  useEffect(() => {
    getRules()
      .then(r => setExistingRules(r))
  }, [])

  const onSubmit = (data: any) => {
    reset()
    fetch(`${prefix}://${connection?.address}/jvm/notifications/rule`,
      {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({
          type: selectedType.field,
          warning: parseInt(data.warning, 10),
          critical: parseInt(data.critical, 10)
        })
      })
      .then(res => {
        if (res.ok) {
          getRules()
            .then(r => setExistingRules(r))
          showToastSuccessMessage('Rule Set!')
        }
      })
      .catch(() => showToastFailMessage('Error setting Rules.'))
  }

  const onReset = (e: any) => {
    e.preventDefault()
    reset()
    fetch(`${prefix}://${connection?.address}/jvm/notifications/rule/${selectedType.field}/reset`,
      {
        method: 'PUT',
        headers: {'content-type': 'application/json'}
      })
      .then(res => {
        if (res.ok) {
          getRules()
            .then(r => {
              setExistingRules(r)
              showToastSuccessMessage('Rule Reset!')
            })
        }
      })
      .catch(err => console.log(err))
  }

  const onSelectType = (rule: any) => {
    setOpenDropdown(false)
    reset()
    setSelectedType(rule)
  }

  return (
    <div className={'flex flex-col gap-5'}>
      <button
        className="w-72 mx-auto text-white bg-light-blue font-bold hover:bg-dark-blue font-medium rounded-lg text-sm px-4 py-2.5 text-right inline-flex cursor-pointer"
        onClick={() => setOpenDropdown(e => !e)}>
        {selectedType.name || 'Select Type'}
      </button>
      {openDropdown &&
          <div className="absolute z-10 w-72 mt-10 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700">
              <ul className="list-none py-1 px-0 text-sm text-gray-700 dark:text-gray-200">
                {
                  rulesTypes.map(rule => (
                    <li key={rule.value}>
                      <span
                        onClick={() => onSelectType(rule)}
                        className={selectedType.value === rule.value ? activeDropdown : dropdownElement}>
                        {rule.name}
                      </span>
                    </li>
                  ))
                }
              </ul>
          </div>}
      {
        selectedType.value &&
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
              <div className="flex gap-3">
                  <div className='flex flex-col'>
                      <span className={'text-white'}>Critical</span>
                      <input className={inputStyle + (errors.critical && inputErrorStyle)} type="number"
                             defaultValue={existingRules[selectedType.value]?.critical}
                             placeholder='Critical' {...register('critical', {required: true})}/>
                    {errors.critical && errorElement}
                  </div>
                  <div className='flex flex-col'>
                      <span className={'text-white'}>Warning</span>
                      <input className={inputStyle + (errors.warning && inputErrorStyle)} type="number"
                             defaultValue={existingRules[selectedType.value]?.warning}
                             placeholder='Warning' {...register('warning', {required: true})}/>
                    {errors.warning && errorElement}
                  </div>
              </div>
              <div className={'flex gap-10 bg-card p-3 border border-solid border-gray-400'}>
                  <Button styles='bg-light-blue hover:bg-dark-blue'>
                      Set
                  </Button>
                  <Button
                      onClick={(e) => onReset(e)}
                      styles='bg-red-600 hover:bg-red-400'
                  >
                      Reset
                  </Button>
              </div>
          </form>
      }
    </div>
  )

}