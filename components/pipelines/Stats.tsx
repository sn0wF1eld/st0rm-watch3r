import {PipelineState} from "./utils/PipelinesUtils";
import DisplayCard from "../graphs/DisplayCard";

export default function Stats(state: PipelineState) {

  return (
    <div className={'flex justify-center gap-10'}>
      <DisplayCard orientation={'row gap-3'}>
        <span className={'text-white'}>Started:</span>
        <span className={'text-light-blue'}>{state.started !== null ? state.started : '-'}</span>
      </DisplayCard>
      <DisplayCard orientation={'row gap-3'}>
        <span className={'text-white'}>Terminated:</span>
        <span className={'text-light-blue'}>{state.terminated !== null ? state.terminated : '-'}</span>
      </DisplayCard>
      <DisplayCard orientation={'row gap-3'}>
        <span className={'text-white'}>Back Pressure:</span>
        <span className={'text-light-blue'}>{state.backPressure !== null ? state.backPressure : '-'}</span>
      </DisplayCard>
      <DisplayCard orientation={'row gap-3'}>
          <span className={'text-white'}>Stopped At:</span>
          <span className={'text-light-blue'}>{state.stoppedAt !== null ? state.stoppedAt : '-'}</span>
      </DisplayCard>
    </div>
  );
}
