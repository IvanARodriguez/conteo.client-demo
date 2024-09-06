import styled from '@emotion/styled'
import { Box, Button, ButtonGroup } from '@mui/material'

const SquaredBox = styled.span`
  background: inherit;
  display: inline-flex;
  height: 44px;
  width: 44px;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
`

const CustomSquaredButton = styled(Button)`
  background: inherit;
  height: 44px;
  border-radius: 3px !important;
  width: 44px;
  color: inherit;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`
type CounterProps = {
  numberValue: number
  onIncrement?: () => void
  onDecrement?: () => void
}
function Counter(props: CounterProps) {
  const { numberValue, onIncrement, onDecrement } = props
  const handleIncrement = () => {
    if (!onIncrement) return
    onIncrement()
  }
  const handleDecrement = () => {
    if (!onDecrement) return
    onDecrement()
  }
  return (
    <ButtonGroup
      sx={{
        gap: '.3rem',
        '& .MuiButtonGroup-firstButton': {
          border: 'none',
          borderRadius: '3px',
        },
      }}
      variant="contained"
      aria-label=" primary button group">
      <CustomSquaredButton onClick={handleDecrement}>-</CustomSquaredButton>
      <SquaredBox>{numberValue}</SquaredBox>
      <CustomSquaredButton onClick={handleIncrement}>+</CustomSquaredButton>
    </ButtonGroup>
  )
}

export default Counter
