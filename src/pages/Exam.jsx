import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Editor from '@monaco-editor/react'

function Exam() {
  const navigate = useNavigate()
  const [selectedProblem, setSelectedProblem] = useState(1)
  const [selectedLanguage, setSelectedLanguage] = useState('python')
  const [code, setCode] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [switchCount, setSwitchCount] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // 从API获取题目数据
  const [problems, setProblems] = useState([])
  const [competitionStatus, setCompetitionStatus] = useState('未开始')

  useEffect(() => {
    // 检查比赛状态
    fetch('http://localhost:3001/api/admin/competition-status')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setCompetitionStatus(data.data)
          // 如果比赛未开始，禁止访问
          if (data.data !== '进行中') {
            alert('比赛尚未开始，无法访问考试系统')
            navigate('/')
          }
        }
      })
      .catch(error => {
        console.error('获取比赛状态失败:', error)
      })

    // 从后端API获取题目数据
    fetch('http://localhost:3001/api/admin/problems')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setProblems(data.data)
        }
      })
      .catch(error => {
        console.error('获取题目失败:', error)
        // 失败时返回空数组，不使用默认数据
        setProblems([])
      })

    // 检查是否已经登录过
    const hasLoggedIn = localStorage.getItem('examLoggedIn')
    if (hasLoggedIn) {
      alert('您已经登录过考试系统，不能重复登录')
      navigate('/')
    } else {
      // 标记为已登录
      localStorage.setItem('examLoggedIn', 'true')
    }

    // 进入全屏模式
    const enterFullscreen = () => {
      const elem = document.documentElement
      if (elem.requestFullscreen) {
        elem.requestFullscreen()
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen()
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen()
      }
      setIsFullscreen(true)
    }

    // 调用进入全屏
    enterFullscreen()

    // 监听切屏事件
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // 切屏，增加计数
        const newCount = switchCount + 1
        setSwitchCount(newCount)
        
        if (newCount >= 2) {
          // 切屏超过2次，禁止参赛
          alert('切屏次数超过限制，禁止参赛')
          navigate('/')
        } else {
          alert(`切屏警告！当前切屏次数: ${newCount}/2`)
        }
      }
    }

    // 监听全屏变化
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      )
    }

    // 添加事件监听器
    document.addEventListener('visibilitychange', handleVisibilityChange)
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('msfullscreenchange', handleFullscreenChange)

    // 清理函数
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('msfullscreenchange', handleFullscreenChange)
    }
  }, [navigate, switchCount])

  const handleSubmit = async () => {
    if (!code.trim()) {
      alert('请输入代码')
      return
    }
    
    try {
      // 获取用户ID（实际应用中应该从登录状态获取）
      const userId = localStorage.getItem('userId') || 'test-user'
      
      // 调用后端API提交代码
      const response = await fetch('http://localhost:3001/api/submit-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          problem_id: selectedProblem,
          language: selectedLanguage,
          code: code
        })
      })
      
      const data = await response.json()
      if (data.success) {
        setSubmitted(true)
        setTimeout(() => {
          setSubmitted(false)
        }, 2000)
        alert('代码提交成功')
      } else {
        alert('代码提交失败: ' + data.message)
      }
    } catch (error) {
      console.error('代码提交失败:', error)
      alert('代码提交失败，请稍后重试')
    }
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

      {/* 考试内容 */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* 题目列表 */}
          <div className="md:w-1/4 bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">题目列表</h3>
            <ul className="space-y-2">
              {problems.map(problem => (
                <li key={problem.id}>
                  <button
                    onClick={() => {
                      setSelectedProblem(problem.id)
                      setCode('')
                    }}
                    className={`w-full text-left p-3 rounded-md transition-colors ${
                      selectedProblem === problem.id
                        ? 'bg-blue-100 text-blue-600 font-medium'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    题目 {problem.id}: {problem.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 题目内容和代码编辑器 */}
          <div className="md:w-3/4 flex flex-col gap-6">
            {/* 题目内容 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              {problems.map(problem => {
                if (problem.id === selectedProblem) {
                  return (
                    <div key={problem.id}>
                      <h3 className="text-xl font-bold mb-4 text-gray-800">
                        题目 {problem.id}: {problem.title}
                      </h3>
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-700 mb-2">题目描述：</h4>
                        <p className="text-gray-600">{problem.content}</p>
                      </div>
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-700 mb-2">要求：</h4>
                        <p className="text-gray-600">{problem.requirements}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">评分标准：</h4>
                        <p className="text-gray-600">{problem.scoringCriteria}</p>
                      </div>
                    </div>
                  )
                }
                return null
              })}
            </div>

            {/* 代码编辑器 */}
            <div className="bg-white p-6 rounded-lg shadow-md flex-1">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">代码编辑</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedLanguage('python')}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      selectedLanguage === 'python'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    Python
                  </button>
                  <button
                    onClick={() => setSelectedLanguage('cpp')}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      selectedLanguage === 'cpp'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    C++
                  </button>
                </div>
              </div>
              
              <div className="h-[400px] border rounded-md">
                <Editor
                  height="100%"
                  defaultLanguage={selectedLanguage === 'python' ? 'python' : 'cpp'}
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  options={{
                    minimap: { enabled: true },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    tabSize: 4
                  }}
                />
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={submitted}
                  className={`px-6 py-2 rounded-md transition-colors ${
                    submitted
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {submitted ? '提交中...' : '提交代码'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default Exam