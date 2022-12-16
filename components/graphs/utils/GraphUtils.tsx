import {Connection} from "../../layout/provider/Context";

export type GraphsContainerProps = {
  connection: Connection,
  options: any,

}
export type GraphData = {
  systemCpuLoad: number,
  totalClassesLoaded: number,
  threadCount: number,
  heapMaxSizeMb: number,
  classesLoaded: number,
  usableDiskSpaceGb: number,
  gcTotalPauses: number,
  gcTotalTimeMs: number,
  heapFreeMemoryMb: number,
  classesUnloaded: number,
  usedDiskSpaceGb: number,
  metaspaceMax: number,
  freeDiskSpaceGb: number,
  gcTimePercent: number,
  totalStartedThreads: number,
  totalDiskSpaceGb: number,
  metaspaceCommited: number,
  peakThreadCount: number,
  timestamp: number,
  heapUsedMemoryMb: number,
  heapSizeMb: number,
  processCpuLoad: number,
  metaspaceUsed: number,
  daemonThreadCount: number,
  gcAvgTimeMs: number,
  processCpuTimeMs: number
}

export type Rule = {
  value: string,
  name: string,
  field: string
}

export const rulesTypes = [
  {
    value: 'processCpuLoad',
    name: 'Process Cpu Load',
    field: 'process-cpu-load'},
  {
    value: 'systemCpuLoad',
    name: 'System Cpu Load',
    field: 'system-cpu-load'},
  {
    value: 'heapFreeMemoryMb',
    name: 'Heap Free Memory Mb',
    field: 'heap-free-memory-mb'},
  {
    value: 'usableDiskSpaceGb',
    name: 'Usable Disk Space Gb',
    field: 'usable-disk-space-gb'
  }
]

export const inputStyle = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
export const inputErrorStyle = 'ring-red-500 border-red-500'
export const errorElement = <span className='text-red-400'>This field is required</span>
export const dropdownElement = "block cursor-pointer py-2 px-4 hover:bg-gray-100 hover:text-black"
export const activeDropdown = "block cursor-pointer py-2 px-4 hover:bg-gray-100 bg-blue-400 hover:text-black"

export function handleArraySize(oldArray: any[]): any[] {
  return oldArray.length > 50 ? oldArray.slice(-50) : oldArray
}

export const trimNumber = (number: number) => {
  if (!number) return number
  return number.toFixed(3)
}
