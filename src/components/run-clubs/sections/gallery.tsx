import { Card } from '@/components/ui/card'
import { RunClub } from '@/payload-types'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

interface ClubGalleryProps {
  gallery: RunClub['gallery']
}

export function ClubGallery({ gallery }: ClubGalleryProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      className="grid grid-cols-2 md:grid-cols-3 gap-4"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 },
          }}
        >
          <Card className="group overflow-hidden">
            <motion.div
              className="aspect-square relative bg-muted rounded-lg overflow-hidden"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {/* Loading state animation */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: 'linear',
                }}
              />
            </motion.div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
