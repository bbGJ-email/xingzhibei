import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const [userId, setUserId] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!userId.trim()) {
      setError('请输入您的唯一标识符')
      return
    }
    
    try {
      // 调用后端API进行登录验证
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId })
      })
      
      const data = await response.json()
      if (data.success) {
        // 登录成功后存储用户ID到localStorage
        localStorage.setItem('userId', userId)
        // 跳转到考试页面
        navigate('/exam')
      } else {
        setError('登录失败: ' + data.message)
      }
    } catch (error) {
      console.error('登录失败:', error)
      setError('登录失败，请稍后重试')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 bg-blue-600 text-white shadow-md z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-xl font-bold">星智杯编程比赛</div>
          <div className="space-x-4">
            <Link to="/" className="hover:underline">首页</Link>
            <Link to="/register" className="hover:underline">报名</Link>
            <Link to="/login" className="hover:underline">考试入口</Link>
            <Link to="/admin" className="hover:underline">管理员</Link>
          </div>
        </div>
      </nav>

      {/* 登录表单 */}
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mt-20">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">考试登录</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="userId" className="block text-gray-700 font-medium mb-2">
              唯一标识符
            </label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="请输入报名时生成的唯一标识符"
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>

          <div className="mb-6 text-center">
            <p className="text-gray-600 text-sm">
              请使用报名时生成的唯一标识符登录系统
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 px-8 rounded-md text-lg hover:bg-blue-700 transition-colors"
          >
            登录考试
          </button>
        </form>
      </div>

      {/* 页脚 */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">本次大赛由星智计算举办</p>
          <p className="text-sm text-gray-400">© 2026 星智杯编程比赛. 保留所有权利.</p>
        </div>
      </footer>
    </div>
  )
}

export default Login