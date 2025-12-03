import * as React from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboboxOption {
  value: string
  label: string
}

export interface ComboboxFetchResult {
  data: ComboboxOption[]
  hasMore: boolean
  total?: number
}

export interface ComboboxProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  disabled?: boolean
  className?: string
  fetchOptions?: (params: {
    search: string
    page: number
    pageSize: number
  }) => Promise<ComboboxFetchResult>
  pageSize?: number
}

export function Combobox({
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyText = "No option found.",
  disabled = false,
  className,
  fetchOptions,
  pageSize = 20,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")
  const [options, setOptions] = React.useState<ComboboxOption[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [page, setPage] = React.useState(1)
  const [hasMore, setHasMore] = React.useState(true)

  const selectedOption = options.find((option) => option.value === value)

  const loadOptions = React.useCallback(
    async (search: string, pageNum: number, reset = false) => {
      if (!fetchOptions) return

      setIsLoading(true)
      try {
        const result = await fetchOptions({
          search,
          page: pageNum,
          pageSize,
        })

        setOptions((prev) => (reset ? result.data : [...prev, ...result.data]))
        setHasMore(result.hasMore)
      } catch (error) {
        console.error('Error loading options:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [fetchOptions, pageSize]
  )

  React.useEffect(() => {
    if (open && fetchOptions) {
      setPage(1)
      loadOptions(searchValue, 1, true)
    }
  }, [open, searchValue, fetchOptions, loadOptions])

  const handleScroll = React.useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement
      const bottom =
        target.scrollHeight - target.scrollTop <= target.clientHeight + 50

      if (bottom && hasMore && !isLoading && fetchOptions) {
        const nextPage = page + 1
        setPage(nextPage)
        loadOptions(searchValue, nextPage, false)
      }
    },
    [hasMore, isLoading, page, searchValue, loadOptions, fetchOptions]
  )

  const handleSearch = React.useCallback((search: string) => {
    setSearchValue(search)
    setPage(1)
    setOptions([])
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={!fetchOptions}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchValue}
            onValueChange={handleSearch}
          />
          <CommandList onScroll={handleScroll}>
            {isLoading && options.length === 0 ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <>
                <CommandEmpty>{emptyText}</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={(currentValue) => {
                        onValueChange?.(currentValue === value ? "" : currentValue)
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
                {isLoading && options.length > 0 && (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
