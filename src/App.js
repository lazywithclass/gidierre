import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom"

import PeerMaster from './components/PeerMaster'
import PeerSlave from './components/PeerSlave'
import './App.css'


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className="">
            <PeerMaster />
          </div>
        }>
        </Route>
        <Route path="/slave" element={
          <div className="">
            <PeerSlave />
          </div>
        }>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
