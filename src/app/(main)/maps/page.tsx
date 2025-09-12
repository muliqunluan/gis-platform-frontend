'use client'
import { useEffect, useState } from 'react'
import { API_BASE_URL } from '@/lib/api/config'
import Button from '@/components/atoms/Button/Button'

interface MapItem {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
  status: string
}

export default function MapsPage() {
  const [maps, setMaps] = useState<MapItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMaps = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_BASE_URL}/api/maps/my-maps`, {
          credentials: 'include'
        })
        
        if (!response.ok) {
          throw new Error('获取地图列表失败')
        }
        
        const data = await response.json()
        setMaps(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取地图列表失败')
      } finally {
        setLoading(false)
      }
    }

    fetchMaps()
  }, [])

  const handleViewMap = (mapId: string) => {
    // 跳转到地图查看页面
    console.log('查看地图:', mapId)
  }

  const handleEditMap = (mapId: string) => {
    // 跳转到地图编辑页面
    console.log('编辑地图:', mapId)
  }

  const handleDeleteMap = async (mapId: string) => {
    if (!confirm('确定要删除这个地图吗？')) return
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/maps/${mapId}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      
      if (response.ok) {
        setMaps(maps.filter(map => map.id !== mapId))
        alert('地图删除成功')
      } else {
        throw new Error('删除失败')
      }
    } catch (err) {
      alert('删除地图失败')
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">我的地图</h1>
        <div className="flex justify-center items-center h-64">
          <p>加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">我的地图</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">我的地图</h1>
        <Button onClick={() => window.location.href = '/publish'}>
          创建新地图
        </Button>
      </div>

      {maps.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">您还没有创建任何地图</p>
          <Button onClick={() => window.location.href = '/publish'}>
            开始创建第一个地图
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {maps.map((map) => (
            <div key={map.id} className="bg-white rounded-lg shadow-md p-4 border">
              <h3 className="text-lg font-semibold mb-2">{map.name}</h3>
              {map.description && (
                <p className="text-gray-600 text-sm mb-3">{map.description}</p>
              )}
              <div className="text-xs text-gray-500 mb-4">
                <div>创建时间: {new Date(map.createdAt).toLocaleDateString()}</div>
                <div>状态: {map.status}</div>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleViewMap(map.id)}
                  className="flex-1 text-sm py-1 px-2"
                >
                  查看
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleEditMap(map.id)}
                  className="flex-1 text-sm py-1 px-2"
                >
                  编辑
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteMap(map.id)}
                  className="flex-1 text-sm py-1 px-2"
                >
                  删除
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
