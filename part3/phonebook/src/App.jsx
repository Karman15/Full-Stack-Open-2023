import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [color, setColor] = useState('green')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPerson => setPersons(initialPerson))
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
    }
    if (persons.some(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(person => person.name === newName)
        const changedPerson = { ...person, number: newNumber }
        personService
          .update(person.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== returnedPerson.id ? person : returnedPerson))
            setColor('green')
            setErrorMessage(
              `Updated ${newName}'s number to ${newNumber}`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
          .catch(() => {
            setColor('red')
            setErrorMessage(
              `Information of ${person.name} has already been removed from server`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
      }
      setNewName('')
      setNewNumber('')
    }
    else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setColor('green')
          setErrorMessage(
            `Added ${newName}`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
        .catch(error => {
          setColor('red')
          setErrorMessage(
            error.response.data.error
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  const deletePerson = (id) => {
    const person = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .del(id)
        .then(() => setPersons(persons.filter(person => person.id !== id)))
      setColor('green')
      setErrorMessage(
        `Deleted ${person.name}`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} color={color} />
      <Filter filter={filter} handleFilter={handleFilter} />
      <h3>Add a new contact</h3>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} handleDelete = {deletePerson}/>
    </div>
  )
}

export default App