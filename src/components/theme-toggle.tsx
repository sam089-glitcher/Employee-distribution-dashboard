'use client'

import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
    )
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-5 w-5" />
      case 'dark':
        return <Moon className="h-5 w-5" />
      case 'system':
        return <Monitor className="h-5 w-5" />
      default:
        return <Monitor className="h-5 w-5" />
    }
  }

  return (
    <div className="relative group">
      <button
        className="w-10 h-10 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                   shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center
                   text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
        title="Toggle theme"
      >
        {getIcon()}
      </button>
      
      <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                      rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                      transition-all duration-200 z-50">
        <div className="p-1">
          <button
            onClick={() => setTheme('light')}
            className={`w-full flex items-center px-3 py-2 rounded-md text-sm transition-colors
                       ${theme === 'light' 
                         ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100' 
                         : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            <Sun className="h-4 w-4 mr-2" />
            Light
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`w-full flex items-center px-3 py-2 rounded-md text-sm transition-colors
                       ${theme === 'dark' 
                         ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100' 
                         : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            <Moon className="h-4 w-4 mr-2" />
            Dark
          </button>
          <button
            onClick={() => setTheme('system')}
            className={`w-full flex items-center px-3 py-2 rounded-md text-sm transition-colors
                       ${theme === 'system' 
                         ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100' 
                         : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            <Monitor className="h-4 w-4 mr-2" />
            System
          </button>
        </div>
      </div>
    </div>
  )
}
