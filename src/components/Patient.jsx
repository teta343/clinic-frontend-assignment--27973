import axios from 'axios'
import { useState, useEffect } from 'react'

const API = 'http://localhost:8080/api/patients'

function Patient() {
  // Save patient state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')

  // Delete patient state
  const [deleteId, setDeleteId] = useState('')

  // Update patient state
  const [updateId, setUpdateId] = useState('')
  const [updateFirstName, setUpdateFirstName] = useState('')
  const [updateLastName, setUpdateLastName] = useState('')
  const [updateDob, setUpdateDob] = useState('')

  // List all patients
  const [patients, setPatients] = useState([])

  useEffect(() => {
    fetchAllPatients()
  }, [])

  async function fetchAllPatients() {
    try {
      const response = await axios.get(API + '/all')
      setPatients(response.data)
    } catch (error) {
      console.error('Error fetching patients:', error)
    }
  }

  async function savePatient() {
    if (!firstName || !lastName) {
      alert('Please fill in First Name and Last Name')
      return
    }
    try {
      const response = await axios.post(API + '/save', {
        firstName,
        lastName,
        dateOfBirth: dateOfBirth || null,
      })
      if (response.status === 200) {
        alert('The patient is saved successfully')
        setFirstName('')
        setLastName('')
        setDateOfBirth('')
        fetchAllPatients()
      }
    } catch (error) {
      alert(error.response?.data || 'Patient not saved')
    }
  }

  async function deletePatient() {
    if (!deleteId) {
      alert('Please enter a Patient ID to delete')
      return
    }
    try {
      const response = await axios.delete(API + '/delete/' + deleteId)
      if (response.status === 200) {
        alert('The patient is deleted successfully')
        setDeleteId('')
        fetchAllPatients()
      }
    } catch (error) {
      alert(error.response?.data || 'Patient not deleted')
    }
  }

  async function updatePatient() {
    if (!updateId) {
      alert('Please enter a Patient ID to update')
      return
    }
    try {
      const response = await axios.put(API + '/update', {
        id: updateId,
        firstName: updateFirstName || undefined,
        lastName: updateLastName || undefined,
        dateOfBirth: updateDob || undefined,
      })
      if (response.status === 200) {
        alert('The patient is updated successfully')
        setUpdateId('')
        setUpdateFirstName('')
        setUpdateLastName('')
        setUpdateDob('')
        fetchAllPatients()
      }
    } catch (error) {
      alert(error.response?.data || 'Patient not updated')
    }
  }

  return (
    <div>
      {/* SAVE PATIENT */}
      <h2 className="section-title">Save Patient</h2>
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
        <div className="btn-center">
          <button className="btn btn-save" onClick={savePatient}>Save</button>
        </div>
      </div>

      {/* UPDATE PATIENT */}
      <h2 className="section-title">Update Patient</h2>
      <div className="form-card">
        <div className="form-row">
          <label>Patient ID:</label>
          <input type="text" placeholder="UUID of patient to update" value={updateId} onChange={(e) => setUpdateId(e.target.value)} />
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
        <div className="btn-center">
          <button className="btn btn-update" onClick={updatePatient}>Update</button>
        </div>
      </div>

      {/* DELETE PATIENT */}
      <h2 className="section-title">Delete Patient</h2>
      <div className="form-card">
        <div className="form-row">
          <label>Patient ID:</label>
          <input type="text" placeholder="Enter patient UUID" value={deleteId} onChange={(e) => setDeleteId(e.target.value)} />
        </div>
        <div className="btn-center">
          <button className="btn btn-delete" onClick={deletePatient}>Delete</button>
        </div>
      </div>

      <hr className="divider" />

      {/* ALL PATIENTS TABLE */}
      <h2 className="section-title">All Patients</h2>
      <div className="btn-center" style={{ marginBottom: '15px' }}>
        <button className="btn btn-search" onClick={fetchAllPatients}>Refresh</button>
      </div>
      {patients.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Date of Birth</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((pat) => (
              <tr key={pat.id}>
                <td style={{ fontSize: '0.75rem' }}>{pat.id}</td>
                <td>{pat.firstName}</td>
                <td>{pat.lastName}</td>
                <td>{pat.dateOfBirth}</td>
                <td>
                  <button className="btn btn-delete" onClick={async () => {
                    try {
                      const res = await axios.delete(API + '/delete/' + pat.id)
                      if (res.status === 200) {
                        alert('The patient is deleted successfully')
                        fetchAllPatients()
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
        <p style={{ textAlign: 'center', color: '#a0a0b0' }}>No patients found.</p>
      )}
    </div>
  )
}

export default Patient
