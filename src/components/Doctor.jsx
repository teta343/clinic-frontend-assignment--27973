import axios from 'axios'
import { useState, useEffect } from 'react'

const API = 'http://localhost:8080/api/doctors'

function Doctor() {
  // Save doctor state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [officeNumber, setOfficeNumber] = useState('')

  // Delete doctor state
  const [deleteId, setDeleteId] = useState('')

  // Update doctor state
  const [updateId, setUpdateId] = useState('')
  const [updateFirstName, setUpdateFirstName] = useState('')
  const [updateLastName, setUpdateLastName] = useState('')
  const [updateDob, setUpdateDob] = useState('')
  const [updateOfficeNumber, setUpdateOfficeNumber] = useState('')

  // List all doctors
  const [doctors, setDoctors] = useState([])

  useEffect(() => {
    fetchAllDoctors()
  }, [])

  async function fetchAllDoctors() {
    try {
      const response = await axios.get(API + '/all')
      setDoctors(response.data)
    } catch (error) {
      console.error('Error fetching doctors:', error)
    }
  }

  async function saveDoctor() {
    if (!firstName || !lastName) {
      alert('Please fill in First Name and Last Name')
      return
    }
    try {
      const body = {
        firstName,
        lastName,
        dateOfBirth: dateOfBirth || null,
      }
      if (officeNumber) {
        body.office = { officeNumber: Number(officeNumber) }
      }
      const response = await axios.post(API + '/save', body)
      if (response.status === 200) {
        alert('The doctor is saved successfully')
        setFirstName('')
        setLastName('')
        setDateOfBirth('')
        setOfficeNumber('')
        fetchAllDoctors()
      }
    } catch (error) {
      alert(error.response?.data || 'Doctor not saved')
    }
  }

  async function deleteDoctor() {
    if (!deleteId) {
      alert('Please enter a Doctor ID to delete')
      return
    }
    try {
      const response = await axios.delete(API + '/delete/' + deleteId)
      if (response.status === 200) {
        alert('The doctor is deleted successfully')
        setDeleteId('')
        fetchAllDoctors()
      }
    } catch (error) {
      alert(error.response?.data || 'Doctor not deleted')
    }
  }

  async function updateDoctor() {
    if (!updateId) {
      alert('Please enter a Doctor ID to update')
      return
    }
    try {
      const body = {
        id: updateId,
        firstName: updateFirstName || undefined,
        lastName: updateLastName || undefined,
        dateOfBirth: updateDob || undefined,
      }
      if (updateOfficeNumber) {
        body.office = { officeNumber: Number(updateOfficeNumber) }
      }
      const response = await axios.put(API + '/update', body)
      if (response.status === 200) {
        alert('The doctor is updated successfully')
        setUpdateId('')
        setUpdateFirstName('')
        setUpdateLastName('')
        setUpdateDob('')
        setUpdateOfficeNumber('')
        fetchAllDoctors()
      }
    } catch (error) {
      alert(error.response?.data || 'Doctor not updated')
    }
  }

  return (
    <div>
      {/* SAVE DOCTOR */}
      <h2 className="section-title">Save Doctor</h2>
      <div className="form-card">
        <div className="form-row">
          <label>First Name:</label>
          <input type="text" placeholder="Enter first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Last Name:</label>
          <input type="text" placeholder="Enter last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Date of Birth:</label>
          <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Office Number:</label>
          <input type="number" placeholder="Enter office number (optional)" value={officeNumber} onChange={(e) => setOfficeNumber(e.target.value)} />
        </div>
        <div className="btn-center">
          <button className="btn btn-save" onClick={saveDoctor}>Save</button>
        </div>
      </div>

      {/* UPDATE DOCTOR */}
      <h2 className="section-title">Update Doctor</h2>
      <div className="form-card">
        <div className="form-row">
          <label>Doctor ID:</label>
          <input type="text" placeholder="UUID of doctor to update" value={updateId} onChange={(e) => setUpdateId(e.target.value)} />
        </div>
        <div className="form-row">
          <label>First Name:</label>
          <input type="text" placeholder="New first name" value={updateFirstName} onChange={(e) => setUpdateFirstName(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Last Name:</label>
          <input type="text" placeholder="New last name" value={updateLastName} onChange={(e) => setUpdateLastName(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Date of Birth:</label>
          <input type="date" value={updateDob} onChange={(e) => setUpdateDob(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Office Number:</label>
          <input type="number" placeholder="New office number" value={updateOfficeNumber} onChange={(e) => setUpdateOfficeNumber(e.target.value)} />
        </div>
        <div className="btn-center">
          <button className="btn btn-update" onClick={updateDoctor}>Update</button>
        </div>
      </div>

      {/* DELETE DOCTOR */}
      <h2 className="section-title">Delete Doctor</h2>
      <div className="form-card">
        <div className="form-row">
          <label>Doctor ID:</label>
          <input type="text" placeholder="Enter doctor UUID" value={deleteId} onChange={(e) => setDeleteId(e.target.value)} />
        </div>
        <div className="btn-center">
          <button className="btn btn-delete" onClick={deleteDoctor}>Delete</button>
        </div>
      </div>

      <hr className="divider" />

      {/* ALL DOCTORS TABLE */}
      <h2 className="section-title">All Doctors</h2>
      <div className="btn-center" style={{ marginBottom: '15px' }}>
        <button className="btn btn-search" onClick={fetchAllDoctors}>Refresh</button>
      </div>
      {doctors.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Date of Birth</th>
              <th>Office</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={doc.id}>
                <td style={{ fontSize: '0.75rem' }}>{doc.id}</td>
                <td>{doc.firstName}</td>
                <td>{doc.lastName}</td>
                <td>{doc.dateOfBirth}</td>
                <td>{doc.office ? `${doc.office.name} (#${doc.office.officeNumber})` : 'N/A'}</td>
                <td>
                  <button className="btn btn-delete" onClick={async () => {
                    try {
                      const res = await axios.delete(API + '/delete/' + doc.id)
                      if (res.status === 200) {
                        alert('The doctor is deleted successfully')
                        fetchAllDoctors()
                      }
                    } catch (err) {
                      alert(err.response?.data || 'Failed to delete')
                    }
                  }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: 'center', color: '#a0a0b0' }}>No doctors found.</p>
      )}
    </div>
  )
}

export default Doctor
