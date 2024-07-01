export default function CopyButton({ text, textToCopy }) {
  return (
    <button onClick={() => navigator.clipboard.writeText(textToCopy) }>{text}</button>
  )
}
