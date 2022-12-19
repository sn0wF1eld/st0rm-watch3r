import {getStepConfigs, getSystemConfigs, SystemConfigProps, SystemConfigurations} from "./utils/PipelinesUtils";
import {useEffect, useState} from "react";


export default function SystemConfigModal({connection, step}: SystemConfigProps) {
  const [configurations, setConfigurations] = useState({} as SystemConfigurations)

  useEffect(() => {
    if (step) {
      getStepConfigs(connection, step)
        .then(res => setConfigurations(res))
        .catch(err => console.log(err))
      return
    }
    getSystemConfigs(connection)
      .then(res => setConfigurations(res))
      .catch(err => console.log(err))
  }, [])
  return <textarea className={'bg-gray-900 text-white'} rows={15} cols={80} disabled={true} value={JSON.stringify(configurations, undefined, 2)}/>
}