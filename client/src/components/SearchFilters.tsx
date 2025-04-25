import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

interface SearchFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedGenre: string | null
  onGenreChange: (value: string | null) => void
  genres: string[]
}

const SearchFilters = ({
  searchTerm,
  onSearchChange,
  selectedGenre,
  onGenreChange,
  genres,
}: SearchFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
      <div className="w-full sm:w-64">
        <Label htmlFor="search" className="sr-only">
          Search books
        </Label>
        <Input
          id="search"
          placeholder="Search by title or author"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="w-full sm:w-48">
        <Select value={selectedGenre || ""} onValueChange={(value) => onGenreChange(value === "" ? null : value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Genres" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            {genres.map((genre) => (
              <SelectItem key={genre} value={genre}>
                {genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default SearchFilters
