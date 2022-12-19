type DisplayCardProps = {
  children: any,
  orientation: string
}

export default function DisplayCard({children, orientation}: DisplayCardProps) {
  return (
    <div className={'flex justify-between bg-card p-3 border border-solid border-gray-400 m-3 ' + 'flex-' + orientation}>
      {children}
    </div>
  )
}