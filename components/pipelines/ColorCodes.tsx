export default function ColorCodes() {
  return (
    <div className={'bg-secondary-bg rounded-xl p-5 m-6 w-fit'}>
      <div className={'flex gap-10'}>
        <div>
          <span className={'text-white'}>Steps</span>
          <ul className={'flex flex-col gap-5 list-none p-0'}>
            <li className={'pl-3 pt-0.5 pr-3 pb-0.5 bg-orange-400 text-center'}>
              Source
            </li>
            <li className={'pl-3 pt-0.5 pr-3 pb-0.5 bg-yellow-400 text-center'}>
              Grinder
            </li>
            <li className={'pl-3 pt-0.5 pr-3 bg-green-400 text-center'}>
              Sink
            </li>
            <li className={'pl-3 pt-0.5 pr-3 pb-0.5 bg-light-blue text-center'}>
              Enricher
            </li>
            <li className={'pl-3 pt-0.5 pr-3 pb-0.5 bg-pink-400 text-center'}>
              Job
            </li>
          </ul>
        </div>
        <div>
          <span className={'text-white'}>Pipes</span>
          <ul className={'flex flex-col gap-5 list-none p-0'}>
            <ul className={'flex flex-col gap-5 list-none p-0'}>
              <li className={'pl-3 pt-0.5 pr-3 pb-0.5 bg-yellow-400 text-center'}>
                Splittable
              </li>
              <li className={'pl-3 pt-0.5 pr-3 pb-0.5 bg-red-400 text-center'}>
                Switchable
              </li>
              <li className={'pl-3 pt-0.5 pr-3 pb-0.5 bg-orange-400 text-center'}>
                Both
              </li>
              <li className={'pl-3 pt-0.5 pr-3 bg-gray-400 text-center'}>
                None
              </li>
            </ul>
          </ul>
        </div>
      </div>
    </div>
  )
}
