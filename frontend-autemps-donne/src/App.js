import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login'; 
import WebFont from 'webfontloader';
import Dashboard from './pages/dashboard';
import Status from './pages/status';
import List from './pages/list';
import BeneficiaryList from './pages/listBeneficiaire';
import MembreList  from './pages/membres';
import Event from './pages/events';
import AllEvent from  "./pages/allEvents";
import Activiteprv from  "./pages/activite_prv";
import EventprvDetails from './pages/activitePriveDetails';
import EventDetails from  './pages/eventDetails';
import ParticipantsList from './pages/volunteers';
import ParticipantsBenefList from './pages/beneficiary';
WebFont.load({
  google: {
    families: ['Inter:wght@400;700']
  }
});
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} /> 
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/status" element={<Status />} /> 
        <Route path="/list" element={<List />} /> 
        <Route path="/beneficiaires" element={<BeneficiaryList />} /> 
        <Route path="/membres" element={<MembreList />} /> 
        <Route path="/events" element={<Event />} /> 
        <Route path="/AllEvents" element={<AllEvent />} /> 
        <Route path="/activiteprv" element={<Activiteprv />} /> 
        <Route path="/activity-details/:eventId" element={<EventDetails />} />
        <Route path="/volunteers/:eventId" element={<ParticipantsList />} /> 
        <Route path="/beneficiaires/:eventId" element={<ParticipantsBenefList />} /> 
        <Route path="/activiteprv_details/:eventId" element={<EventprvDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
