'use client'
import { useEffect, useState } from 'react'

export default function MapsPage() {
  const [maps, setMaps] = useState([])

  useEffect(() => {
    fetch('http://localhost:3001/maps') // ⚠️ NestJS 的接口
      .then((res) => res.json())
      .then(setMaps)
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Maps</h1>
      <ul className="mt-2 list-disc list-inside">
        {maps.map((map: any) => (
          <li key={map.id}>{map.name}</li>
        ))}
      </ul>
    </div>
  )
}
