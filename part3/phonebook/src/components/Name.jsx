const Name = ({ name, number, handleDelete, id }) => {
  return (
    <>
      {name} {number}
      <button onClick={() => handleDelete(id)}>delete</button>
      <br />
    </>
  )
}

export default Name