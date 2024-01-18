import Name from "./Name"

const Persons = ({ persons, filter, handleDelete }) => {
  return (
    <div>
      {persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase())).map(person => 
        <Name key={person.id} name={person.name} number={person.number} handleDelete={handleDelete} id={person.id}/>
      )}
    </div>
  )
}

export default Persons