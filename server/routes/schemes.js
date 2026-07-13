const router = require('express').Router();

const schemes = [
  { id: 1, name: 'PM-KISAN', fullName: 'Pradhan Mantri Kisan Samman Nidhi', benefit: '₹6,000/year', description: 'Direct income support of ₹6000 per year to farmer families in three equal installments of ₹2000 each.', eligibility: ['Small and marginal farmers', 'Land ownership required', 'Not applicable to institutional land holders'], documents: ['Aadhar Card', 'Land Records (Khasra/Khatauni)', 'Bank Account Details'], category: 'income', ministry: 'Agriculture & Farmers Welfare', status: 'active' },
  { id: 2, name: 'PMFBY', fullName: 'Pradhan Mantri Fasal Bima Yojana', benefit: 'Up to ₹2 lakh coverage', description: 'Crop insurance scheme that provides financial support to farmers suffering crop loss due to unforeseen events.', eligibility: ['All farmers growing notified crops', 'Loanee and non-loanee farmers', 'Sharecroppers included'], documents: ['Land Records', 'Sowing Certificate', 'Bank Details', 'Aadhar Card'], category: 'insurance', ministry: 'Agriculture & Farmers Welfare', status: 'active' },
  { id: 3, name: 'Soil Health Card', fullName: 'Soil Health Card Scheme', benefit: 'Free soil testing', description: 'Government provides soil health cards to farmers with crop-wise recommendations on nutrients and fertilizers.', eligibility: ['All farmers', 'No income limit', 'Both small and large farmers'], documents: ['Aadhar Card', 'Land Records'], category: 'soil', ministry: 'Agriculture & Farmers Welfare', status: 'active' },
  { id: 4, name: 'KCC', fullName: 'Kisan Credit Card', benefit: 'Credit up to ₹3 lakh at 4%', description: 'Provides farmers with timely credit for agricultural needs at reduced interest rate of 4% per annum.', eligibility: ['All farmers', 'Allied activities farmers', 'Self Help Group members'], documents: ['Land Records', 'Identity Proof', 'Address Proof', 'Passport Photo'], category: 'credit', ministry: 'Finance', status: 'active' },
  { id: 5, name: 'PM KUSUM', fullName: 'PM Kisan Urja Suraksha evam Utthan Mahabhiyan', benefit: '90% subsidy on solar pumps', description: 'Scheme to install solar pumps for irrigation, providing upto 90% subsidy to farmers.', eligibility: ['All farmers', 'Land ownership or lease', 'No prior solar pump'], documents: ['Aadhar', 'Land Records', 'Bank Details'], category: 'irrigation', ministry: 'New & Renewable Energy', status: 'active' },
  { id: 6, name: 'eNAM', fullName: 'Electronic National Agriculture Market', benefit: 'Better price discovery', description: 'Online trading platform for agricultural commodities providing farmers better prices through competition.', eligibility: ['All farmers', 'Must register at local mandi'], documents: ['Aadhar Card', 'Bank Account', 'Mobile Number'], category: 'market', ministry: 'Agriculture & Farmers Welfare', status: 'active' },
];

router.get('/', (req, res) => {
  const { category } = req.query;
  let filtered = schemes;
  if (category) filtered = schemes.filter(s => s.category === category);
  res.json({ schemes: filtered });
});

router.get('/:id', (req, res) => {
  const scheme = schemes.find(s => s.id === parseInt(req.params.id));
  if (!scheme) return res.status(404).json({ error: 'Scheme not found' });
  res.json({ scheme });
});

module.exports = router;
