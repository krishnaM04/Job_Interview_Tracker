import mockData from '../api/mockData';

export const getCompanies = async (params = {}) => {
  await new Promise(r => setTimeout(r, 300));
  let companies = mockData.companies;
  if (params.search) {
    companies = companies.filter(c => 
      c.name.toLowerCase().includes(params.search.toLowerCase())
    );
  }
  return { data: companies, status: 200 };
};

export const getCompanyById = async (id) => {
  await new Promise(r => setTimeout(r, 200));
  const company = mockData.companies.find(c => c.id === id);
  return { data: company, status: company ? 200 : 404 };
};

export const searchCompanies = async (query) => {
  await new Promise(r => setTimeout(r, 250));
  const results = mockData.companies.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.industry.toLowerCase().includes(query.toLowerCase())
  );
  return { data: results, status: 200 };
};

export const compareCompanies = async (companyIds) => {
  await new Promise(r => setTimeout(r, 300));
  const companies = mockData.companies.filter(c => companyIds.includes(c.id));
  return { data: companies, status: 200 };
};

export const getCompanyApplicationHistory = async (companyId) => {
  await new Promise(r => setTimeout(r, 250));
  const applications = mockData.applications.filter(a => {
    const company = mockData.companies.find(c => c.id === companyId);
    return a.companyName === company?.name;
  });
  return { data: applications, status: 200 };
};

export const getCompanyReviews = async (companyId) => {
  await new Promise(r => setTimeout(r, 250));
  const company = mockData.companies.find(c => c.id === companyId);
  return {
    data: {
      rating: company?.rating || 4.0,
      reviewCount: company?.reviews || 100,
      reviews: [
        { author: 'User1', rating: 5, text: 'Great company culture' },
        { author: 'User2', rating: 4, text: 'Good pay, demanding work' }
      ]
    },
    status: 200
  };
};

export const addCompany = async (companyData) => {
  await new Promise(r => setTimeout(r, 300));
  const newCompany = {
    id: mockData.companies.length + 1,
    ...companyData
  };
  mockData.companies.push(newCompany);
  return { data: newCompany, status: 201 };
};
