'use client'

import { ReactNode, useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface MagneticButtonProps {
  children: ReactNode
  variant?: 'primary' | 'outline' | 'glass'
  size?: 'small' | 'medium' | 'large'
  icon?: ReactNode
  fullWidth?: boolean
  onClick?: () => void
}

export default function MagneticButton({
  children,
  variant = 'primary',
  size = 'medium',
  icon,
  fullWidth = false,
  onClick,
}: MagneticButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return

    const rect = buttonRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    setPosition({ x: x * 0.3, y: y * 0.3 })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary-500 to-accent-600 text-white hover:shadow-glow',
    outline: 'border-2 border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-dark-950',
    glass: 'glass-effect text-white border border-white/20 hover:border-primary-400',
  }

  const sizeClasses = {
    small: 'px-4 py-2 text-sm min-h-[40px]',
    medium: 'px-6 py-3 text-base min-h-[44px]',
    large: 'px-8 py-4 text-lg min-h-[48px]',
  }

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{
        x: position.x,
        y: position.y,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        font-semibold rounded-full
        transition-all duration-300
        flex items-center justify-center gap-2
        cursor-pointer
        relative overflow-hidden
        group
      `}
    >
      <span className="relative z-10 flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {children}
      </span>
      
      {/* Ripple effect on hover */}
      <span className="absolute inset-0 bg-white/20 transform scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
    </motion.button>
  )
}
