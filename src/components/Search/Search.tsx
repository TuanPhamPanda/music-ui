import "./Search.scss";

interface Search {
  searchInput: string;
  onChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Search: React.FC<Search> = ({ onChangeInput, searchInput }) => {
  return (
    <div className="search">
      <input placeholder="Enter song title...." value={searchInput} onChange={onChangeInput} />
    </div>
  );
};

export default Search;
