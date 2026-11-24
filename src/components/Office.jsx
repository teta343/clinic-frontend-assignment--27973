import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import LibraryButton from './LibraryBtn'

const API_URL = 'http://localhost:8080/api/offices'

function getErrorMessage(error) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    return typeof data === 'string' ? data : error.message
  }

  return String(error)
}

function Office() {
  const [officeName, setOfficeName] = useState('')
  const [officeNumber, setOfficeNumber] = useState('')
  const [officeNumberToDelete, setOfficeNumberToDelete] = useState('')

  const [offices, setOffices] = useState([])
  const [searchText, setSearchText] = useState('')
  const [activeSearch, setActiveSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState('')

  const loadOffices = useCallback(async () => {
    setLoading(true)

    try {
      const response = await axios.get(`${API_URL}/all`)
      setOffices(response.data)
      setLoadError('')
    } catch (error) {
      setLoadError(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadOffices()
  }, [loadOffices])

  async function saveOffice() {
    const number = Number(officeNumber)

    if (!officeName.trim() || !officeNumber.trim() || !Number.isInteger(number)) {
      alert('Enter an office name and a valid office number.')
      return
    }

    try {
      const response = await axios.post(`${API_URL}/save`, {
        name: officeName.trim(),
        officeNumber: number,
      })

      alert(response.data)
      setOfficeName('')
      setOfficeNumber('')
      await loadOffices()
    } catch (error) {
      alert(getErrorMessage(error))
    }
  }

  async function deleteOfficeByNumber() {
    const number = Number(officeNumberToDelete)

    if (!officeNumberToDelete.trim() || !Number.isInteger(number)) {
      alert('Enter a valid office number.')
      return
    }

    // Find the office by its number from the loaded list
    const office = offices.find(o => o.officeNumber === number)
    if (!office) {
      alert('Office not found')
      return
    }

    try {
      const response = await axios.delete(`${API_URL}/delete/${office.id}`)
      alert(response.data)
      setOfficeNumberToDelete('')
      await loadOffices()
    } catch (error) {
      alert(getErrorMessage(error))
    }
  }

  async function deleteOfficeFromTable(id) {
    if (!window.confirm('Are you sure you want to delete this office?')) {
      return
    }

    try {
      const response = await axios.delete(`${API_URL}/delete/${id}`)
      alert(response.data)
      await loadOffices()
    } catch (error) {
      alert(getErrorMessage(error))
    }
  }

  function handleSearch(event) {
    event.preventDefault()
    setActiveSearch(searchText.trim())
  }

  const search = activeSearch.toLowerCase()
  const filteredOffices = offices.filter((office) => {
    const nameMatches = (office.name || '').toLowerCase().includes(search)
    const numberMatches = String(office.officeNumber).includes(search)

    return nameMatches || numberMatches
  })

  return (
    <main className="office-page">
      <section>
        <h2>Save Office</h2>
        <label>
          Office Name:
          <input
            type="text"
            value={officeName}
            onChange={(event) => setOfficeName(event.target.value)}
          />
        </label>
        <label>
          Office Number:
          <input
            type="text"
            value={officeNumber}
            onChange={(event) => setOfficeNumber(event.target.value)}
          />
        </label>
        <LibraryButton buttonLabel="SAVE" onClickButton={saveOffice} />
      </section>

      <section>
        <h2>Delete Office</h2>
        <label>
          Office Number:
          <input
            type="text"
            value={officeNumberToDelete}
            onChange={(event) => setOfficeNumberToDelete(event.target.value)}
          />
        </label>
        <LibraryButton
          buttonLabel="DELETE"
          onClickButton={deleteOfficeByNumber}
        />
      </section>

      <section>
        <h2>Available Offices</h2>

        <form className="office-search" onSubmit={handleSearch}>
          <input
            type="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search by office name or number"
          />
          <button type="submit">Search</button>
        </form>

        {loadError && <p className="office-error">{loadError}</p>}

        <table className="office-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Office Number</th>
              <th>Office Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4">Loading offices...</td>
              </tr>
            ) : filteredOffices.length === 0 ? (
              <tr>
                <td colSpan="4">No offices found.</td>
              </tr>
            ) : (
              filteredOffices.map((office, index) => (
                <tr key={office.id}>
                  <td>{index + 1}</td>
                  <td>{office.officeNumber}</td>
                  <td>{office.name}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => deleteOfficeFromTable(office.id)}
                    >
                      DELETE
                    </button>{' '}
                    <button type="button" disabled title="Update is for a later class">
                      UPDATE
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </main>
  )
}
export default Office
