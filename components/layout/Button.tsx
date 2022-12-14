type ButtonProps = {
  children?: any,
  onClick?: () => void,
  disabled?: boolean,
  styles?: string
}

export default function Button({onClick, children, disabled, styles}: ButtonProps) {
  const handleClick = () => {
    return onClick ? onClick() : null
  }

  return (
    <button onClick={() => handleClick()} disabled={disabled} className={'flex border-none m-auto items-center rounded-full p-3 cursor-pointer ' + styles}>
      {children}
    </button>
  )
}
