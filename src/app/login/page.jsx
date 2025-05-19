'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { loginAPI, registerAPI } from '@/services/allAPI';

export default function Page() {
  const [isRegister, setIsRegister] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [visited, setVisited] = useState({
    name: false,
    email: false,
    password: false,
  });
  const router = useRouter();

  const validateName = () => {
    let nameError = '';
    if (!isRegister && !userData.name.trim()) {
      nameError = 'Name is required';
    } else if (!isRegister && userData.name.length < 2) {
      nameError = 'Name must be at least 2 characters';
    }
    setErrors((prev) => ({ ...prev, name: nameError }));
    return !nameError;
  };

  const validateEmail = () => {
    let emailError = '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.email.trim()) {
      emailError = 'Email is required';
    } else if (!emailRegex.test(userData.email)) {
      emailError = 'Invalid email format';
    }
    setErrors((prev) => ({ ...prev, email: emailError }));
    return !emailError;
  };

  const validatePassword = () => {
    let passwordError = '';
    if (!userData.password.trim()) {
      passwordError = 'Password is required';
    } else if (userData.password.length < 6) {
      passwordError = 'Password must be at least 6 characters';
    }
    setErrors((prev) => ({ ...prev, password: passwordError }));
    return !passwordError;
  };

  const validateInputs = () => {
    const newErrors = { name: '', email: '', password: '' };
    let isValid = true;

    if (!isRegister && !userData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else if (!isRegister && userData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(userData.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (!userData.password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (userData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    const timers = {};
    if (!isRegister && visited.name && userData.name) {
      timers.name = setTimeout(validateName, 2000);
    }
    if (visited.email && userData.email) {
      timers.email = setTimeout(validateEmail, 2000);
    }
    if (visited.password && userData.password) {
      timers.password = setTimeout(validatePassword, 2000);
    }
    return () => Object.values(timers).forEach(clearTimeout);
  }, [userData.name, userData.email, userData.password, visited, isRegister]);

  const handleLogin = async () => {
    if (!isRegister) {
      return setIsRegister(true);
    }

    if (!validateInputs()) {
      return;
    }

    try {
      const response = await loginAPI({
        email: userData.email,
        password: userData.password,
      });

      if (response.status === 200) {
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
        sessionStorage.setItem('token', response.data.token);
        toast.success('Login successful!');
        router.push('/message');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      toast.error('Login failed. Please try again.');
    }
  };

  const handleRegister = async () => {
    if (isRegister) {
      return setIsRegister(false);
    }

    if (!validateInputs()) {
      return;
    }

    try {
      const response = await registerAPI({
        name: userData.name,
        email: userData.email,
        password: userData.password,
      });

      if (response.status === 201) {
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
        sessionStorage.setItem('token', response.data.token);
        toast.success('Registration successful!');
        router.push('/message');
      } else {
        toast.error('Registration failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Registration failed. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field) => {
    setVisited((prev) => ({ ...prev, [field]: true }));
    if (field === 'name' && !isRegister) validateName();
    if (field === 'email') validateEmail();
    if (field === 'password') validatePassword();
  };

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 1, ease: 'easeOut' } },
    exit: { opacity: 0, transition: { duration: 0.5, ease: 'easeIn' } },
  };

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 h-screen items-center"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="flex justify-center">
        <Image
          src="/images/laptopguy.jpg"
          alt="ChatSphere Illustration"
          width={450}
          height={450}
          className="object-contain"
        />
      </div>

      <div className="max-w-md w-full space-y-6 px-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
            CS
          </div>
          <h1 className="text-2xl font-bold text-gray-900">ChatSphere</h1>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900">
          {isRegister ? 'Welcome back user' : 'Create an account'}
        </h1>

        <div className="space-y-4">
          {!isRegister && (
            <div>
              <input
                className="border border-gray-300 w-full p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 placeholder-gray-400"
                type="text"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                onBlur={() => handleBlur('name')}
                placeholder="Name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
          )}
          <div>
            <input
              className="border border-gray-300 w-full p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 placeholder-gray-400"
              type="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              onBlur={() => handleBlur('email')}
              placeholder="Email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <input
              className="border border-gray-300 w-full p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 placeholder-gray-400"
              type="password"
              name="password"
              value={userData.password}
              onChange={handleInputChange}
              onBlur={() => handleBlur('password')}
              placeholder="Password"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
        </div>

        {!isRegister && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <p className="text-sm text-gray-600">
              By registering to ChatSphere you agree with our
              <span className="text-purple-600 hover:underline cursor-pointer"> Terms & Conditions</span>, and
              <span className="text-purple-600 hover:underline cursor-pointer"> Privacy & Cookie Policy</span>.
            </p>
          </div>
        )}

        <div className="flex items-center space-x-4">
          <button
            onClick={handleRegister}
            className={`${
              isRegister
                ? 'text-purple-600 font-semibold py-3 px-6 rounded-2xl border'
                : 'bg-purple-600 text-white font-semibold py-3 px-6 rounded-2xl hover:bg-purple-700 transition duration-300'
            }`}
          >
            Register
          </button>
          <button
            onClick={handleLogin}
            className={`${
              isRegister
                ? 'bg-purple-600 text-white font-semibold py-3 px-6 rounded-2xl hover:bg-purple-700 transition duration-300'
                : 'text-purple-600 font-semibold py-3 px-6 rounded-2xl border'
            }`}
          >
            Sign In
          </button>
        </div>
      </div>
    </motion.div>
  );
}