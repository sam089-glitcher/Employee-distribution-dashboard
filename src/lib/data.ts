// Data processing utilities for HR Analytics Dashboard

export interface Employee {
  Employee_Name: string;
  EmpID: string;
  Department: string;
  Position: string;
  DateofHire: string;
  DateofTermination: string | null;
  Salary: number;
  EmploymentStatus: string;
  PerformanceScore: string; // 'Fully Meets', 'Exceeds', 'Needs Improvement', 'PIP'
  EngagementSurvey: number;
  EmpSatisfaction: number;
  Sex: string;
  MaritalDesc: string;
  State: string;
  // For backward compatibility, map to old interface
  EmployeeID: string;
  FullName: string;
  Role: string;
  HireDate: string;
  TerminationDate: string | null;
  CurrentSalary: number;
  Status: string;
  OverallEngagement: number;
  JobSatisfaction: number;
  PerformanceCategory: string;
  TenureYears: number;
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
  const headers = lines[0].split(',').map(h => h.replace(/^[\ufeff]/, '').trim()); // Remove BOM
  
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const rawEmployee: Record<string, unknown> = {};
    
    headers.forEach((header, index) => {
      const value = values[index]?.trim();
      rawEmployee[header] = convertValue(header, value);
    });
    
    // Map to unified interface for backward compatibility
    const employee: Employee = {
      ...rawEmployee,
      // Map new fields to old interface
      EmployeeID: rawEmployee.EmpID || '',
      FullName: rawEmployee.Employee_Name || '',
      Role: rawEmployee.Position || '',
      HireDate: rawEmployee.DateofHire || '',
      TerminationDate: rawEmployee.DateofTermination || null,
      CurrentSalary: rawEmployee.Salary || 0,
      Status: rawEmployee.EmploymentStatus === 'Active' ? 'Active' : 'Terminated',
      OverallEngagement: rawEmployee.EngagementSurvey || null,
      JobSatisfaction: rawEmployee.EmpSatisfaction || null,
      PerformanceCategory: rawEmployee.PerformanceScore || '', // This is the category field
      TenureYears: calculateTenure(rawEmployee.DateofHire as string),
    } as Employee;
    
    return employee;
  }).filter(emp => emp.EmployeeID && emp.EmployeeID.toString().trim() !== ''); // Filter out empty rows
}

// Calculate tenure from hire date
function calculateTenure(hireDateStr: string): number {
  if (!hireDateStr) return 0;
  try {
    const hireDate = new Date(hireDateStr);
    const now = new Date();
    const years = (now.getTime() - hireDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    return Math.max(0, years);
  } catch {
    return 0;
  }
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
  
  // Numeric fields (including new dataset fields)
  if (['Age', 'CurrentSalary', 'Salary', 'PerformanceScore', 'GoalsAchieved', 'GoalsSet', 
       'AchievementRate', 'OverallEngagement', 'JobSatisfaction', 'TenureYears',
       'EngagementSurvey', 'EmpSatisfaction'].includes(header)) {
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  }
  
  return value;
}

// Calculate dashboard metrics
export function calculateDashboardMetrics(employees: Employee[]): DashboardMetrics {
  const activeEmployees = employees.filter(emp => emp.Status === 'Active');
  const employeesWithEngagement = employees.filter(emp => emp.OverallEngagement !== null && emp.OverallEngagement > 0);
  const employeesWithTenure = employees.filter(emp => emp.TenureYears !== null && emp.TenureYears >= 0);
  
  // Convert performance categories to numeric scores for calculation
  const performanceScoreMap: Record<string, number> = {
    'Exceeds': 5,
    'Fully Meets': 4,
    'Needs Improvement': 3,
    'PIP': 2
  };
  
  const employeesWithPerformance = employees.filter(emp => 
    emp.PerformanceCategory && performanceScoreMap[emp.PerformanceCategory] !== undefined
  );
  
  return {
    totalEmployees: employees.length,
    activeEmployees: activeEmployees.length,
    averagePerformance: employeesWithPerformance.length > 0 
      ? employeesWithPerformance.reduce((sum, emp) => sum + performanceScoreMap[emp.PerformanceCategory], 0) / employeesWithPerformance.length
      : 0,
    turnoverRate: employees.length > 0 
      ? ((employees.length - activeEmployees.length) / employees.length) * 100 
      : 0,
    averageTenure: employeesWithTenure.length > 0
      ? employeesWithTenure.reduce((sum, emp) => sum + emp.TenureYears, 0) / employeesWithTenure.length
      : 0,
    averageEngagement: employeesWithEngagement.length > 0
      ? employeesWithEngagement.reduce((sum, emp) => sum + emp.OverallEngagement, 0) / employeesWithEngagement.length
      : 0,
    highPerformers: employeesWithPerformance.filter(emp => 
      emp.PerformanceCategory === 'Exceeds' || emp.PerformanceCategory === 'Fully Meets'
    ).length
  };
}

// Calculate department statistics
export function calculateDepartmentStats(employees: Employee[]): DepartmentStats[] {
  const departments = [...new Set(employees.map(emp => emp.Department))].filter(d => d && d.trim() !== '');
  
  const performanceScoreMap: Record<string, number> = {
    'Exceeds': 5,
    'Fully Meets': 4,
    'Needs Improvement': 3,
    'PIP': 2
  };
  
  return departments.map(dept => {
    const deptEmployees = employees.filter(emp => emp.Department === dept);
    const activeDeptEmployees = deptEmployees.filter(emp => emp.Status === 'Active');
    const deptWithPerformance = activeDeptEmployees.filter(emp => 
      emp.PerformanceCategory && performanceScoreMap[emp.PerformanceCategory] !== undefined
    );
    const deptWithEngagement = activeDeptEmployees.filter(emp => 
      emp.OverallEngagement !== null && emp.OverallEngagement > 0
    );
    
    return {
      department: dept,
      employeeCount: activeDeptEmployees.length,
      averagePerformance: deptWithPerformance.length > 0
        ? deptWithPerformance.reduce((sum, emp) => sum + performanceScoreMap[emp.PerformanceCategory], 0) / deptWithPerformance.length
        : 0,
      averageSalary: activeDeptEmployees.length > 0
        ? activeDeptEmployees.reduce((sum, emp) => sum + (emp.CurrentSalary || 0), 0) / activeDeptEmployees.length
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
  const employeesWithPerformance = employees.filter(emp => {
    const hasCategory = emp.PerformanceCategory && emp.PerformanceCategory.trim() !== '' && emp.PerformanceCategory !== 'null' && emp.PerformanceCategory !== 'undefined';
    return hasCategory;
  });
  
  const total = employeesWithPerformance.length;
  
  if (total === 0) {
    return [];
  }
  
  // Get unique categories from actual data
  const uniqueCategories = [...new Set(employeesWithPerformance.map(emp => emp.PerformanceCategory))];
  
  // Updated colors for actual HR dataset performance categories
  const colors: Record<string, string> = {
    'Fully Meets': '#70ad47',      // Green - Good performance
    'Exceeds': '#4CAF50',          // Bright green - Excellent
    'Needs Improvement': '#ff9900', // Orange - Needs work
    'PIP': '#c5504b',              // Red - Performance improvement plan
  };
  
  const result = uniqueCategories.map(category => {
    const count = employeesWithPerformance.filter(emp => emp.PerformanceCategory === category).length;
    return {
      category,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
      color: colors[category] || '#6B7280' // Default gray color for unknown categories
    };
  }).filter(item => item.count > 0).sort((a, b) => b.count - a.count);
  
  return result;
}

// Get top performers
export function getTopPerformers(employees: Employee[], limit: number = 10): Employee[] {
  const performanceScoreMap: Record<string, number> = {
    'Exceeds': 5,
    'Fully Meets': 4,
    'Needs Improvement': 3,
    'PIP': 2
  };
  
  return employees
    .filter(emp => emp.PerformanceCategory && performanceScoreMap[emp.PerformanceCategory] !== undefined && emp.Status === 'Active')
    .sort((a, b) => performanceScoreMap[b.PerformanceCategory] - performanceScoreMap[a.PerformanceCategory])
    .slice(0, limit);
}

// Get performance by tenure
export function getPerformanceByTenure(employees: Employee[]) {
  const performanceScoreMap: Record<string, number> = {
    'Exceeds': 5,
    'Fully Meets': 4,
    'Needs Improvement': 3,
    'PIP': 2
  };
  
  const employeesWithData = employees.filter(emp => 
    emp.TenureYears !== null && emp.PerformanceCategory && performanceScoreMap[emp.PerformanceCategory] !== undefined
  );
  
  return employeesWithData.map(emp => ({
    name: emp.FullName,
    tenure: emp.TenureYears,
    performance: performanceScoreMap[emp.PerformanceCategory],
    salary: emp.CurrentSalary,
    department: emp.Department
  }));
}

// Get satisfaction vs performance correlation
export function getSatisfactionPerformanceCorrelation(employees: Employee[]) {
  const performanceScoreMap: Record<string, number> = {
    'Exceeds': 5,
    'Fully Meets': 4,
    'Needs Improvement': 3,
    'PIP': 2
  };
  
  return employees
    .filter(emp => emp.OverallEngagement !== null && emp.PerformanceCategory && performanceScoreMap[emp.PerformanceCategory] !== undefined)
    .map(emp => ({
      name: emp.FullName,
      satisfaction: emp.OverallEngagement,
      performance: performanceScoreMap[emp.PerformanceCategory],
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
