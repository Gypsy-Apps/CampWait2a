import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useFormValidation } from '../hooks/useFormValidation';
import { ProfileForm } from '../components/forms/ProfileForm';
import type { ProfileFormData } from '../types/forms';

export default function CreateProfile() {
  const navigate = useNavigate();
  const { validateEmail, validatePassword, validatePhone } = useFormValidation();
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: '',
    email: '',
    password: '',
    companyName: '',
    companyPhone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!validatePassword(formData.password)) {
      setError('Password must be at least 8 characters long');
      return;
    }
    if (!validatePhone(formData.companyPhone)) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            company_name: formData.companyName,
            company_phone: formData.companyPhone,
          }
        }
      });

      if (signUpError) throw signUpError;

      navigate('/login');
    } catch (err) {
      setError('Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your profile
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <ProfileForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            error={error}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}