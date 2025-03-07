import { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'username',
    defaultColumns: ['username', 'email'],
  },
  access: {
    read: () => true,
  },
  fields: [
    // These fields are available by default with auth: true
    // email and password are already included
    {
      name: 'username',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'profilePicture',
      type: 'upload',
      label: 'Profile Picture',
      relationTo: 'media',
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Bio',
    },
    {
      name: 'favoriteRunClubs',
      type: 'relationship',
      label: 'Favorite Run Clubs',
      relationTo: 'run-clubs',
      hasMany: true,
    },
    {
      name: 'submittedContent',
      type: 'group',
      label: 'Submitted Content',
      fields: [
        {
          name: 'note',
          type: 'text',
          label: 'Note',
          admin: {
            readOnly: true,
            description: 'This section will automatically track content submitted by this user',
          },
        },
        // You can add specific relationship fields here later when you create other collections
        // that users can submit (e.g., events, reviews, etc.)
      ],
    },
    {
      name: 'socialMedia',
      type: 'group',
      label: 'Social Media Links',
      fields: [
        {
          name: 'instagram',
          type: 'text',
          label: 'Instagram',
        },
        {
          name: 'facebook',
          type: 'text',
          label: 'Facebook',
        },
        {
          name: 'twitter',
          type: 'text',
          label: 'Twitter',
        },
        {
          name: 'tiktok',
          type: 'text',
          label: 'TikTok',
        },
        {
          name: 'strava',
          type: 'text',
          label: 'Strava',
        },
      ],
    },
  ],
}
