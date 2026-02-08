import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Home() {
  const [announcements, setAnnouncements] = useState([])

  // 格式化时间函数
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  useEffect(() => {
    // 从后端API获取公告数据
    fetch('http://localhost:3001/api/announcements')
      .then(response => response.json())
      .then(data => setAnnouncements(data))
      .catch(error => {
        console.error('获取公告失败:', error)
        // 失败时返回空数据，不使用默认数据
        setAnnouncements([])
      })
  }, [])

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

      {/* 比赛信息展示区 */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">比赛介绍</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">比赛概述</h3>
              <p className="text-gray-700">
                星智杯是一项面向全国的公益网络大型编程比赛，旨在激发青少年对编程的兴趣，培养创新思维和解决问题的能力。
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">赛制说明</h3>
              <p className="text-gray-700 mb-2">• 比赛分为省赛和国赛两个阶段</p>
              <p className="text-gray-700 mb-2">• 省赛优胜者晋级国赛</p>
              <p className="text-gray-700">• 国赛将评选出最终奖项</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">参赛流程</h3>
              <p className="text-gray-700 mb-2">1. 在线报名</p>
              <p className="text-gray-700 mb-2">2. 参加省赛</p>
              <p className="text-gray-700 mb-2">3. 晋级国赛</p>
              <p className="text-gray-700">4. 领取奖项</p>
            </div>
          </div>
        </div>
      </section>

      {/* 奖项设置说明区 */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">奖项设置</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="border p-4 text-left">奖项</th>
                  <th className="border p-4 text-left">奖金金额</th>
                  <th className="border p-4 text-left">数量</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="border p-4">一等奖</td>
                  <td className="border p-4">15元</td>
                  <td className="border p-4">1名</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-4">二等奖</td>
                  <td className="border p-4">10元</td>
                  <td className="border p-4">3名</td>
                </tr>
                <tr className="bg-white">
                  <td className="border p-4">三等奖</td>
                  <td className="border p-4">5元</td>
                  <td className="border p-4">5名</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-4">优秀奖</td>
                  <td className="border p-4">无</td>
                  <td className="border p-4">20名</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-gray-600 italic">
            本届奖金数额有限，下一届比赛将大幅提高奖金金额
          </p>
        </div>
      </section>

      {/* 重要时间节点展示区 */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">重要时间节点</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg shadow-md text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">9月3日</div>
              <div className="text-gray-700">开赛时间</div>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow-md text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">9月15日</div>
              <div className="text-gray-700">报名截止时间</div>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow-md text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">9月30日</div>
              <div className="text-gray-700">结果公布时间</div>
            </div>
          </div>
        </div>
      </section>

      {/* 防作弊声明区 */}
      <section className="py-12 bg-red-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">防作弊声明</h2>
          <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
            <p className="text-xl text-center text-red-600 font-bold mb-4">
              本比赛采用专业防作弊系统，确保比赛公平公正
            </p>
            <p className="text-gray-700 text-center">
              我们将通过IP监控、代码查重、AI代码检测等多种手段，严厉打击作弊行为，
              确保比赛的公平性和公正性。一旦发现作弊行为，将取消参赛资格。
            </p>
          </div>
        </div>
      </section>

      {/* 公告展示区 */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">最新公告</h2>
          <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
            {announcements.map(announcement => (
              <div key={announcement.id} className="mb-4 pb-4 border-b last:border-b-0">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-blue-600">{announcement.title}</h3>
                  <span className="text-sm text-gray-500">{formatDate(announcement.created_at)}</span>
                </div>
                <p className="text-gray-700">{announcement.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 报名入口 */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">立即报名</h2>
          <p className="text-xl mb-8">加入星智杯，展现你的编程才华！</p>
          <Link to="/register">
            <button className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-100 transition-colors">
              开始报名
            </button>
          </Link>
        </div>
      </section>

      {/* 主办方声明 */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4">本次大赛由星智计算举办</p>
          <p className="text-sm text-gray-400">© 2026 星智杯编程比赛. 保留所有权利.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home