export default function DashboardSection({ title, subtitle, children, className = "" }) {
    return (
      <div className={`mb-10 ${className}`}>
        {(title || subtitle) && (
          <div className="mb-5 sm:mb-6">
            {title && <h2 className="text-xl sm:text-2xl md:text-2xl font-display font-semibold text-text">{title}</h2>}
            {subtitle && <p className="text-text-light text-sm sm:text-base mt-2">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    )
  }
  
  