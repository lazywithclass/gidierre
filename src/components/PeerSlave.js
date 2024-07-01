import React, { useState, useRef, useEffect } from 'react';
import { Peer } from 'peerjs'

import FogOfWarSlave from './FogOfWarSlave'


export default function PeerSlave() {
  const conn = useRef(null)

  const [self, setSelf] = useState('unassigned')
  const [master, setMaster] = useState(null)
  const [map, setMap] = useState(null)
  const [coord, setCoord] = useState({})
  const [pcName, setPCName] = useState("")
  const [pcs, setPCs] = useState([])

  useEffect(() => {
    if (!master) {
      return
    }

    let peer = new Peer()
    peer.on('open', (id) => {
      setSelf(id)
      conn.current = peer.connect(master)
      conn.current.on('data', (data) => {
        if (data.map) {
          setMap(data.map)
        } else if (data.coord){
          setCoord(data.coord)
        } else if (data.updatedPCs) {
          setPCs(data.updatedPCs)
        } else {
          console.error("unrecognized protocol", data)
        }
      })
      conn.current.on('error', (error) => console.log(error))
    })
  }, [master])

  function newPCPosition(data) {
    let withoutSelf = pcs.filter((pc) => pc.id !== self)
    conn.current?.send({ updatedPCs: [...withoutSelf, { ...data, id: self }] })
  }

  return (
    <div>
      <span>You are {self}, your master is </span>
      <input onChange={e => setMaster(e.target.value)} />
      <input value={pcName} onChange={(e) => setPCName(e.target.value)} />
      <FogOfWarSlave imageSrc={map} coord={coord} self={self} pcName={pcName} pcs={pcs} newPCPosition={newPCPosition} />
    </div>
  )
}
