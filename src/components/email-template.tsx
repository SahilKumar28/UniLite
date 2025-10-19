import * as React from 'react';

interface EmailTemplateProps {
  username: string;
  otp: string;
}

export default function EmailTemplate({ username, otp }: EmailTemplateProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', color: '#333' }}>
      <h1>Welcome, {username}!</h1>
      <p>Your OTP for verification is:</p>
      <h2 style={{ color: '#ff4b5c' }}>{otp}</h2>
      <p>Please do not share this OTP with anyone.</p>
    </div>
  );
}
