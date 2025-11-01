import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface FilterOption {
    label: string;
    value: string;
}

interface SearchFilterProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    filterValue?: string;
    onFilterChange?: (value: string) => void;
    filterOptions?: FilterOption[];
    filterPlaceholder?: string;
    searchPlaceholder?: string;
    onClear?: () => void;
}

export function SearchFilter({
    searchValue,
    onSearchChange,
    filterValue,
    onFilterChange,
    filterOptions,
    filterPlaceholder = 'Filtrar por...',
    searchPlaceholder = 'Buscar...',
    onClear,
}: SearchFilterProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search Input */}
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9"
                />
            </div>

            {/* Filter Select */}
            {filterOptions && onFilterChange && (
                <Select value={filterValue} onValueChange={onFilterChange}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder={filterPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {filterOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}

            {/* Clear Button */}
            {onClear && (searchValue || (filterValue && filterValue !== 'all')) && (
                <Button variant="outline" onClick={onClear}>
                    Limpar
                </Button>
            )}
        </div>
    );
}
