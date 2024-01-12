const Display = ({ countries, filter, setFilter }) => {
  if (filter === '') {
    return (
      <p>Enter a country name to search</p>
    )
  }
  const filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()));
  if (filteredCountries.length > 10) {
    return (
      <p>Too many matches, specify another filter</p>
    )
  } else if (filteredCountries.length === 1) {
    return (
      <div>
        <h1>{filteredCountries[0].name.common}</h1>
        <p>Capital: {filteredCountries[0].capital[0]}
        <br/>
        Area: {filteredCountries[0].area}</p>
        <h3>Languages</h3>
        <ul>
          {Object.values(filteredCountries[0].languages).map(language => <li key={language}>{language}</li>)}
        </ul>
        <img src={filteredCountries[0].flags.png} alt="flag" width="150" />
      </div>
    )
  } else {
    return (
      <div>
        {filteredCountries.map(country => <p key={country.name.common}>{country.name.common} <button onClick={() => setFilter(country.name.common)}>show</button></p>)}
      </div>
    )
  }
}

export default Display;