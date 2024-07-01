import React, { useState, useRef, useEffect } from 'react';
import { Peer } from 'peerjs'

import FogOfWarMaster from './FogOfWarMaster'
import MapUpload from './MapUpload'
import CopyButton from './CopyButton'


export default function PeerMaster() {

  const [self, setSelf] = useState(null)
  const conns = useRef([])
  const [map, setMap] = useState(null)
  const [pcs, setPCs] = useState([])

  useEffect(() => {
    const peer = new Peer();
    peer.on('open', (id) => setSelf(id))
    peer.on('connection', (newConn) => {
      newConn.on('error', (error) => console.log(error))
      newConn.on('data', (data) => {
        if (data.updatedPCs) {
          setPCs(data.updatedPCs)
          conns.current.forEach((conn) => {
            conn.send(data)
          })
        }
      })
      conns.current.push(newConn)
    })
  }, [])

  useEffect(() => {
    if (map) {
      conns.current.forEach((conn) => conn.send({ map }))
    }
  }, [map])

  function onChange(coord) {
    conns?.current.forEach((conn) => conn.send({ coord }))
  }

  return (
    <div>
      <CopyButton text="Copy your master id" textToCopy={self} />
      <FogOfWarMaster imageSrc={map} onChange={onChange} pcs={pcs} />
      <MapUpload onUploadFinished={setMap} />
    </div>
  )
}



// TODO gidierre
// proporzioni rispettate in base al client
// client possono mettere un pin su dove e' il loro pg


// TODO
// video ereditarieta
// video genercis
//
