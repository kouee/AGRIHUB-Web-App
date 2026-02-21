"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '#problem', label: 'Problem' },
  { href: '#features', label: 'Features' },
  { href: '#dashboard', label: 'Dashboard' },
  { href: '#team', label: 'Team' },
  { href: '#contact', label: 'Contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      const sections = navItems.map(item => document.getElementById(item.href.substring(1)));
      let currentSection = '';

      sections.forEach(section => {
        if (section) {
          const sectionTop = section.offsetTop - 150; // Add offset
          if (window.scrollY >= sectionTop) {
            currentSection = section.id;
          }
        }
      });
      
      const homeSection = document.getElementById('hero');
      if (homeSection && window.scrollY < homeSection.offsetHeight - 150) {
        currentSection = 'hero';
      }

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavLink = ({ href, label, isMobile = false }: { href: string, label: string, isMobile?: boolean }) => {
    const sectionId = href.substring(1);
    const isActive = activeSection === sectionId || (label === 'Home' && activeSection === 'hero');
    const LinkComponent = isMobile ? SheetClose : 'a';
    
    return (
       <LinkComponent
        href={href}
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          isActive ? "text-primary font-bold" : "text-muted-foreground",
          isMobile && "block w-full text-left p-2 rounded-md hover:bg-muted"
        )}
      >
        {label}
      </LinkComponent>
    )
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b transition-all duration-300",
      isScrolled ? "border-border bg-background/95 backdrop-blur-sm" : "border-transparent bg-transparent"
    )}>
      <div className="container flex h-16 items-center px-4 md:px-6">
        <Link href="#hero" className="mr-6 flex items-center">
          <Image src="/logo.png" alt="SprouT Logo" width={100} height={30} className="object-contain" />
        </Link>
        <nav className="hidden flex-1 items-center justify-center gap-6 md:flex">
          {navItems.map(item => <NavLink key={item.href} {...item} />)}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-4">
          <Button asChild className="hidden md:flex">
            <a href="#dashboard">Get Started</a>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-4 py-6">
                <SheetClose asChild>
                  <Link href="#hero" className="mr-6 flex items-center">
                      <Image src="/logo.png" alt="SprouT Logo" width={100} height={30} className="object-contain" />
                  </Link>
                </SheetClose>
                {navItems.map(item => <NavLink key={item.href} {...item} isMobile={true} />)}
                <SheetClose asChild>
                  <Button asChild className="mt-4">
                      <a href="#dashboard">Get Started</a>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
