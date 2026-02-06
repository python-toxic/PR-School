import { Input } from "../ui/input.jsx";

export default function LibrarySearch({ search, setSearch }) {
  return (
    <Input
      placeholder="Search by book name or author..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="max-w-md"
    />
  );
}
