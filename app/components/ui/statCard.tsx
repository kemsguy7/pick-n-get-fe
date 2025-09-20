import React from 'react'
import { LucideIcon } from 'lucide-react'

export interface StatCardProps {
  icon: LucideIcon
  iconColor: string
  iconBgColor: string
  title: string
  titleColor: string
  value: string | number
  valueColor: string
  subtitle?: string
  subtitleColor?: string
  backgroundColor: string
  borderColor?: string
  trend?: {
    value: string
    color: string
    icon?: LucideIcon
  }
}

export default function StatCard({
  icon: Icon,
  iconColor,
  iconBgColor,
  title,
  titleColor,
  value,
  valueColor,
  subtitle,
  subtitleColor = 'text-gray-500',
  backgroundColor,
  borderColor,
  trend
}: StatCardProps) {
  return (
    <div 
      className={`${backgroundColor} ${borderColor ? `border ${borderColor}` : ''} rounded-2xl p-4 lg:p-6 transition-all duration-200 hover:shadow-lg`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-5 h-5 ${iconBgColor} rounded-full flex items-center justify-center p-1`}>
          <Icon className={`w-3 h-3 ${iconColor}`} />
        </div>
        <span className={`${titleColor} text-sm font-inter font-normal`}>{title}</span>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <p className={`text-2xl  font-space-grotesk font-bold ${valueColor}`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {subtitle && (
            <p className={`${subtitleColor} text-sm font-inter font-normal mt-1`}>
              {subtitle}
            </p>
          )}
        </div>
        
        {trend && (
          <div className={`flex items-center gap-1 ${trend.color} text-xs font-inter`}>
            {trend.icon && <trend.icon className="w-3 h-3" />}
            {trend.value}
          </div>
        )}
      </div>
    </div>
  )
}
