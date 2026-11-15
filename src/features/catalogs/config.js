import { catalogApi } from './api'

// Describes each catalog so a single generic screen can manage both.
export const CATALOGS = {
  platforms: {
    key: ['platforms'],
    api: catalogApi('platform'),
    title: 'Plataformas',
    singular: 'plataforma',
    nameField: 'platformName',
    fields: [
      { name: 'platformName', label: 'Nombre', required: true, placeholder: 'PlayStation 5' },
      { name: 'platformCompany', label: 'Compañía', placeholder: 'Sony' },
      { name: 'platformYear', label: 'Año', placeholder: '2020', inputMode: 'numeric' },
    ],
  },
  stores: {
    key: ['digital-platforms'],
    api: catalogApi('digital-platform'),
    title: 'Tiendas digitales',
    singular: 'tienda',
    nameField: 'digitalPlatformName',
    fields: [
      { name: 'digitalPlatformName', label: 'Nombre', required: true, placeholder: 'Steam' },
      { name: 'digitalPlatformCompany', label: 'Compañía', placeholder: 'Valve' },
    ],
  },
}
