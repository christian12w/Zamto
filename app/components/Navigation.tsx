'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { 
      name: 'Inventory', 
      href: '/vehicles',
      submenu: [
        { name: 'All Vehicles', href: '/vehicles' },
        { name: 'Vehicles For Sale', href: '/vehicles/sale' },
        { name: 'Vehicles For Hire', href: '/vehicles/hire' },
      ]
    },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 w-full bg-[#003366] z-50 shadow-xl border-b-2 border-[#FF6B35]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="Zamto Africa Logo" 
                className="h-10 w-auto border border-white rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-white text-lg font-bold uppercase tracking-tight">
                ZAMTO AFRICA
              </span>
              <span className="text-[#FF6B35] text-xs font-medium">
                Japanese Imported Vehicles
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => {
              if (item.submenu) {
                return (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <Link
                      href={item.href}
                      className="text-white hover:text-[#FF6B35] transition-colors font-medium flex items-center gap-1"
                    >
                      {item.name}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Link>
                    
                    {/* Dropdown Menu */}
                    {openDropdown === item.name && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                        <div className="py-1">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className="block px-4 py-2 text-[#003366] hover:bg-[#FF6B35] hover:text-white transition-colors"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              }
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-white hover:text-[#FF6B35] transition-colors font-medium"
                >
                  {item.name}
                </Link>
              )
            })}
            
            {/* CTA Button */}
            <Link
              href="/contact"
              className="bg-[#FF6B35] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#e05a2a] transition-colors"
            >
              Get Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-[#003366] border-t border-[#FF6B35]">
          <div className="px-4 pt-4 pb-6 space-y-3">
            {navItems.map((item) => {
              if (item.submenu) {
                return (
                  <div key={item.name} className="space-y-2">
                    <Link
                      href={item.href}
                      onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                      className="flex items-center justify-between text-white hover:text-[#FF6B35] py-2"
                    >
                      {item.name}
                      <svg 
                        className={`w-5 h-5 transition-transform ${openDropdown === item.name ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Link>
                    {openDropdown === item.name && (
                      <div className="pl-4 space-y-2">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="block text-gray-300 hover:text-[#FF6B35] py-2"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-white hover:text-[#FF6B35] py-2"
                >
                  {item.name}
                </Link>
              )
            })}
            
            {/* Mobile CTA */}
            <Link
              href="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="block mt-4 bg-[#FF6B35] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#e05a2a] transition-colors text-center"
            >
              Get Quote
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
