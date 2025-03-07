import { CollectionConfig } from 'payload'

export const RunClubs: CollectionConfig = {
  slug: 'run-clubs',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'borough', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Club Name',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      required: true,
    },
    {
      name: 'borough',
      type: 'relationship',
      relationTo: 'boroughs',
      required: true,
      hasMany: false,
    },
    {
      name: 'neighborhoods',
      type: 'relationship',
      relationTo: 'neighborhoods',
      required: true,
      hasMany: true,
      filterOptions: ({ data }) => {
        if (data?.borough) {
          return {
            borough: { equals: data.borough }
          }
        }
        return false;
      },
    },
    {
      name: 'meetingLocations',
      type: 'array',
      label: 'Meeting Locations',
      admin: {
        description: 'Add meeting locations first before creating schedule entries',
      },
      fields: [
        {
          name: 'locationName',
          type: 'text',
          label: 'Location Name',
          required: true,
        },
        {
          name: 'address',
          type: 'text',
          label: 'Address',
          required: true,
        },
        {
          name: 'coordinates',
          type: 'group',
          label: 'Coordinates',
          fields: [
            {
              name: 'latitude',
              type: 'text',
              label: 'Latitude',
            },
            {
              name: 'longitude',
              type: 'text',
              label: 'Longitude',
            },
          ],
        },
      ],
    },
    {
      name: 'schedule',
      type: 'array',
      label: 'Schedule',
      admin: {
        condition: (data) => data?.meetingLocations?.length > 0,
        description: 'Add meeting locations before adding schedule entries',
      },
      fields: [
        {
          name: 'day',
          type: 'select',
          label: 'Day',
          options: [
            { label: 'Monday', value: 'monday' },
            { label: 'Tuesday', value: 'tuesday' },
            { label: 'Wednesday', value: 'wednesday' },
            { label: 'Thursday', value: 'thursday' },
            { label: 'Friday', value: 'friday' },
            { label: 'Saturday', value: 'saturday' },
            { label: 'Sunday', value: 'sunday' },
          ],
          required: true,
        },
        {
          name: 'time',
          type: 'text',
          label: 'Time',
          required: true,
        },
        {
          name: 'runType',
          type: 'select',
          label: 'Run Type',
          options: [
            { label: 'Easy Run', value: 'easy' },
            { label: 'Long Run', value: 'long' },
            { label: 'Workout', value: 'workout' },
            { label: 'Recovery', value: 'recovery' },
            { label: 'Shakeout', value: 'shakeout' },
            { label: 'Race Pace', value: 'race-pace' },
            { label: 'Hills', value: 'hills' },
            { label: 'Track', value: 'track' },
            { label: 'Social Run', value: 'social' },
          ],
          required: true,
        },
        {
          name: 'distance',
          type: 'group',
          label: 'Estimated Distance',
          fields: [
            {
              name: 'min',
              type: 'number',
              label: 'Minimum (miles)',
              min: 0,
              max: 100,
            },
            {
              name: 'max',
              type: 'number',
              label: 'Maximum (miles)',
              min: 0,
              max: 100,
            },
          ],
        },
        {
          name: 'pace',
          type: 'group',
          label: 'Estimated Pace',
          fields: [
            {
              name: 'min',
              type: 'text',
              label: 'Minimum (min/mile)',
              admin: {
                description: 'Format: MM:SS (e.g., 08:30)',
              },
            },
            {
              name: 'max',
              type: 'text',
              label: 'Maximum (min/mile)',
              admin: {
                description: 'Format: MM:SS (e.g., 09:30)',
              },
            },
          ],
        },
        {
          name: 'details',
          type: 'textarea',
          label: 'Additional Details',
        },
        {
          name: 'requiresRSVP',
          type: 'checkbox',
          label: 'Requires RSVP',
        },
        {
          name: 'maxParticipants',
          type: 'number',
          label: 'Maximum Participants',
          admin: {
            condition: (_, siblingData) => siblingData?.requiresRSVP,
          },
        },
      ],
    },
    {
      name: 'contactInformation',
      type: 'group',
      label: 'Contact Information',
      fields: [
        {
          name: 'email',
          type: 'email',
          label: 'Email',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Phone Number',
        },
      ],
    },
    {
      name: 'website',
      type: 'text',
      label: 'Website URL',
    },
    {
      name: 'membershipRequirements',
      type: 'text',
      label: 'Membership Requirements',
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
    {
      name: 'logo',
      type: 'upload',
      label: 'Club Logo',
      relationTo: 'media',
    },
  ],
}
