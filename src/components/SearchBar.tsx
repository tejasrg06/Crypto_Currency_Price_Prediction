
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => (
  <div className="flex items-center rounded-md border bg-card px-3 py-2 gap-2 w-full mb-4">
    <Search className="w-5 h-5 opacity-50" />
    <Input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Search cryptocurrency..."
      className="border-0 outline-none shadow-none bg-transparent p-0 text-base flex-1"
    />
  </div>
);

export default SearchBar;
