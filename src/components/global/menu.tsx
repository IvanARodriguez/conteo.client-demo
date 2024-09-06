import { SvgIconComponent } from '@mui/icons-material'
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Drawer,
  useTheme,
  Collapse,
  Tooltip,
  MenuItem,
  Menu as CategoryMenu,
  Divider,
} from '@mui/material'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import StorefrontIcon from '@mui/icons-material/Storefront'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import { Link, useNavigate } from 'react-router-dom'
import Invoice from '@mui/icons-material/DescriptionOutlined'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { useMemo, useState } from 'react'
import { NAV_WIDTH } from '../../api/constants'
import ConteoLogo from '../../assets/conteo-logo'
import { dictionary } from '../../utils/dictionary'
import * as store from '../../store'
import AccountMenu from './account-menu'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import MultipleStopIcon from '@mui/icons-material/MultipleStop'

import ThemeModeSwitch from './theme-mode-switch'

type Sections =
  | 'product'
  | 'customer'
  | 'invoice'
  | 'accounting'
  | 'transaction'
  | undefined

type NavItems = {
  section?: Sections
  title: string
  icon?: SvgIconComponent
  href: string
}
function Menu() {
  const state = store.useState()
  const actions = store.useActions()
  const useNarrowedMenu = state.application.useNarrowedMenu
  const [activeNav, setActiveNav] = useState<string>(
    state.application.currentPage,
  )

  const links = dictionary[state.application.language]?.navLinks
  const appDictionary = dictionary[state.application.language]
  const theme = useTheme()
  const blockedLinks = ['accounting']
  const navSections: {
    icon: SvgIconComponent
    sectionName: string
    type: Sections
    selected: boolean
  }[] = [
    {
      icon: Invoice,
      sectionName: appDictionary.invoicePage.title,
      selected: state.application.currentSection === 'invoice',
      type: 'invoice',
    },
    {
      icon: PointOfSaleIcon,
      sectionName: appDictionary.accountingPage.title,
      selected: state.application.currentSection === 'accounting',
      type: 'accounting',
    },
  ]
  const navItems: NavItems[] = useMemo<NavItems[]>(
    () => [
      {
        section: 'invoice',
        title: links.invoice,
        href: '/invoice',
      },
      {
        section: 'invoice',
        title: links.quote,
        href: '/invoice/quote',
      },
      {
        section: 'invoice',
        title: links.pending,
        href: '/invoice/pending',
      },
      {
        section: 'invoice',
        title: 'Expiradas',
        href: '/invoice/expired',
      },

      {
        section: 'accounting',
        title: links.reportSummary,
        href: '/accounting/report-summary',
      },
      {
        section: 'accounting',
        title: links.report,
        href: '/accounting/report',
      },
    ],
    [],
  )

  const handleDrawerToggle = () => {
    if (state.application.menuOpen) actions.application.setMenuOpen()
  }

  const canUseNarrowedMenu = state.application.menuOpen ? false : true

  const [anchorElArray, setAnchorElArray] = useState<Array<null | HTMLElement>>(
    new Array(navSections.length).fill(null),
  )

  const handleClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
    const newAnchorElArray = [...anchorElArray]
    newAnchorElArray[index] = event.currentTarget
    setAnchorElArray(newAnchorElArray)
  }

  const handleClose = () => {
    setAnchorElArray(new Array(navSections.length).fill(null))
  }
  const drawerWidth = useNarrowedMenu ? 55 : '240px'
  const drawer = (
    <List
      sx={{
        overflow: 'hidden',
      }}>
      <Link to={'/'}>
        <Tooltip title="Portal" placement="right">
          <ListItemButton
            LinkComponent={Link}
            onClick={() => {
              handleDrawerToggle()
              setActiveNav('dashboard')
            }}
            selected={state.application.currentSection === 'dashboard'}>
            <ListItemIcon>
              <SpaceDashboardIcon />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{ fontSize: '14px' }}
              primary="Portal"
            />
          </ListItemButton>
        </Tooltip>
      </Link>
      <Link to={'/product'}>
        <Tooltip title="Productos" placement="right">
          <ListItemButton
            onClick={() => {
              handleDrawerToggle()
              setActiveNav('product')
            }}
            selected={state.application.currentSection === 'product'}>
            <ListItemIcon>
              <WaterDropIcon />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{ fontSize: '14px' }}
              primary="Productos"
            />
          </ListItemButton>
        </Tooltip>
      </Link>
      <Tooltip title="Clientes" placement="right">
        <Link to={'/customer'}>
          <ListItemButton
            onClick={() => {
              handleDrawerToggle()
              setActiveNav('customer')
            }}
            selected={state.application.currentSection === 'customer'}>
            <ListItemIcon>
              <StorefrontIcon />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{ fontSize: '14px' }}
              primary="Clientes"
            />
          </ListItemButton>
        </Link>
      </Tooltip>
      <Link to={'/transaction'}>
        <Tooltip title="Transacciones" placement="right">
          <ListItemButton
            onClick={() => {
              handleDrawerToggle()
              setActiveNav('transaction')
            }}
            selected={state.application.currentSection === 'transaction'}>
            <ListItemIcon>
              <MultipleStopIcon />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{ fontSize: '14px' }}
              primary="Transacciones"
            />
          </ListItemButton>
        </Tooltip>
      </Link>
      {useNarrowedMenu && canUseNarrowedMenu
        ? navSections.map((section, i) => (
            <Box
              sx={{
                display:
                  state.profile.role === 'EMPLOYEE' &&
                  section.type &&
                  blockedLinks.includes(section.type)
                    ? 'none'
                    : 'initial',
              }}
              key={section.sectionName + i}>
              <Tooltip title={section.sectionName} placement="right">
                <ListItemButton
                  id={section.sectionName + i}
                  aria-controls={
                    anchorElArray[i] ? section.sectionName : undefined
                  }
                  aria-haspopup="true"
                  aria-expanded={anchorElArray[i] ? 'true' : undefined}
                  onClick={e => {
                    handleDrawerToggle()
                    setActiveNav(section.sectionName)
                    handleClick(e, i) // Pass index to handleClick
                  }}>
                  <ListItemIcon>
                    <section.icon />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{ fontSize: '14px' }}
                    primary="Clientes"
                  />
                </ListItemButton>
              </Tooltip>
              <CategoryMenu
                id={section.sectionName}
                aria-labelledby={section.sectionName + i}
                anchorEl={anchorElArray[i]} // Use anchorElArray[i] for this section
                open={Boolean(anchorElArray[i])} // Check if anchorElArray[i] is not null
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}>
                {navItems
                  .filter(subMenuItem => subMenuItem.section === section.type)
                  .map((subMenuItem, i) => (
                    <Link
                      key={subMenuItem.title + i}
                      to={subMenuItem.href}
                      onClick={() => {
                        handleDrawerToggle()
                        setActiveNav(section.sectionName)
                      }}>
                      <MenuItem onClick={handleClose}>
                        {subMenuItem.title}
                      </MenuItem>
                    </Link>
                  ))}
              </CategoryMenu>
            </Box>
          ))
        : navSections.map(section => (
            <List
              sx={{
                display:
                  state.profile.role === 'EMPLOYEE' &&
                  section.type &&
                  blockedLinks.includes(section.type)
                    ? 'none'
                    : 'initial',
              }}
              key={section.sectionName}>
              <ListItemButton
                selected={section.selected}
                onClick={() => {
                  setActiveNav(section.sectionName)
                }}>
                <ListItemIcon>
                  <section.icon />
                </ListItemIcon>
                <ListItemText primary={section.sectionName} />
                {activeNav === section.sectionName ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )}
              </ListItemButton>
              <Collapse
                in={activeNav === section.sectionName}
                timeout="auto"
                unmountOnExit>
                <List component="div" disablePadding>
                  {navItems
                    .filter(subMenuItem => subMenuItem.section === section.type)
                    .map((subMenuItem, i) => (
                      <Link
                        key={subMenuItem.title + i}
                        to={subMenuItem.href}
                        onClick={() => {
                          handleDrawerToggle()
                          setActiveNav(section.sectionName)
                        }}>
                        <ListItemButton
                          sx={{
                            borderRight:
                              state.application.currentPage ===
                              subMenuItem.title
                                ? `3px solid ${theme.palette.primary.main}`
                                : '',
                            pl: 5,
                          }}>
                          <ListItemText primary={subMenuItem.title} />
                        </ListItemButton>
                      </Link>
                    ))}
                </List>
              </Collapse>
            </List>
          ))}
      <ListItem
        sx={{
          display: 'grid',
          gridTemplateColumns: useNarrowedMenu ? '1fr' : '1fr auto',
        }}
        disablePadding>
        <AccountMenu />
        <ThemeModeSwitch />
      </ListItem>
    </List>
  )
  return (
    <Box component="nav" aria-label="main-navigation">
      <Drawer
        PaperProps={{
          sx: {
            display: { sm: 'none' },
            zIndex: 999,
          },
        }}
        open={state.application.menuOpen}
        onClose={handleDrawerToggle}
        elevation={2}>
        <Box
          sx={{
            display: 'flex',
            p: '1rem',
            gap: '1rem',
            placeItems: 'center',
          }}>
          <ConteoLogo height={50} />
          <Typography variant="h5">Conteo</Typography>
        </Box>
        <Divider />
        {drawer}
      </Drawer>
      <Drawer
        open={useNarrowedMenu}
        sx={{
          height: '100%',
          maxWidth: drawerWidth,
          transition: 'max-width 0.2s ease-in-out',
        }}
        PaperProps={{
          sx: {
            position: 'relative',
            userSelect: 'none',
            minWidth: '4rem',
            display: { xs: 'none', sm: 'flex' },
            // overflow: 'hidden',
          },
        }}
        variant="permanent">
        {drawer}
      </Drawer>
    </Box>
  )
}

export default Menu
