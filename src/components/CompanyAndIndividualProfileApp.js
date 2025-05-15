import React, { useState } from 'react';
import { Card, CardContent, Button, Input, Label } from '@/components/ui';

export default function CompanyAndIndividualProfileApp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [loading, setLoading] = useState(false);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [individualProfile, setIndividualProfile] = useState(null);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/getProfiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, companyName, companyWebsite })
      });

      const data = await response.json();
      setCompanyProfile(data.companyProfile);
      setIndividualProfile(data.individualProfile);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold mb-4">Profile Generator</h2>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label>Company Name</Label>
              <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
            <div>
              <Label>Company Website</Label>
              <Input value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} />
            </div>
            <Button onClick={fetchProfiles} disabled={loading}>
              {loading ? 'Generating...' : 'Generate Profile'}
            </Button>
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
        </CardContent>
      </Card>
    </div>
  );
}

// API Route for Google Gemini Integration
export async function getProfiles(req, res) {
  const { name, email, companyName, companyWebsite } = req.body;

  try {
    const geminiResponse = await fetch('https://gemini.googleapis.com/v1/profiles', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GOOGLE_GEMINI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, companyName, companyWebsite })
    });

    const geminiData = await geminiResponse.json();

    const companyProfile = geminiData.company || {};
    const individualProfile = geminiData.individual || {};

    res.status(200).json({ companyProfile, individualProfile });
  } catch (error) {
    console.error('Error fetching Gemini data:', error);
    res.status(500).json({ error: 'Failed to fetch profiles.' });
  }
}
