import { CollectionConfig } from 'payload'

export const Neighborhoods: CollectionConfig = {
  slug: 'neighborhoods',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'borough'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version of the name (e.g., "upper-east-side")',
      },
    },
    {
      name: 'borough',
      type: 'relationship',
      relationTo: 'boroughs',
      required: true,
      hasMany: false,
    },

    {
        name: 'runningSpots',
        type: 'array',
        fields: [
          {
            name: 'name',
            type: 'text',
            required: true,
          },
          {
            name: 'description',
            type: 'textarea',
          },
          {
            name: 'location',
            type: 'group',
            fields: [
                {
                    name: 'latitude',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'longitude',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'address',
                    type: 'text',
                    required: true,
                }
            ],
          }
        ],
      },
  ],
}
