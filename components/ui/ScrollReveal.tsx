'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface ScrollRevealProps {
  children: ReactNode
  forceHidden?: boolean
  variants?: {
    hidden: any
    visible: any
  }
}

export default function ScrollReveal({ children, forceHidden = false, variants }: ScrollRevealProps) {
  const defaultVariants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
  }

  return (
    <motion.div
      initial="hidden"
      whileInView={forceHidden ? 'hidden' : 'visible'}
      animate={forceHidden ? 'hidden' : undefined}
      variants={variants || defaultVariants}
      viewport={{ once: false, margin: '-10% 0px -10% 0px' }}
      transition={{
        type: 'spring',
        stiffness: 45,
        damping: 15,
        duration: 0.95, // 950ms average duration matching specs
      }}
    >
      {children}
    </motion.div>
  )
}
