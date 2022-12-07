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
  return <div>{JSON.stringify(configurations, undefined, 2)}</div>
}