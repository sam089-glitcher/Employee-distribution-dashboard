// Data processing utilities for HR Analytics Dashboard

export interface Employee {
  EmployeeID: string;
  FirstName: string;
  LastName: string;
  FullName: string;
  Email: string;
  Department: string;
  Role: string;
  HireDate: string;
  TerminationDate: string | null;
  Age: number;
  Gender: string;
  CurrentSalary: number;
  Status: 'Active' | 'Terminated';
  PerformanceScore: number;
  GoalsAchieved: number;
  GoalsSet: number;
  AchievementRate: number;
  OverallEngagement: number;
  JobSatisfaction: number;
  TenureYears: number;
  TenureCategory: string;
  PerformanceCategory: string;
}

export interface DashboardMetrics {
  totalEmployees: number;
  activeEmployees: number;
  averagePerformance: number;
  turnoverRate: number;
  averageTenure: number;
  averageEngagement: number;
  highPerformers: number;
}

export interface DepartmentStats {
  department: string;
  employeeCount: number;
  averagePerformance: number;
  averageSalary: number;
  averageEngagement: number;
  turnoverRate: number;
}

export interface PerformanceDistribution {
  category: string;
  count: number;
  percentage: number;
  color: string;
}

// Parse CSV data
export function parseCSV(csvText: string): Employee[] {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const employee: Record<string, unknown> = {};
    
    headers.forEach((header, index) => {
      const value = values[index]?.trim();
      employee[header] = convertValue(header, value);
    });
    
    return employee as unknown as Employee;
  }).filter(emp => emp.EmployeeID); // Filter out empty rows
}

function parseCSVLine(line: string): string[] {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}

function convertValue(header: string, value: string): unknown {
  if (!value || value === '') return null;
  
  // Numeric fields
  if (['Age', 'CurrentSalary', 'PerformanceScore', 'GoalsAchieved', 'GoalsSet', 
       'AchievementRate', 'OverallEngagement', 'JobSatisfaction', 'TenureYears'].includes(header)) {
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  }
  
  return value;
}

// Calculate dashboard metrics
export function calculateDashboardMetrics(employees: Employee[]): DashboardMetrics {
  const activeEmployees = employees.filter(emp => emp.Status === 'Active');
  const employeesWithPerformance = employees.filter(emp => emp.PerformanceScore !== null);
  const employeesWithEngagement = employees.filter(emp => emp.OverallEngagement !== null);
  
  return {
    totalEmployees: employees.length,
    activeEmployees: activeEmployees.length,
    averagePerformance: employeesWithPerformance.length > 0 
      ? employeesWithPerformance.reduce((sum, emp) => sum + emp.PerformanceScore, 0) / employeesWithPerformance.length
      : 0,
    turnoverRate: employees.length > 0 
      ? ((employees.length - activeEmployees.length) / employees.length) * 100 
      : 0,
    averageTenure: employees.filter(emp => emp.TenureYears !== null).length > 0
      ? employees.filter(emp => emp.TenureYears !== null).reduce((sum, emp) => sum + emp.TenureYears, 0) / 
        employees.filter(emp => emp.TenureYears !== null).length
      : 0,
    averageEngagement: employeesWithEngagement.length > 0
      ? employeesWithEngagement.reduce((sum, emp) => sum + emp.OverallEngagement, 0) / employeesWithEngagement.length
      : 0,
    highPerformers: employeesWithPerformance.filter(emp => emp.PerformanceScore >= 4).length
  };
}

// Calculate department statistics
export function calculateDepartmentStats(employees: Employee[]): DepartmentStats[] {
  const departments = [...new Set(employees.map(emp => emp.Department))];
  
  return departments.map(dept => {
    const deptEmployees = employees.filter(emp => emp.Department === dept);
    const activeDeptEmployees = deptEmployees.filter(emp => emp.Status === 'Active');
    const deptWithPerformance = deptEmployees.filter(emp => emp.PerformanceScore !== null);
    const deptWithEngagement = deptEmployees.filter(emp => emp.OverallEngagement !== null);
    
    return {
      department: dept,
      employeeCount: activeDeptEmployees.length,
      averagePerformance: deptWithPerformance.length > 0
        ? deptWithPerformance.reduce((sum, emp) => sum + emp.PerformanceScore, 0) / deptWithPerformance.length
        : 0,
      averageSalary: activeDeptEmployees.length > 0
        ? activeDeptEmployees.reduce((sum, emp) => sum + emp.CurrentSalary, 0) / activeDeptEmployees.length
        : 0,
      averageEngagement: deptWithEngagement.length > 0
        ? deptWithEngagement.reduce((sum, emp) => sum + emp.OverallEngagement, 0) / deptWithEngagement.length
        : 0,
      turnoverRate: deptEmployees.length > 0
        ? ((deptEmployees.length - activeDeptEmployees.length) / deptEmployees.length) * 100
        : 0
    };
  }).sort((a, b) => b.employeeCount - a.employeeCount);
}

// Calculate performance distribution
export function calculatePerformanceDistribution(employees: Employee[]): PerformanceDistribution[] {
  const employeesWithPerformance = employees.filter(emp => emp.PerformanceCategory);
  const total = employeesWithPerformance.length;
  
  const categories = ['Poor', 'Below Average', 'Average', 'Excellent'];
  const colors = {
    'Poor': '#c5504b',
    'Below Average': '#ff9900', 
    'Average': '#ffc000',
    'Excellent': '#70ad47'
  };
  
  return categories.map(category => {
    const count = employeesWithPerformance.filter(emp => emp.PerformanceCategory === category).length;
    return {
      category,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
      color: colors[category as keyof typeof colors]
    };
  }).filter(item => item.count > 0);
}

// Get top performers
export function getTopPerformers(employees: Employee[], limit: number = 10): Employee[] {
  return employees
    .filter(emp => emp.PerformanceScore !== null && emp.Status === 'Active')
    .sort((a, b) => b.PerformanceScore - a.PerformanceScore)
    .slice(0, limit);
}

// Get performance by tenure
export function getPerformanceByTenure(employees: Employee[]) {
  const employeesWithData = employees.filter(emp => 
    emp.TenureYears !== null && emp.PerformanceScore !== null
  );
  
  return employeesWithData.map(emp => ({
    name: emp.FullName,
    tenure: emp.TenureYears,
    performance: emp.PerformanceScore,
    salary: emp.CurrentSalary,
    department: emp.Department
  }));
}

// Get satisfaction vs performance correlation
export function getSatisfactionPerformanceCorrelation(employees: Employee[]) {
  return employees
    .filter(emp => emp.OverallEngagement !== null && emp.PerformanceScore !== null)
    .map(emp => ({
      name: emp.FullName,
      satisfaction: emp.OverallEngagement,
      performance: emp.PerformanceScore,
      tenure: emp.TenureYears,
      department: emp.Department
    }));
}

// Format numbers for display
export function formatNumber(num: number, decimals: number = 1): string {
  return num.toFixed(decimals);
}

export function formatCurrency(num: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatPercentage(num: number): string {
  return `${num.toFixed(1)}%`;
}
