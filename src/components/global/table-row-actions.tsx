import { Box, Tooltip, IconButton } from '@mui/material'
import { MRT_Row, MRT_TableInstance } from 'material-react-table'
import LayersClearIcon from '@mui/icons-material/LayersClear'
import VisibilityIcon from '@mui/icons-material/Visibility'

type ActionsProps = {
  row: MRT_Row<any>
  table: MRT_TableInstance<any>
  modalAction(): () => void
}

function TableRowActions(props: ActionsProps) {
  function handleDeleteRow(row: MRT_Row<any>) {}
  return (
    <Box sx={{ display: 'flex', gap: '1rem' }}>
      <Tooltip arrow placement="right" title="View">
        <IconButton>
          <VisibilityIcon />
        </IconButton>
      </Tooltip>
      <Tooltip arrow placement="right" title="Delete">
        <span>
          <IconButton onClick={() => handleDeleteRow(props.row)}>
            <LayersClearIcon />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  )
}

export default TableRowActions
