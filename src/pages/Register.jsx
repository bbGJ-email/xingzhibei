import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    region: '',
    contact: ''
  })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [userId, setUserId] = useState('')

  // 城市列表
  const cities = [
    '北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安',
    '南京', '重庆', '天津', '苏州', '郑州', '长沙', '沈阳', '青岛',
    '宁波', '东莞', '无锡', '福州', '厦门', '济南', '哈尔滨', '合肥',
    '昆明', '南昌', '南宁', '贵阳', '太原', '石家庄', '乌鲁木齐', '兰州',
    '西宁', '银川', '拉萨'
  ]

  // 表单验证
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = '称呼不能为空'
    }
    
    if (!formData.age) {
      newErrors.age = '年龄不能为空'
    } else if (isNaN(formData.age) || formData.age < 10 || formData.age > 60) {
      newErrors.age = '年龄必须在10-60之间'
    }
    
    if (!formData.region) {
      newErrors.region = '请选择赛区'
    }
    
    if (!formData.contact.trim()) {
      newErrors.contact = '备用联系方式不能为空'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 表单提交
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      // 提交到后端API
      fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          ip_address: window.location.hostname // 模拟IP地址
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setUserId(data.user_id)
          setSuccess(true)
          
          // 10秒后返回首页
          setTimeout(() => {
            navigate('/')
          }, 10000)
        } else {
          alert('报名失败: ' + data.message)
        }
      })
      .catch(error => {
        console.error('报名失败:', error)
        alert('报名失败，请稍后重试')
      })
    }
  }

  // 输入变化处理
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-blue-600 text-white shadow-md">
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

      {/* 报名表单 */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">比赛报名</h2>
          
          {success ? (
            <div className="max-w-2xl mx-auto bg-green-50 p-8 rounded-lg shadow-md text-center">
              <h3 className="text-2xl font-bold text-green-600 mb-4">报名成功！</h3>
              <p className="text-gray-700 mb-6">
                恭喜您成功报名星智杯编程比赛！
              </p>
              <div className="bg-white p-4 rounded-md shadow-sm mb-6">
                <p className="text-gray-700 mb-2">您的唯一标识符（用于考试登录）：</p>
                <p className="text-xl font-bold text-blue-600 select-all">{userId}</p>
              </div>
              <p className="text-gray-600 mb-2">
                请妥善保存此标识符，考试时需要使用它登录系统。
              </p>
              <p className="text-gray-500">
                10秒后将自动返回首页...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
              <div className="mb-6">
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                  称呼 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="请输入您的称呼"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div className="mb-6">
                <label htmlFor="age" className="block text-gray-700 font-medium mb-2">
                  年龄 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.age ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="请输入您的年龄"
                  min="10"
                  max="60"
                />
                {errors.age && (
                  <p className="text-red-500 text-sm mt-1">{errors.age}</p>
                )}
              </div>

              <div className="mb-6">
                <label htmlFor="region" className="block text-gray-700 font-medium mb-2">
                  赛区 <span className="text-red-500">*</span>
                </label>
                <select
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.region ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">请选择赛区</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {errors.region && (
                  <p className="text-red-500 text-sm mt-1">{errors.region}</p>
                )}
              </div>

              <div className="mb-6">
                <label htmlFor="contact" className="block text-gray-700 font-medium mb-2">
                  备用联系方式 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.contact ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="请输入手机号或邮箱"
                />
                {errors.contact && (
                  <p className="text-red-500 text-sm mt-1">{errors.contact}</p>
                )}
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-700 transition-colors"
                >
                  提交报名
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* 页脚 */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4">本次大赛由星智计算举办</p>
          <p className="text-sm text-gray-400">© 2026 星智杯编程比赛. 保留所有权利.</p>
        </div>
      </footer>
    </div>
  )
}

export default Register