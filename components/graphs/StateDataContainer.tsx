import Modal from "../modal/Modal";
import RulesComponent from "./RulesComponent";
import {Connection} from "../layout/provider/Context";
import React, {MutableRefObject, useState} from "react";
import Button from "../layout/Button";
import DisplayCard from "./DisplayCard";
import {TbLayoutSidebarLeftExpand, TbLayoutSidebarRightExpand} from "react-icons/tb";
import {trimNumber} from "./utils/GraphUtils";
import {useOutsideClick} from "../pipelines/utils/NavUtils";

type StateDataContainerProps = {
  data: {
    usableDiskSpaceGb: number,
    totalDiskSpaceGb: number,
    usedDiskSpaceGb: number,
    freeDiskSpaceGb: number,
    gcTotalPauses: number,
    gcTotalTimeMs: number,
    processCpuTimeMs: number,
  },
  onGcCollect: () => void
  onHeapDump: () => void
  onHeapDownload: () => void
  connection: Connection
}

export default function StateDataContainer({
                                             data,
                                             onGcCollect,
                                             onHeapDownload,
                                             onHeapDump,
                                             connection
                                           }: StateDataContainerProps) {
  const [rulesModal, setRulesModal] = useState(false)
  const [expand, setExpand] = useState(false)

  const handleOutsideClick = () => setExpand(false)

  const sideRef = useOutsideClick(handleOutsideClick) as MutableRefObject<HTMLDivElement>

  if (!expand && !rulesModal) return (
    <div className={'absolute flex flex-col bg-gray-700 rounded-r-full -ml-6 py-3 gap-3 z-2 top-20'}>
      <Button onClick={() => setExpand(true)} styles={'bg-light-blue text-white'}>
        <TbLayoutSidebarLeftExpand className={'text-16'}/>
      </Button>
    </div>
  )

  return (
    <>
      <div
        ref={sideRef}
        className={'absolute backdrop-filter backdrop-blur bg-opacity-30 flex flex-col -ml-6 py-4 gap-3 z-2 w-72 top-20 rounded-r border border-solid border-gray-400'}>
        <a href='#' className='absolute text-light-blue top-2 right-2' onClick={() => setExpand(false)}>
          <TbLayoutSidebarRightExpand className={'text-16'}/>
        </a>
        <div className={'flex flex-col justify-between text-light-blue'}>
          <DisplayCard orientation={'row'}>
            <span>Usable Disk Space (Gb)</span>
            <span>{trimNumber(data.usableDiskSpaceGb)}</span>
          </DisplayCard>
          <DisplayCard orientation={'row'}>
            <span>Total Disk Space (Gb)</span>
            <span>{trimNumber(data.totalDiskSpaceGb)}</span>
          </DisplayCard>
          <DisplayCard orientation={'row'}>
            <span>Used Disk Space (Gb)</span>
            <span>{trimNumber(data.usedDiskSpaceGb)}</span>
          </DisplayCard>
          <DisplayCard orientation={'row'}>
            <span>Free Disk Space (Gb)</span>
            <span>{trimNumber(data.freeDiskSpaceGb)}</span>
          </DisplayCard>
          <DisplayCard orientation={'row'}>
            <span>GC Total Pauses</span>
            <span>{data.gcTotalPauses}</span>
          </DisplayCard>
          <DisplayCard orientation={'row'}>
            <span>GC Total Times (ms)</span>
            <span>{data.gcTotalTimeMs}</span>
          </DisplayCard>
          <DisplayCard orientation={'row'}>
            <span>Process CPU Time (ms)</span>
            <span>{data.processCpuTimeMs}</span>
          </DisplayCard>
        </div>
        <div className={'flex gap-10 bg-card p-3 border border-solid border-gray-400 flex-wrap mx-3'}>
          <Button styles={'bg-light-blue'} onClick={() => onGcCollect()}>GC Collect</Button>
          <Button styles={'bg-light-blue'} onClick={() => onHeapDump()}>Heap Dump</Button>
          <Button styles={'bg-light-blue'} onClick={() => onHeapDownload()}>Heap Download</Button>
          <Button styles={'bg-light-blue'} onClick={() => setRulesModal(true)}>Rules</Button>
        </div>
      </div>
      {
        rulesModal &&
          <Modal open={rulesModal} onClose={() => setRulesModal(false)} title={'Rules'} noOverlayClick={true}>
              <RulesComponent connection={connection}/>
          </Modal>
      }
    </>
  )
}