"use client"

import { useState, useMemo } from "react"
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from "react-icons/fi"
import DataTableSkeleton from "./DataTableSkeleton"
import EmptyState from "./EmptyState"

export default function DataTable({
  data = [],
  columns = [],
  isLoading = false,
  emptyMessage = "No hay datos disponibles",
  emptyIcon,
  rowKeyField = "id",
  pagination = true,
  initialPageSize = 10,
  pageSizeOptions = [5, 10, 25, 50],
  initialSortField = null,
  initialSortDirection = "asc",
  onRowClick,
  className = "",
  tableClassName = "",
  renderRowActions,
}) {
  // Estado para ordenamiento
  const [sortConfig, setSortConfig] = useState({
    key: initialSortField,
    direction: initialSortDirection,
  })

  // Estado para paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)

  // Manejar ordenamiento
  const handleSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  // Ordenar datos
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data

    return [...data].sort((a, b) => {
      // Obtener los valores a comparar
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      // Manejar valores nulos o indefinidos
      if (aValue == null) return sortConfig.direction === "asc" ? -1 : 1
      if (bValue == null) return sortConfig.direction === "asc" ? 1 : -1

      // Comparar según el tipo de dato
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      // Comparación numérica o de otro tipo
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
      return 0
    })
  }, [data, sortConfig])

  // Calcular datos paginados
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData
    const startIndex = (currentPage - 1) * pageSize
    return sortedData.slice(startIndex, startIndex + pageSize)
  }, [sortedData, currentPage, pageSize, pagination])

  // Calcular total de páginas
  const totalPages = useMemo(() => {
    return Math.ceil(sortedData.length / pageSize)
  }, [sortedData, pageSize])

  // Cambiar de página
  const goToPage = (page) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages))
  }

  // Cambiar tamaño de página
  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value)
    setPageSize(newSize)
    setCurrentPage(1) // Resetear a primera página
  }

  // Renderizar estado de carga
  if (isLoading) {
    return <DataTableSkeleton columns={columns.length} />
  }

  // Renderizar estado vacío
  if (!data.length) {
    return <EmptyState message={emptyMessage} icon={emptyIcon} />
  }

  return (
    <div className={`bg-white rounded-lg shadow-soft overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className={`min-w-full divide-y divide-border ${tableClassName}`}>
          <thead>
            <tr className="bg-accent/10">
              {columns.map((column) => (
                <th
                  key={column.field}
                  className={`px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider ${
                    column.sortable !== false ? "cursor-pointer hover:bg-accent/20" : ""
                  } ${column.className || ""}`}
                  onClick={() => column.sortable !== false && handleSort(column.field)}
                  style={column.width ? { width: column.width } : {}}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable !== false && sortConfig.key === column.field && (
                      <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
              ))}
              {renderRowActions && <th className="px-6 py-3 text-right text-xs font-medium text-text-light uppercase tracking-wider">Acciones</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-white">
            {paginatedData.map((row) => (
              <tr
                key={row[rowKeyField]}
                className={`hover:bg-accent/5 transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column) => (
                  <td
                    key={`${row[rowKeyField]}-${column.field}`}
                    className={`px-6 py-4 whitespace-nowrap text-sm ${column.cellClassName || ""}`}
                  >
                    {column.render ? column.render(row) : row[column.field]}
                  </td>
                ))}
                {renderRowActions && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    {renderRowActions(row)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && data.length > 0 && (
        <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-center border-t border-border">
          <div className="flex items-center mb-4 sm:mb-0">
            <span className="text-sm text-text-light mr-2">Filas por página:</span>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="border border-border rounded-md px-2 py-1 text-sm bg-background"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className="ml-4 text-sm text-text-light">
              {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, sortedData.length)} de {sortedData.length}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="p-1 rounded-md border border-border disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Primera página"
            >
              <FiChevronsLeft className="text-text-light" />
            </button>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1 rounded-md border border-border disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Página anterior"
            >
              <FiChevronLeft className="text-text-light" />
            </button>

            <div className="flex items-center">
              <span className="text-sm text-text-light mx-2">
                Página {currentPage} de {totalPages}
              </span>
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1 rounded-md border border-border disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Página siguiente"
            >
              <FiChevronRight className="text-text-light" />
            </button>
            <button
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1 rounded-md border border-border disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Última página"
            >
              <FiChevronsRight className="text-text-light" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
