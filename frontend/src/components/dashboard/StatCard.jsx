export default function StatCard({ label, value, change, up, icon: Icon }) {
    return (
      <div className="bg-background rounded-lg shadow-soft hover:shadow-medium transition-all duration-300 p-5 sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-text-light text-xs sm:text-sm font-medium">{label}</p>
            <p className="text-text text-2xl sm:text-3xl font-display font-bold mt-2">{value}</p>
            <p className={`text-xs sm:text-sm mt-3 flex items-center font-medium ${up ? "text-primary" : "text-error"}`}>
              <span className="mr-1 text-lg">{up ? "↑" : "↓"}</span>
              {change}
            </p>
          </div>
          {Icon && (
            <div className="p-3 sm:p-4 bg-accent rounded-lg">
              <Icon className="text-primary w-6 h-6 sm:w-7 sm:h-7" />
            </div>
          )}
        </div>
      </div>
    )
  }
  
  