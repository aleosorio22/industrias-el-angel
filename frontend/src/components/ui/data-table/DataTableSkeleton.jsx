export default function DataTableSkeleton({ columns = 5, rows = 5 }) {
    return (
      <div className="bg-white rounded-lg shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr className="bg-accent/10">
                {Array.from({ length: columns }).map((_, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider"
                  >
                    <div className="h-4 bg-accent/30 rounded animate-pulse w-20"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-white">
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {Array.from({ length: columns }).map((_, colIndex) => (
                    <td key={`${rowIndex}-${colIndex}`} className="px-6 py-4 whitespace-nowrap">
                      <div
                        className="h-4 bg-accent/20 rounded animate-pulse"
                        style={{
                          width: `${Math.floor(Math.random() * 50) + 50}%`,
                          animationDelay: `${(rowIndex * columns + colIndex) * 0.05}s`,
                        }}
                      ></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
  
  