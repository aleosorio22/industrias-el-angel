export default function ActivityItem({ title, time, description, icon: Icon, type }) {
    const getTypeStyles = () => {
      switch (type) {
        case "sale":
          return "bg-accent text-primary"
        case "alert":
          return "bg-error/10 text-error"
        case "info":
          return "bg-info/10 text-info"
        default:
          return "bg-accent text-primary"
      }
    }
  
    return (
      <div className="flex items-start space-x-3 py-3.5 border-b border-border last:border-0">
        <div className={`p-2.5 rounded-lg shrink-0 ${getTypeStyles()}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <p className="font-medium text-text text-sm">{title}</p>
            <span className="text-text-light text-xs whitespace-nowrap ml-2">{time}</span>
          </div>
          {description && <p className="text-text-light text-xs mt-1.5">{description}</p>}
        </div>
      </div>
    )
  }
  
  