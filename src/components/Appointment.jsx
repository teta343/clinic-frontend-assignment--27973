import axios from 'axios'
import { useState, useEffect } from 'react'

const API = 'http://localhost:8080/api/appointments'

function Appointment() {
  // Save appointment state
  const [appointmentDate, setAppointmentDate] = useState('')
  const [reason, setReason] = useState('')
  const [status, setStatus] = useState('PENDING')
  const [patientId, setPatientId] = useState('')
  const [doctorId, setDoctorId] = useState('')

  // Delete appointment state
  const [deleteId, setDeleteId] = useState('')

  // List all appointments
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    fetchAllAppointments()
  }, [])

  async function fetchAllAppointments() {
    try {
      const response = await axios.get(API + '/all')
      setAppointments(response.data)
    } catch (error) {
      console.error('Error fetching appointments:', error)
    }
  }

  async function saveAppointment() {
    if (!appointmentDate || !reason || !patientId || !doctorId) {
      alert('Please fill in all fields')
      return
    }
    try {
      const response = await axios.post(
        API + '/save?patientId=' + patientId + '&doctorId=' + doctorId,
        {
          appointmentDate,
          reason,
          status,
        }
      )
      if (response.status === 200) {
        alert('The appointment is saved successfully')
        setAppointmentDate('')
        setReason('')
        setStatus('PENDING')
        setPatientId('')
        setDoctorId('')
        fetchAllAppointments()
      }
    } catch (error) {
      alert(error.response?.data || 'Appointment not saved')
    }
  }

  async function deleteAppointment() {
    if (!deleteId) {
      alert('Please enter an Appointment ID to delete')
      return
    }
    try {
      const response = await axios.delete(API + '/delete/' + deleteId)
      if (response.status === 200) {
        alert('The appointment is deleted successfully')
        setDeleteId('')
        fetchAllAppointments()
      }
    } catch (error) {
      alert(error.response?.data || 'Appointment not deleted')
    }
  }

  return (
    <div>
      {/* SAVE APPOINTMENT */}
      <h2 className="section-title">Save Appointment</h2>
      <div className="form-card">
        <div className="form-row">
          <label>Date:</label>
          <input type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Reason:</label>
          <input type="text" placeholder="Enter reason" value={reason} onChange={(e) => setReason(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="PENDING">PENDING</option>
            <option value="SCHEDULED">SCHEDULED</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
        <div className="form-row">
          <label>Patient ID:</label>
          <input type="text" placeholder="Enter patient UUID" value={patientId} onChange={(e) => setPatientId(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Doctor ID:</label>
          <input type="text" placeholder="Enter doctor UUID" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} />
        </div>
        <div className="btn-center">
          <button className="btn btn-save" onClick={saveAppointment}>Save</button>
        </div>
      </div>

      {/* DELETE APPOINTMENT */}
      <h2 className="section-title">Delete Appointment</h2>
      <div className="form-card">
        <div className="form-row">
          <label>Appointment ID:</label>
          <input type="text" placeholder="Enter appointment UUID" value={deleteId} onChange={(e) => setDeleteId(e.target.value)} />
        </div>
        <div className="btn-center">
          <button className="btn btn-delete" onClick={deleteAppointment}>Delete</button>
        </div>
      </div>

      <hr className="divider" />

      {/* ALL APPOINTMENTS TABLE */}
      <h2 className="section-title">All Appointments</h2>
      <div className="btn-center" style={{ marginBottom: '15px' }}>
        <button className="btn btn-search" onClick={fetchAllAppointments}>Refresh</button>
      </div>
      {appointments.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((apt) => (
              <tr key={apt.id}>
                <td style={{ fontSize: '0.7rem' }}>{apt.id}</td>
                <td>{apt.appointmentDate}</td>
                <td>{apt.reason}</td>
                <td>{apt.status}</td>
                <td>{apt.patient ? `${apt.patient.firstName} ${apt.patient.lastName}` : 'N/A'}</td>
                <td>{apt.doctor ? `${apt.doctor.firstName} ${apt.doctor.lastName}` : 'N/A'}</td>
                <td>
                  <button className="btn btn-delete" onClick={async () => {
                    try {
                      const res = await axios.delete(API + '/delete/' + apt.id)
                      if (res.status === 200) {
                        alert('The appointment is deleted successfully')
                        fetchAllAppointments()
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
        <p style={{ textAlign: 'center', color: '#a0a0b0' }}>No appointments found.</p>
      )}
    </div>
  )
}

export default Appointment
