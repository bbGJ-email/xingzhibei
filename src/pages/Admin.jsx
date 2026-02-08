import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Admin() {
  const [activeTab, setActiveTab] = useState('registrations')
  const [loginStatus, setLoginStatus] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  // 真实数据状态
  const [registrations, setRegistrations] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [bannedIps, setBannedIps] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [problems, setProblems] = useState([])
  const [competitionStatus, setCompetitionStatus] = useState('未开始')

  // 格式化时间函数
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 代码查看器状态
  const [showCodeViewer, setShowCodeViewer] = useState(false)
  const [currentCode, setCurrentCode] = useState('')
  const [currentLanguage, setCurrentLanguage] = useState('')

  // 打开代码查看器
  const openCodeViewer = (code, language) => {
    setCurrentCode(code)
    setCurrentLanguage(language)
    setShowCodeViewer(true)
  }

  // 关闭代码查看器
  const closeCodeViewer = () => {
    setShowCodeViewer(false)
    setCurrentCode('')
    setCurrentLanguage('')
  }

  // 获取数据函数
  const fetchData = (endpoint, setter) => {
    fetch(`http://localhost:3001/api/admin/${endpoint}`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setter(data.data)
        }
      })
      .catch(error => {
        console.error(`获取${endpoint}失败:`, error)
      })
  }

  // 登录成功后获取数据
  useEffect(() => {
    if (loginStatus) {
      // 清空所有数据，确保只使用从API获取的真实数据
      setRegistrations([])
      setSubmissions([])
      setBannedIps([])
      setAnnouncements([])
      setProblems([])
      setCompetitionStatus('')
      
      // 从API获取真实数据
      fetchData('registrations', setRegistrations)
      fetchData('submissions', setSubmissions)
      fetchData('banned-ips', setBannedIps)
      fetchData('announcements', setAnnouncements)
      fetchData('problems', setProblems)
      fetchData('competition-status', setCompetitionStatus)
    }
  }, [loginStatus])

  const handleLogin = (e) => {
    e.preventDefault()
    
    if (username === 'admin' && password === 'admin123') {
      setLoginStatus(true)
    } else {
      setLoginError('用户名或密码错误')
    }
  }

  if (!loginStatus) {
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
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">管理员登录</h2>
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
                用户名
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                placeholder="请输入用户名"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                密码
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                placeholder="请输入密码"
              />
              {loginError && (
                <p className="text-red-500 text-sm mt-1">{loginError}</p>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              登录
            </button>
          </form>
        </div>
      </div>
    )
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

      {/* 管理员后台 */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">管理员后台</h2>
        
        {/* 标签页导航 */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('registrations')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'registrations'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              报名信息管理
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'submissions'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              代码提交管理
            </button>
            <button
              onClick={() => setActiveTab('bannedIps')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'bannedIps'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              IP封禁管理
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'announcements'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              公告管理
            </button>
            <button
              onClick={() => setActiveTab('problems')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'problems'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              题目管理
            </button>
            <button
              onClick={() => setActiveTab('competitionStatus')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'competitionStatus'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              比赛状态管理
            </button>
          </div>
        </div>

        {/* 标签页内容 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* 报名信息管理 */}
          {activeTab === 'registrations' && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">报名信息管理</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-3 text-left">ID</th>
                      <th className="border p-3 text-left">唯一标识符</th>
                      <th className="border p-3 text-left">称呼</th>
                      <th className="border p-3 text-left">年龄</th>
                      <th className="border p-3 text-left">赛区</th>
                      <th className="border p-3 text-left">备用联系方式</th>
                      <th className="border p-3 text-left">报名IP</th>
                      <th className="border p-3 text-left">报名时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map(registration => (
                      <tr key={registration.id} className="hover:bg-gray-50">
                        <td className="border p-3">{registration.id}</td>
                        <td className="border p-3">{registration.user_id}</td>
                        <td className="border p-3">{registration.name}</td>
                        <td className="border p-3">{registration.age}</td>
                        <td className="border p-3">{registration.region}</td>
                        <td className="border p-3">{registration.contact}</td>
                        <td className="border p-3">{registration.ip_address}</td>
                        <td className="border p-3">{formatDate(registration.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 代码提交管理 */}
          {activeTab === 'submissions' && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">代码提交管理</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-3 text-left">ID</th>
                      <th className="border p-3 text-left">用户标识符</th>
                      <th className="border p-3 text-left">题目ID</th>
                      <th className="border p-3 text-left">编程语言</th>
                      <th className="border p-3 text-left">代码内容</th>
                      <th className="border p-3 text-left">提交IP</th>
                      <th className="border p-3 text-left">提交时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map(submission => (
                      <tr key={submission.id} className="hover:bg-gray-50">
                        <td className="border p-3">{submission.id}</td>
                        <td className="border p-3">{submission.user_id}</td>
                        <td className="border p-3">{submission.problem_id}</td>
                        <td className="border p-3">{submission.language}</td>
                        <td className="border p-3">
                          <button
                            className="text-blue-600 hover:underline"
                            onClick={() => openCodeViewer(submission.code, submission.language)}
                          >
                            查看代码
                          </button>
                        </td>
                        <td className="border p-3">{submission.ip_address}</td>
                        <td className="border p-3">{formatDate(submission.submitted_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* IP封禁管理 */}
          {activeTab === 'bannedIps' && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">IP封禁管理</h3>
              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-gray-700">添加封禁IP</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="请输入IP地址"
                    className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                    id="ipAddress"
                  />
                  <input
                    type="text"
                    placeholder="封禁原因"
                    className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                    id="banReason"
                  />
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    onClick={async () => {
                      const ipAddress = document.getElementById('ipAddress').value
                      const banReason = document.getElementById('banReason').value
                      
                      if (!ipAddress) {
                        alert('请输入IP地址')
                        return
                      }
                      
                      try {
                        const response = await fetch('http://localhost:3001/api/admin/ban-ip', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({ ip_address: ipAddress, reason: banReason })
                        })
                        
                        const data = await response.json()
                        if (data.success) {
                          alert('IP封禁成功')
                          fetchData('banned-ips', setBannedIps)
                          document.getElementById('ipAddress').value = ''
                          document.getElementById('banReason').value = ''
                        } else {
                          alert('IP封禁失败: ' + data.message)
                        }
                      } catch (error) {
                        console.error('IP封禁失败:', error)
                        alert('IP封禁失败，请稍后重试')
                      }
                    }}
                  >
                    封禁
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-3 text-left">ID</th>
                      <th className="border p-3 text-left">IP地址</th>
                      <th className="border p-3 text-left">封禁时间</th>
                      <th className="border p-3 text-left">封禁原因</th>
                      <th className="border p-3 text-left">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bannedIps.map(bannedIp => (
                      <tr key={bannedIp.id} className="hover:bg-gray-50">
                        <td className="border p-3">{bannedIp.id}</td>
                        <td className="border p-3">{bannedIp.ip_address}</td>
                        <td className="border p-3">{formatDate(bannedIp.banned_at)}</td>
                        <td className="border p-3">{bannedIp.reason}</td>
                        <td className="border p-3">
                          <button 
                            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                            onClick={async () => {
                              try {
                                const response = await fetch(`http://localhost:3001/api/admin/unban-ip`, {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json'
                                  },
                                  body: JSON.stringify({ ip_address: bannedIp.ip_address })
                                })
                                
                                const data = await response.json()
                                if (data.success) {
                                  alert('IP解封成功')
                                  fetchData('banned-ips', setBannedIps)
                                } else {
                                  alert('IP解封失败: ' + data.message)
                                }
                              } catch (error) {
                                console.error('IP解封失败:', error)
                                alert('IP解封失败，请稍后重试')
                              }
                            }}
                          >
                            解封
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 公告管理 */}
          {activeTab === 'announcements' && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">公告管理</h3>
              <div className="mb-6">
                <h4 className="font-semibold mb-2 text-gray-700">发布新公告</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="公告标题"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                    id="announcementTitle"
                  />
                  <textarea
                    placeholder="公告内容"
                    rows={4}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                    id="announcementContent"
                  ></textarea>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="isPinned" />
                    <label htmlFor="isPinned">置顶公告</label>
                    <button 
                      className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      onClick={async () => {
                        const title = document.getElementById('announcementTitle').value
                        const content = document.getElementById('announcementContent').value
                        const isPinned = document.getElementById('isPinned').checked
                        
                        if (!title || !content) {
                          alert('请输入公告标题和内容')
                          return
                        }
                        
                        try {
                          const response = await fetch('http://localhost:3001/api/admin/create-announcement', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ title, content, is_pinned: isPinned })
                          })
                          
                          const data = await response.json()
                          if (data.success) {
                            alert('公告发布成功')
                            fetchData('announcements', setAnnouncements)
                            document.getElementById('announcementTitle').value = ''
                            document.getElementById('announcementContent').value = ''
                            document.getElementById('isPinned').checked = false
                          } else {
                            alert('公告发布失败: ' + data.message)
                          }
                        } catch (error) {
                          console.error('公告发布失败:', error)
                          alert('公告发布失败，请稍后重试')
                        }
                      }}
                    >
                      发布
                    </button>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-3 text-left">ID</th>
                      <th className="border p-3 text-left">标题</th>
                      <th className="border p-3 text-left">内容</th>
                      <th className="border p-3 text-left">发布时间</th>
                      <th className="border p-3 text-left">是否置顶</th>
                      <th className="border p-3 text-left">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {announcements.map(announcement => (
                      <tr key={announcement.id} className="hover:bg-gray-50">
                        <td className="border p-3">{announcement.id}</td>
                        <td className="border p-3">{announcement.title}</td>
                        <td className="border p-3 max-w-xs truncate" title={announcement.content}>
                          {announcement.content}
                        </td>
                        <td className="border p-3">{formatDate(announcement.created_at)}</td>
                        <td className="border p-3">{announcement.is_pinned ? '是' : '否'}</td>
                        <td className="border p-3">
                          <div className="flex gap-2">
                            <button 
                              className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                              onClick={() => {
                                alert('编辑功能开发中...')
                              }}
                            >
                              编辑
                            </button>
                            <button 
                              className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                              onClick={async () => {
                                if (!confirm('确定要删除此公告吗？')) {
                                  return
                                }
                                
                                try {
                                  const response = await fetch(`http://localhost:3001/api/admin/delete-announcement`, {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ id: announcement.id })
                                  })
                                  
                                  const data = await response.json()
                                  if (data.success) {
                                    alert('公告删除成功')
                                    fetchData('announcements', setAnnouncements)
                                  } else {
                                    alert('公告删除失败: ' + data.message)
                                  }
                                } catch (error) {
                                  console.error('公告删除失败:', error)
                                  alert('公告删除失败，请稍后重试')
                                }
                              }}
                            >
                              删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 题目管理 */}
          {activeTab === 'problems' && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">题目管理</h3>
              <div className="mb-6">
                <h4 className="font-semibold mb-2 text-gray-700">添加新题目</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="题目标题"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                    id="problemTitle"
                  />
                  <textarea
                    placeholder="题目内容"
                    rows={3}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                    id="problemContent"
                  ></textarea>
                  <textarea
                    placeholder="题目要求"
                    rows={2}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                    id="problemRequirements"
                  ></textarea>
                  <textarea
                    placeholder="评分标准"
                    rows={2}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                    id="problemScoring"
                  ></textarea>
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    onClick={async () => {
                      const title = document.getElementById('problemTitle').value
                      const content = document.getElementById('problemContent').value
                      const requirements = document.getElementById('problemRequirements').value
                      const scoringCriteria = document.getElementById('problemScoring').value
                      
                      if (!title || !content || !requirements || !scoringCriteria) {
                        alert('请填写完整的题目信息')
                        return
                      }
                      
                      try {
                        const response = await fetch('http://localhost:3001/api/admin/create-problem', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({ title, content, requirements, scoring_criteria: scoringCriteria })
                        })
                        
                        const data = await response.json()
                        if (data.success) {
                          alert('题目发布成功')
                          fetchData('problems', setProblems)
                          document.getElementById('problemTitle').value = ''
                          document.getElementById('problemContent').value = ''
                          document.getElementById('problemRequirements').value = ''
                          document.getElementById('problemScoring').value = ''
                        } else {
                          alert('题目发布失败: ' + data.message)
                        }
                      } catch (error) {
                        console.error('题目发布失败:', error)
                        alert('题目发布失败，请稍后重试')
                      }
                    }}
                  >
                    发布
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-3 text-left">ID</th>
                      <th className="border p-3 text-left">标题</th>
                      <th className="border p-3 text-left">内容</th>
                      <th className="border p-3 text-left">要求</th>
                      <th className="border p-3 text-left">评分标准</th>
                      <th className="border p-3 text-left">创建时间</th>
                      <th className="border p-3 text-left">更新时间</th>
                      <th className="border p-3 text-left">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {problems.map(problem => (
                      <tr key={problem.id} className="hover:bg-gray-50">
                        <td className="border p-3">{problem.id}</td>
                        <td className="border p-3">{problem.title}</td>
                        <td className="border p-3 max-w-xs truncate" title={problem.content}>
                          {problem.content}
                        </td>
                        <td className="border p-3 max-w-xs truncate" title={problem.requirements}>
                          {problem.requirements}
                        </td>
                        <td className="border p-3 max-w-xs truncate" title={problem.scoring_criteria}>
                          {problem.scoring_criteria}
                        </td>
                        <td className="border p-3">{formatDate(problem.created_at)}</td>
                        <td className="border p-3">{formatDate(problem.updated_at)}</td>
                        <td className="border p-3">
                          <div className="flex gap-2">
                            <button 
                              className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                              onClick={() => {
                                alert('编辑功能开发中...')
                              }}
                            >
                              编辑
                            </button>
                            <button 
                              className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                              onClick={async () => {
                                if (!confirm('确定要删除此题吗？')) {
                                  return
                                }
                                
                                try {
                                  const response = await fetch(`http://localhost:3001/api/admin/delete-problem`, {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ id: problem.id })
                                  })
                                  
                                  const data = await response.json()
                                  if (data.success) {
                                    alert('题目删除成功')
                                    fetchData('problems', setProblems)
                                  } else {
                                    alert('题目删除失败: ' + data.message)
                                  }
                                } catch (error) {
                                  console.error('题目删除失败:', error)
                                  alert('题目删除失败，请稍后重试')
                                }
                              }}
                            >
                              删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 比赛状态管理 */}
          {activeTab === 'competitionStatus' && (
            <div>
              <h3 className="text-xl font-bold mb-6 text-gray-800">比赛状态管理</h3>
              <div className="bg-gray-100 p-6 rounded-lg text-center">
                <h4 className="text-lg font-semibold mb-4 text-gray-700">当前比赛状态：{competitionStatus}</h4>
                <div className="flex justify-center gap-4">
                  <button 
                    className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-bold"
                    onClick={async () => {
                      try {
                        const response = await fetch('http://localhost:3001/api/admin/update-competition-status', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({ status: '进行中' })
                        })
                        
                        const data = await response.json()
                        if (data.success) {
                          alert('比赛已开始')
                          fetchData('competition-status', setCompetitionStatus)
                        } else {
                          alert('操作失败: ' + data.message)
                        }
                      } catch (error) {
                        console.error('操作失败:', error)
                        alert('操作失败，请稍后重试')
                      }
                    }}
                  >
                    开始比赛
                  </button>
                  <button 
                    className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-bold"
                    onClick={async () => {
                      try {
                        const response = await fetch('http://localhost:3001/api/admin/update-competition-status', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({ status: '已结束' })
                        })
                        
                        const data = await response.json()
                        if (data.success) {
                          alert('比赛已结束')
                          fetchData('competition-status', setCompetitionStatus)
                        } else {
                          alert('操作失败: ' + data.message)
                        }
                      } catch (error) {
                        console.error('操作失败:', error)
                        alert('操作失败，请稍后重试')
                      }
                    }}
                  >
                    结束比赛
                  </button>
                </div>
                <p className="mt-4 text-gray-600">
                  比赛状态变更后将实时反映在官网
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 代码查看器弹窗 */}
      {showCodeViewer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
            <div className="p-4 bg-gray-100 rounded-t-lg flex justify-between items-center border-b">
              <h3 className="text-lg font-bold text-gray-800">代码查看器</h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={closeCodeViewer}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <pre className="font-mono text-sm whitespace-pre-wrap">{currentCode}</pre>
            </div>
            <div className="p-4 bg-gray-100 rounded-b-lg flex justify-end border-t">
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                onClick={closeCodeViewer}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 页脚 */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4">本次大赛由星智计算举办</p>
          <p className="text-sm text-gray-400">© 2026 星智杯编程比赛. 保留所有权利.</p>
        </div>
      </footer>
    </div>
  )
}

export default Admin