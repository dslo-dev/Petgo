import {
  PawPrint,
  Map as MapIcon,
  Users,
  Megaphone,
  Bell,
  CreditCard,
  User,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { href: '/mascotas', label: 'Mascotas', icon: PawPrint },
  { href: '/mapa', label: 'Mapa', icon: MapIcon },
  { href: '/familia', label: 'Familia', icon: Users },
  { href: '/reportes', label: 'Reportes', icon: Megaphone },
  { href: '/alertas', label: 'Alertas', icon: Bell },
  { href: '/membresia', label: 'Membresía', icon: CreditCard },
  { href: '/perfil', label: 'Perfil', icon: User },
]
