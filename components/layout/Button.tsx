type ButtonProps = {
  children?: any,
  onClick?: () => void,
  disabled?: boolean,
  styles?: string
}

export default function Button({onClick, children, disabled, styles}: ButtonProps) {
  return (
    <button onClick={() => onClick} disabled={disabled} className={'flex border-none m-auto items-center rounded-full p-3 cursor-pointer ' + styles}>
      {children}
    </button>
  )
}
