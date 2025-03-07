import { CollectionConfig } from 'payload'

export const Boroughs: CollectionConfig = {
  slug: 'boroughs',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version of the name (e.g., "manhattan")',
      },
    },
    {
        name: 'neighborhoods',
        type: 'relationship',
        relationTo: 'neighborhoods',
        hasMany: true,
    }
  ],
}
