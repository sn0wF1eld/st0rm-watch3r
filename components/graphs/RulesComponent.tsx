import {useForm} from "react-hook-form";
import {
  activeDropdown,
  dropdownElement,
  errorElement,
  inputErrorStyle,
  inputStyle, Rule,
  rulesTypes
} from "./utils/GraphUtils";
import {Connection} from "../layout/provider/Context";
import {useEffect, useState} from "react";

type RulesComponentProps = {
  connection: Connection
}


export default function RulesComponent({connection}: RulesComponentProps) {
  const {register, handleSubmit, formState: {errors}, reset} = useForm()
  const [openDropdown, setOpenDropdown] = useState(false)
  const [selectedType, setSelectedType] = useState({} as Rule)
  const [existingRules, setExistingRules] = useState({} as any)

  const getRules = () => {
    return fetch(`http://${connection?.address}/jvm/notifications/rules`,
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
    fetch(`http://${connection?.address}/jvm/notifications/rule`,
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
        }
      })
      .catch(err => console.log(err))
  }

  const onReset = () => {
    reset()
    fetch(`http://${connection?.address}/jvm/notifications/rule/${selectedType.field}/reset`,
      {
        method: 'PUT',
        headers: {'content-type': 'application/json'}
      })
      .then(res => {
        if (res.ok) {
          getRules()
            .then(r => setExistingRules(r))
        }
      })
      .catch(err => console.log(err))
  }

  const onSelectType = (rule: any) => {
    reset()
    setSelectedType(rule)
  }

  return (
    <div>
      <button
        className="w-72 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-right inline-flex cursor-pointer"
        onClick={() => setOpenDropdown(e => !e)}>
        {selectedType.name || 'Select Type'}
      </button>
      {//TODO: add outside click close
      }
      {openDropdown &&
          <div className="absolute z-10 w-72 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700">
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
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2'>
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
              <div className="flex gap-10 justify-center">
                  <button type="submit"
                          className='p-2 w-1/3 rounded bg-green-600 hover:cursor-pointer hover:bg-green-400'>
                      Set
                  </button>
                  <input
                      type={'button'}
                      onClick={() => onReset()}
                      className='p-2 w-1/3 rounded bg-red-600 hover:cursor-pointer hover:bg-red-400'
                      value={'Reset'}
                  />
              </div>
          </form>
      }
    </div>
  )

}