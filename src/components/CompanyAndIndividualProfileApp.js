import React, { useState } from 'react';
import { fetchProfiles } from '../api/profileApi'; // Adjust the path if needed

export default function CompanyAndIndividualProfileApp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [loading, setLoading] = useState(false);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [individualProfile, setIndividualProfile] = useState(null);

  const handleFetchProfiles = async () => {
    setLoading(true);
    try {
      const data = await fetchProfiles({ name, email, companyName, companyWebsite });
      setCompanyProfile(data.companyProfile);
      setIndividualProfile(data.individualProfile);
    } catch (error) {
      // Handle error (e.g., show a notification)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Profile Generator</h2>
      <div className="space-y-4">
        <div>
          <label>Name</label>
          <input
            className="border p-2 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Email</label>
          <input
            className="border p-2 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Company Name</label>
          <input
            className="border p-2 w-full"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
        <div>
          <label>Company Website</label>
          <input
            className="border p-2 w-full"
            value={companyWebsite}
            onChange={(e) => setCompanyWebsite(e.target.value)}
          />
        </div>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
          onClick={handleFetchProfiles}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Profile'}
        </button>
      </div>

      {companyProfile && (
        <div className="mt-4">
          <h3 className="font-bold">Company Profile</h3>
          <pre>{JSON.stringify(companyProfile, null, 2)}</pre>
        </div>
      )}

      {individualProfile && (
        <div className="mt-4">
          <h3 className="font-bold">Individual Profile</h3>
          <pre>{JSON.stringify(individualProfile, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
