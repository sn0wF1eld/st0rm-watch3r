type ButtonProps = {
  children?: any,
  onClick?: (e: any) => void,
  disabled?: boolean,
  styles?: string
}

export default function Button({onClick, children, disabled, styles}: ButtonProps) {
  const handleClick = (e: any) => {
    return onClick ? onClick(e) : null
  }

  return (
    <button onClick={(e) => handleClick(e)} disabled={disabled} className={'flex border-none m-auto items-center rounded-full p-3 cursor-pointer font-bold ' + styles}>
      {children}
    </button>
  )
}
