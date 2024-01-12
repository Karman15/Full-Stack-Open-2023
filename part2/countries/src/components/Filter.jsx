const Filter = ({ filter, handleFilterChange }) => {
  return (
    <p>Find countries <input value={filter} onChange={handleFilterChange} /> </p>
  )
}

export default Filter;