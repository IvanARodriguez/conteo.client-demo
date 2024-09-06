interface NavLinks {
  dashboard: string
  customer: string
  product: string
  invoice: string
  quote: string
  report: string
  reportSummary: string
  transactions: string
  pending: string
}

interface ButtonActions {
  create: string
  delete: string
  edit: string
  update: string
  cancel: string
  confirm: string
  annulate: string
  continue: string
}

interface ProductPage {
  title: string
  name: string
  price: string
  details: string
  createDialogTitle: string
}
interface CustomerPage {
  title: string
  customer: {
    name: string
    rnc: string
    address: string
    phone: string
  }
  createDialogTitle: string
}
interface InvoicePage {
  title: string
  invoice: {
    invoiceNumber: string
    customerName: string
    salesman: string
    date: string
    amount: string
    expirationDate: string
    status: string
    subtotal: string
    taxes: string
    creationDate: string
    transactionCompleted?: string
  }
  createDialogTitle: string
}

interface Dashboard {
  title: string
}

interface AccountingPage {
  title: string
}
interface TransactionPage {
  title: string
}
interface PendingPage {
  title: string
}

interface DictionaryEntry {
  navLinks: NavLinks
  loadingText: string
  login: string
  username: string
  password: string
  legal: string
  logout: string
  productPage: ProductPage
  customerPage: CustomerPage
  invoicePage: InvoicePage
  accountingPage: AccountingPage
  transactionPage: TransactionPage
  pendingPage: PendingPage
  quotePage: InvoicePage
  dashboard: Dashboard
  buttonAction: ButtonActions
  decision: {
    yes: string
    no: string
  }
  deleteProductWarning: string
  deleteProductQuestion: string
  notFoundMessage: string
}

export const dictionary: Record<string, DictionaryEntry> = {
  es: {
    navLinks: {
      dashboard: 'Portal',
      customer: 'Clientes',
      product: 'Productos',
      invoice: 'Factura',
      quote: 'Cotización',
      report: 'Reporte',
      reportSummary: 'Resumen',
      transactions: 'Transacciones',
      pending: 'Pendientes',
    },
    loadingText: 'Por favor espere, estamos cargando el contenido',
    login: 'Ingresar',
    username: 'Usuario',
    password: 'Contraseña',
    legal: `Hitab Software LLC. Derechos reservados ${new Date().getFullYear()}  \u00A9`,
    logout: 'Salir',

    productPage: {
      title: 'Productos',
      name: 'Nombre',
      price: 'Precio',
      details: 'Detalles',
      createDialogTitle: 'Crear nuevo producto',
    },
    customerPage: {
      title: 'Clientes',
      createDialogTitle: 'Agregar un cliente',
      customer: {
        name: 'Cliente',
        address: 'Dirección',
        rnc: 'RNC',
        phone: 'Teléfono',
      },
    },
    pendingPage: {
      title: 'Facturas Pendientes',
    },
    invoicePage: {
      title: 'Facturación',
      createDialogTitle: 'Crear nueva factura',
      invoice: {
        creationDate: 'Fecha de creación',
        amount: 'Monto',
        customerName: 'Nombre de cliente',
        date: 'Fecha',
        invoiceNumber: 'Numero de Factura',
        expirationDate: 'Fecha de Expiración',
        status: 'Estado de pago',
        subtotal: 'Subtotal',
        taxes: 'Impuestos',
        salesman: 'Vendedor',
        transactionCompleted: 'Transacción Completada',
      },
    },

    quotePage: {
      title: 'Cotización',
      createDialogTitle: 'Crear nueva factura',
      invoice: {
        amount: 'Monto',
        customerName: 'Nombre de cliente',
        date: 'Fecha',
        invoiceNumber: 'Numero de Factura',
        expirationDate: 'Fecha de Expiración',
        status: 'Estado de pago',
        subtotal: 'Subtotal',
        taxes: 'Impuestos',
        creationDate: 'Fecha de creación',
        salesman: 'Vendedor',
      },
    },
    dashboard: {
      title: 'Portal',
    },
    accountingPage: {
      title: 'Contabilidad',
    },
    transactionPage: {
      title: 'Transacción',
    },
    buttonAction: {
      create: 'Crear',
      update: 'Actualizar',
      delete: 'Eliminar',
      edit: 'Editar',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      annulate: 'Anular',
      continue: 'Continuar',
    },
    decision: {
      yes: 'Si',
      no: 'No',
    },
    deleteProductQuestion: 'Esta seguro querer eliminar este producto?',
    deleteProductWarning:
      'Esta acción es permanente, por favor confirme si desea proceder o no.',
    notFoundMessage:
      'La pagina que esta buscando no existe en nuestro sistema.',
  },
}
