function LibraryButton({ buttonLabel, onClickButton }) {
  return (
    <button type="button" onClick={onClickButton}>
      {buttonLabel}
    </button>
  )
}

export default LibraryButton
