'use client'

import { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter
} from 'recharts';
import { Users, TrendingUp, Clock, UserCheck, Target, Heart } from 'lucide-react';
import { KPICard } from './ui/kpi-card';
import {
  parseCSV,
  calculateDashboardMetrics,
  calculateDepartmentStats,
  calculatePerformanceDistribution,
  getTopPerformers,
  getPerformanceByTenure,
  formatNumber,
  formatCurrency,
  formatPercentage,
  type Employee
} from '@/lib/data';
import { getDepartmentColor } from '@/lib/utils';

export function Dashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/hr_analytics_sample.csv');
        const csvText = await response.text();
        const parsedEmployees = parseCSV(csvText);
        setEmployees(parsedEmployees);
      } catch (err) {
        setError('Failed to load employee data');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const metrics = calculateDashboardMetrics(employees);
  const departmentStats = calculateDepartmentStats(employees);
  const performanceDistribution = calculatePerformanceDistribution(employees);
  const topPerformers = getTopPerformers(employees);
  const tenurePerformanceData = getPerformanceByTenure(employees);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Employee Performance Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Real-time insights into workforce performance and engagement</p>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <KPICard
            title="Total Employees"
            value={metrics.totalEmployees}
            subtitle="Active workforce"
            icon={<Users className="h-6 w-6 text-blue-600" />}
          />
          <KPICard
            title="Active Employees"
            value={metrics.activeEmployees}
            subtitle={`${formatPercentage((metrics.activeEmployees / metrics.totalEmployees) * 100)} retention`}
            icon={<UserCheck className="h-6 w-6 text-green-600" />}
          />
          <KPICard
            title="Avg Performance"
            value={formatNumber(metrics.averagePerformance)}
            subtitle="out of 5.0"
            icon={<TrendingUp className="h-6 w-6 text-blue-600" />}
          />
          <KPICard
            title="Turnover Rate"
            value={formatPercentage(metrics.turnoverRate)}
            subtitle="This period"
            icon={<Target className="h-6 w-6 text-orange-600" />}
          />
          <KPICard
            title="Avg Tenure"
            value={formatNumber(metrics.averageTenure)}
            subtitle="years"
            icon={<Clock className="h-6 w-6 text-purple-600" />}
          />
          <KPICard
            title="Engagement"
            value={formatNumber(metrics.averageEngagement)}
            subtitle="out of 5.0"
            icon={<Heart className="h-6 w-6 text-red-600" />}
          />
        </div>

        {/* Main Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Department Performance */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance by Department</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="department" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={12}
                  />
                  <YAxis domain={[0, 5]} />
                  <Tooltip 
                    formatter={(value: number) => [formatNumber(value), 'Avg Performance']}
                  />
                  <Bar 
                    dataKey="averagePerformance" 
                    fill="#2e75b6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Performance Distribution */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={performanceDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {performanceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [value, 'Employees']}
                    labelFormatter={(label) => `${label}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              {performanceDistribution.map((item) => (
                <div key={item.category} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">
                    {item.category} ({item.count})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Secondary Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Department Employee Count */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Employees by Department</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentStats} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    dataKey="department" 
                    type="category" 
                    width={100}
                    fontSize={12}
                  />
                  <Tooltip 
                    formatter={(value: number) => [value, 'Employees']}
                  />
                  <Bar 
                    dataKey="employeeCount" 
                    fill="#70ad47"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tenure vs Performance */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tenure vs Performance</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={tenurePerformanceData.slice(0, 50)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="tenure" 
                    name="Tenure"
                    label={{ value: 'Years of Tenure', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis 
                    dataKey="performance" 
                    name="Performance"
                    domain={[0, 5]}
                    label={{ value: 'Performance Score', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border rounded-lg shadow-lg">
                            <p className="font-semibold">{data.name}</p>
                            <p>Department: {data.department}</p>
                            <p>Tenure: {formatNumber(data.tenure)} years</p>
                            <p>Performance: {formatNumber(data.performance)}</p>
                            <p>Salary: {formatCurrency(data.salary)}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter 
                    dataKey="performance" 
                    fill="#2e75b6"
                    fillOpacity={0.6}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Performers Table */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tenure
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Engagement
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topPerformers.map((employee) => (
                  <tr key={employee.EmployeeID}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{employee.FullName}</div>
                      <div className="text-sm text-gray-500">{employee.Email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: getDepartmentColor(employee.Department) }}
                      >
                        {employee.Department}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.Role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {formatNumber(employee.PerformanceScore)}
                        </div>
                        <div className="ml-2">
                          <div className="w-12 h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 rounded-full"
                              style={{ 
                                width: `${(employee.PerformanceScore / 5) * 100}%`,
                                backgroundColor: '#70ad47'
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.TenureYears ? formatNumber(employee.TenureYears) : 'N/A'} years
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.OverallEngagement ? formatNumber(employee.OverallEngagement) : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Department Statistics */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departmentStats.map((dept) => (
              <div key={dept.department} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{dept.department}</h4>
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getDepartmentColor(dept.department) }}
                  ></div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Employees:</span>
                    <span className="text-sm font-medium">{dept.employeeCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avg Performance:</span>
                    <span className="text-sm font-medium">{formatNumber(dept.averagePerformance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avg Salary:</span>
                    <span className="text-sm font-medium">{formatCurrency(dept.averageSalary)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Engagement:</span>
                    <span className="text-sm font-medium">{formatNumber(dept.averageEngagement)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Turnover:</span>
                    <span className="text-sm font-medium">{formatPercentage(dept.turnoverRate)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
