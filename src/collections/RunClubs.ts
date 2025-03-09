import { CollectionConfig } from 'payload'
import slugify from 'slugify'
import { geocodeAddress } from '../lib/utils/geocoding'

export const RunClubs: CollectionConfig = {
  slug: 'run-clubs',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'borough', 'updatedAt'],
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.name) {
          data.slug = slugify(data.name, {
            lower: true,
            strict: true,
            remove: /[*+~.()'"!:@]/g,
          })
        }
        return data
      },
    ],
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
      name: 'slug',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Auto-generated from name',
      },
      hooks: {
        beforeValidate: [
          ({ siblingData }) => {
            if (siblingData.name) {
              return slugify(siblingData.name, {
                lower: true,
                strict: true,
                remove: /[*+~.()'"!:@]/g,
              })
            }
            return undefined
          },
        ],
      },
      unique: true,
      index: true,
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
      name: 'primaryNeighborhood',
      type: 'relationship',
      relationTo: 'neighborhoods',
      required: false,
      hasMany: false,
      filterOptions: ({ data }) => {
        if (data?.borough) {
          return {
            borough: { equals: data.borough },
          }
        }
        return false
      },
    },

    {
      name: 'schedule',
      type: 'array',
      hooks: {
        beforeChange: [
          async ({ value }) => {
            if (!Array.isArray(value)) return value

            const updatedSchedule = await Promise.all(
              value.map(async (item) => {
                if (!item.meetingLocation?.address) return item

                // Only geocode if coordinates are missing
                if (!item.meetingLocation.coordinates?.latitude) {
                  const result = await geocodeAddress(item.meetingLocation.address)
                  if (result) {
                    return {
                      ...item,
                      meetingLocation: {
                        ...item.meetingLocation,
                        coordinates: {
                          latitude: result.lat,
                          longitude: result.lon,
                        },
                      },
                    }
                  }
                }
                return item
              }),
            )
            return updatedSchedule
          },
        ],
      },
      label: 'Schedule',
      access: {
        read: () => true,
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
          name: 'meetingLocation',
          type: 'group',
          label: 'Meeting Location',
          fields: [
            {
              name: 'name',
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
              name: 'neighborhood',
              type: 'relationship',
              relationTo: 'neighborhoods',
              required: true,
              hasMany: false,
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
        {
          name: 'route',
          type: 'group',
          label: 'Run Route',
          admin: {
            description: 'Optional route information for this run',
          },
          fields: [
            {
              name: 'name',
              type: 'text',
              label: 'Route Name',
            },
            {
              name: 'distance',
              type: 'number',
              label: 'Distance (miles)',
            },
            {
              name: 'mapProvider',
              type: 'select',
              label: 'Map Provider',
              options: [
                { label: 'On The Go Map', value: 'onthego' },
                { label: 'Strava', value: 'strava' },
                { label: 'MapMyRun', value: 'mapmyrun' },
              ],
            },
            {
              name: 'mapUrl',
              type: 'text',
              label: 'Map URL',
              admin: {
                description: 'Full URL to the route map',
              },
            },
          ],
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
    {
      name: 'brandColor',
      type: 'text',
      label: 'Brand Color',
      admin: {
        description: 'Hex color code (e.g., #FF5733)',
      },
      validate: (val: string | null | undefined) => {
        if (!val) return true // Allow empty
        return /^#[0-9A-F]{6}$/i.test(val) || 'Must be a valid hex color (e.g., #FF5733)'
      },
    },
    {
      name: 'clubRecords',
      type: 'array',
      label: 'Club Records',
      fields: [
        {
          name: 'athleteName',
          type: 'text',
          required: true,
        },
        {
          name: 'category',
          type: 'select',
          required: true,
          options: [
            { label: 'Men', value: 'men' },
            { label: 'Women', value: 'women' },
            { label: 'Non-Binary', value: 'non-binary' },
          ],
        },
        {
          name: 'event',
          type: 'select',
          required: true,
          options: [
            { label: 'Mile', value: 'mile' },
            { label: '5K', value: '5k' },
            { label: '10K', value: '10k' },
            { label: 'Half Marathon', value: 'half' },
            { label: 'Marathon', value: 'marathon' },
          ],
        },
        {
          name: 'time',
          type: 'text',
          required: true,
          admin: {
            description: 'Format: HH:MM:SS',
          },
        },
        {
          name: 'date',
          type: 'date',
        },
        {
          name: 'eventName',
          type: 'text',
        },
      ],
      admin: {
        initCollapsed: true,
        description: 'Records are maintained separately for men, women, and non-binary athletes',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Photo Gallery',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Caption',
        },
        {
          name: 'featured',
          type: 'checkbox',
          label: 'Feature on profile',
        },
        {
          name: 'category',
          type: 'select',
          options: [
            { label: 'Group Runs', value: 'runs' },
            { label: 'Social Events', value: 'social' },
            { label: 'Race Day', value: 'race' },
            { label: 'Community', value: 'community' },
          ],
        },
      ],
    },

    {
      name: 'clubCulture',
      type: 'group',
      label: 'Club Culture',
      fields: [
        {
          name: 'postRunTraditions',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Coffee', value: 'coffee' },
            { label: 'Breakfast', value: 'breakfast' },
            { label: 'Group Stretching', value: 'stretch' },
            { label: 'Social Hour', value: 'social' },
          ],
        },
        {
          name: 'atmosphere',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'No Drop Policy', value: 'no-drop' },
            { label: 'Pace Groups', value: 'pace-groups' },
            { label: 'All Levels Welcome', value: 'all-levels' },
            { label: 'Beginner Friendly', value: 'beginner' },
            { label: 'Photography Encouraged', value: 'photos' },
            { label: 'Dog Friendly', value: 'dog-friendly' },
            { label: 'Stroller Friendly', value: 'stroller' },
          ],
        },
        {
          name: 'customTraditions',
          type: 'array',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },

    {
      name: 'partnerBusinesses',
      type: 'array',
      label: 'Partners',
      fields: [
        {
          name: 'businessName',
          type: 'text',
          required: true,
        },
        {
          name: 'businessURL',
          label: 'Business Website',
          type: 'text',
          admin: {
            description: 'URL to the business website',
          },
        },
        {
          name: 'internalURL',
          label: 'Internal Website',
          type: 'text',
          admin: {
            description: 'URL to the partnerships on your website',
          },
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'Running Store', value: 'running-store' },
            { label: 'Brand', value: 'brand' },
            { label: 'Coffee Shop', value: 'coffee' },
            { label: 'Physical Therapy', value: 'pt' },
            { label: 'Restaurant', value: 'restaurant' },
            { label: 'Gym', value: 'gym' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'perks',
          type: 'text',
          label: 'Member Perks',
        },
        {
          name: 'location',
          type: 'group',
          fields: [
            {
              name: 'address',
              type: 'text',
            },
            {
              name: 'neighborhood',
              type: 'relationship',
              relationTo: 'neighborhoods',
              hasMany: false,
            },
          ],
        },
      ],
    },

    {
      name: 'routes',
      type: 'array',
      label: 'Common Routes',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'distance',
          type: 'number',
          label: 'Distance (miles)',
          min: 0,
          max: 100,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'stravaLink',
          type: 'text',
          label: 'Strava Route Link',
        },
        {
          name: 'difficulty',
          type: 'select',
          options: [
            { label: 'Easy', value: 'easy' },
            { label: 'Moderate', value: 'moderate' },
            { label: 'Challenging', value: 'hard' },
          ],
        },
        {
          name: 'terrain',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Road', value: 'road' },
            { label: 'Trail', value: 'trail' },
            { label: 'Track', value: 'track' },
            { label: 'Hills', value: 'hills' },
          ],
        },
        {
          name: 'mapImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
}
