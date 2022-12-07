import {PipelineState} from "./utils/PipelinesUtils";

export default function Stats( state: PipelineState) {

  return (
    <div className={'flex justify-center gap-10'}>
      <div className={'flex gap-2'}>
        <span className={'text-white'}>Started:</span>
        <span className={'text-light-blue'}>{state.started !== null ? state.started : '-'}</span>
      </div>
      <div className={'flex gap-2'}>
        <span className={'text-white'}>Terminated:</span>
        <span className={'text-light-blue'}>{state.terminated !== null ? state.terminated : '-'}</span>
      </div>
      <div className={'flex gap-2'}>
        <span className={'text-white'}>Back Pressure:</span>
        <span className={'text-light-blue'}>{state.backPressure !== null ? state.backPressure : '-'}</span>
      </div>
    </div>
  );
}
