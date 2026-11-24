import axios from 'axios'
import { useState, useEffect } from 'react'

const API = 'http://localhost:8080/api/specializations'

function Specialization() {
  // Save specialization state
  const [specName, setSpecName] = useState('')

  // Delete state
  const [deleteId, setDeleteId] = useState('')

  // Update state
  const [updateId, setUpdateId] = useState('')
  const [updateName, setUpdateName] = useState('')

  // Assign doctor to specialization
  const [assignSpecId, setAssignSpecId] = useState('')
  const [assignDocId, setAssignDocId] = useState('')

  // List all specializations
  const [specializations, setSpecializations] = useState([])

  useEffect(() => {
    fetchAllSpecializations()
  }, [])

  async function fetchAllSpecializations() {
    try {
      const response = await axios.get(API + '/all')
      setSpecializations(response.data)
    } catch (error) {
      console.error('Error fetching specializations:', error)
    }
  }

  async function saveSpecialization() {
    if (!specName) {
      alert('Please enter a Specialization Name')
      return
    }
    try {
      const response = await axios.post(API + '/save', {
        name: specName,
      })
      if (response.status === 200) {
        alert('The specialization is saved successfully')
        setSpecName('')
        fetchAllSpecializations()
      }
    } catch (error) {
      alert(error.response?.data || 'Specialization not saved')
    }
  }

  async function updateSpecialization() {
    if (!updateId) {
      alert('Please enter a Specialization ID to update')
      return
    }
    try {
      const response = await axios.put(API + '/update/' + updateId, {
        name: updateName,
      })
      if (response.status === 200) {
        alert('The specialization is updated successfully')
        setUpdateId('')
        setUpdateName('')
        fetchAllSpecializations()
      }
    } catch (error) {
      alert(error.response?.data || 'Specialization not updated')
    }
  }

  async function deleteSpecialization() {
    if (!deleteId) {
      alert('Please enter a Specialization ID to delete')
      return
    }
    try {
      const response = await axios.delete(API + '/delete/' + deleteId)
      if (response.status === 200) {
        alert('The specialization is deleted successfully')
        setDeleteId('')
        fetchAllSpecializations()
      }
    } catch (error) {
      alert(error.response?.data || 'Specialization not deleted')
    }
  }

  async function assignDoctor() {
    if (!assignSpecId || !assignDocId) {
      alert('Please fill in both Specialization ID and Doctor ID')
      return
    }
    try {
      const response = await axios.post(API + '/' + assignSpecId + '/doctor/' + assignDocId)
      if (response.status === 200) {
        alert('Doctor is assigned successfully')
        setAssignSpecId('')
        setAssignDocId('')
        fetchAllSpecializations()
      }
    } catch (error) {
      alert(error.response?.data || 'Failed to assign doctor')
    }
  }

  return (
    <div>
      {/* SAVE SPECIALIZATION */}
      <h2 className="section-title">Save Specialization</h2>
      <div className="form-card">
        <div className="form-row">
          <label>Name:</label>
          <input type="text" placeholder="Enter specialization name" value={specName} onChange={(e) => setSpecName(e.target.value)} />
        </div>
        <div className="btn-center">
          <button className="btn btn-save" onClick={saveSpecialization}>Save</button>
        </div>
      </div>

      {/* UPDATE SPECIALIZATION */}
      <h2 className="section-title">Update Specialization</h2>
      <div className="form-card">
        <div className="form-row">
          <label>Specialization ID:</label>
          <input type="text" placeholder="UUID of specialization" value={updateId} onChange={(e) => setUpdateId(e.target.value)} />
        </div>
        <div className="form-row">
          <label>New Name:</label>
          <input type="text" placeholder="New specialization name" value={updateName} onChange={(e) => setUpdateName(e.target.value)} />
        </div>
        <div className="btn-center">
          <button className="btn btn-update" onClick={updateSpecialization}>Update</button>
        </div>
      </div>

      {/* ASSIGN DOCTOR */}
      <h2 className="section-title">Assign Doctor to Specialization</h2>
      <div className="form-card">
        <div className="form-row">
          <label>Specialization ID:</label>
          <input type="text" placeholder="Enter specialization UUID" value={assignSpecId} onChange={(e) => setAssignSpecId(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Doctor ID:</label>
          <input type="text" placeholder="Enter doctor UUID" value={assignDocId} onChange={(e) => setAssignDocId(e.target.value)} />
        </div>
        <div className="btn-center">
          <button className="btn btn-save" onClick={assignDoctor}>Assign</button>
        </div>
      </div>

      {/* DELETE SPECIALIZATION */}
      <h2 className="section-title">Delete Specialization</h2>
      <div className="form-card">
        <div className="form-row">
          <label>Specialization ID:</label>
          <input type="text" placeholder="Enter specialization UUID" value={deleteId} onChange={(e) => setDeleteId(e.target.value)} />
        </div>
        <div className="btn-center">
          <button className="btn btn-delete" onClick={deleteSpecialization}>Delete</button>
        </div>
      </div>

      <hr className="divider" />

      {/* ALL SPECIALIZATIONS TABLE */}
      <h2 className="section-title">All Specializations</h2>
      <div className="btn-center" style={{ marginBottom: '15px' }}>
        <button className="btn btn-search" onClick={fetchAllSpecializations}>Refresh</button>
      </div>
      {specializations.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {specializations.map((spec) => (
              <tr key={spec.id}>
                <td style={{ fontSize: '0.75rem' }}>{spec.id}</td>
                <td>{spec.name}</td>
                <td>
                  <button className="btn btn-delete" onClick={async () => {
                    try {
                      const res = await axios.delete(API + '/delete/' + spec.id)
                      if (res.status === 200) {
                        alert('The specialization is deleted successfully')
                        fetchAllSpecializations()
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
        <p style={{ textAlign: 'center', color: '#a0a0b0' }}>No specializations found.</p>
      )}
    </div>
  )
}

export default Specialization
