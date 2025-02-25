import {type FC, useEffect} from "react"
import { Input } from "./input"
import {SearchIcon} from "lucide-react"

type Props = {
  input: string;
  setInput: (value: string) => void;
  handleSearchChange: (value: string) => void;
  searchValue: string;
  placeholder?: string;
};

const SearchInput: FC<Props> = ({
  input,
  setInput,
  handleSearchChange,
  searchValue,
  placeholder = "Search Daos"
}) => {
  useEffect(() => {
    const handler = setTimeout(() => {
      if (input !== searchValue) {
        handleSearchChange(input)
      }
    }, 500)

    return () => {
      clearTimeout(handler)
    }
  }, [input, handleSearchChange, searchValue, setInput])

  return (
    <div className="relative">
      <SearchIcon className="text-primary absolute top-1/2 left-3 -translate-y-1/2" />
      <Input
        value={input}
        onChange={(e) => {
          setInput(e.target.value)
        }}
        placeholder={placeholder}
        className="bg-muted h-11 rounded-lg pl-12 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  )
}

export default SearchInput
