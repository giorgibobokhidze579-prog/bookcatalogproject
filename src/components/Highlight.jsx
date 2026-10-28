function Highlight({ text, part }) {
  const index = part ? text.toLowerCase().indexOf(part.toLowerCase()) : -1
  if (index < 0) return text
  return (
    <>
      {text.slice(0, index)}
      <mark>{text.slice(index, index + part.length)}</mark>
      {text.slice(index + part.length)}
    </>
  )
}

export default Highlight
