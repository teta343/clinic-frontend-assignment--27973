import { useState } from 'react'
import './App.css'
import ClinicHeader from './components/ClinicHeader'
import ClinicFooter from './components/ClinicFooter'
import Office from './components/Office'
import Doctor from './components/Doctor'
import Patient from './components/Patient'
import Appointment from './components/Appointment'
import Specialization from './components/Specialization'

function App() {
  const [activeTab, setActiveTab] = useState('office')

  function renderContent() {
    switch (activeTab) {
      case 'office': return <Office />
      case 'doctor': return <Doctor />
      case 'patient': return <Patient />
      case 'appointment': return <Appointment />
      case 'specialization': return <Specialization />
      default: return <Office />
    }
  }

  return (
    <div className="app-container">
      <ClinicHeader />
      <nav className="nav-bar">
        <button className={activeTab === 'office' ? 'nav-btn active' : 'nav-btn'} onClick={() => setActiveTab('office')}>Office</button>
        <button className={activeTab === 'doctor' ? 'nav-btn active' : 'nav-btn'} onClick={() => setActiveTab('doctor')}>Doctor</button>
        <button className={activeTab === 'patient' ? 'nav-btn active' : 'nav-btn'} onClick={() => setActiveTab('patient')}>Patient</button>
        <button className={activeTab === 'appointment' ? 'nav-btn active' : 'nav-btn'} onClick={() => setActiveTab('appointment')}>Appointment</button>
        <button className={activeTab === 'specialization' ? 'nav-btn active' : 'nav-btn'} onClick={() => setActiveTab('specialization')}>Specialization</button>
      </nav>
      <main className="main-content">
        {renderContent()}
      </main>
      <ClinicFooter />
    </div>
  )
}

export default App
