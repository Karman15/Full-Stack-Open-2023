import { useState, useEffect } from 'react';
import Filter from './components/Filter';
import Display from './components/Display';
import countryService from './services/countries';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState('');

  const handleFilterChange = event => setFilter(event.target.value);

  useEffect(() => {
    countryService
      .getAll()
      .then(countries => setCountries(countries));
  }, []);

  return (
    <div>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <Display countries={countries} filter={filter} setFilter={setFilter} />
    </div>
  )
}

export default App;