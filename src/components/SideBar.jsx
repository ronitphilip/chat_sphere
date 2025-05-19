"use client";

import { LogOut, MessageCircle, Search } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { recentContactsAPI, searchAPI } from '../services/allAPI';
import { useDebounce } from '@/hooks/useDebounce';
import { useSocket } from '@/hooks/useSocket';

export default function SideBar({ setSelectedUser, selectedUser }) {

    const router = useRouter();
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [user, setUser] = useState(null);
    const [newMessageSenders, setNewMessageSenders] = useState(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [searchContacts, setSearchContacts] = useState([]);


    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUser = sessionStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
    }, []);

    useEffect(() => {
        if (!user?.id) return;
        recentContacts();
    }, [user?.id]);

    useSocket(user?.id, {
        onMessage: (message) => {
            if (message.senderId !== selectedUser?.id) {
                setNewMessageSenders((prev) => new Set([...prev, message.senderId]));
            }
        },
    }, selectedUser?.id);

    const searchUser = async (searchQuery) => {
        if (!searchQuery.trim()) {
            setSearchContacts([]);
            setHasSearched(false);
            return;
        }
        try {
            const result = await searchAPI({ name: searchQuery });
            setSearchContacts(result.data || []);
            setHasSearched(true);
        } catch (err) {
            console.log('Search error:', err);
            setSearchContacts([]);
            setHasSearched(true);
        }
    };

    const debouncedSearch = useDebounce(searchUser, 500);

    const handleSearchChange = (value) => {
        setSearchQuery(value);
        debouncedSearch(value);
    };

    const handleSelectUser = (contact) => {
        setSelectedUser(contact);
        setNewMessageSenders((prev) => {
            const updated = new Set(prev);
            updated.delete(contact.id);
            return updated;
        });
        setSearchQuery('');
        setSearchContacts([]);
        setHasSearched(false);
    };

    const logout = () => {
        sessionStorage.clear();
        router.push('/login');
    };

    const recentContacts = async () => {
        try {
            const result = await recentContactsAPI(user?.id);
            if (result.status === 200 && result?.data?.length > 0) {
                setContacts(result.data)
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
    <div className='h-screen border-r-2 border-gray-100 bg-gradient-to-b from-white to-gray-50 shadow-sm'>
      <div className='grid grid-cols-5 h-full'>
        <div className='h-full flex flex-col justify-between items-center py-8 border-r-2 border-gray-100 bg-white'>
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold transition-transform hover:scale-110 cursor-pointer shadow-md">
            CS
          </div>
          <MessageCircle className='text-gray-600 hover:text-purple-600 transition-colors cursor-pointer' size={28} />
          <button onClick={logout}>
            <LogOut className='text-gray-600 hover:text-red-500 transition-colors cursor-pointer' size={28} />
          </button>
        </div>

        <div className='col-span-4'>
          <h1 className='text-center mt-9 font-extrabold text-3xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600'>
            ChatSphere
          </h1>
          <div className='w-full flex flex-col items-center justify-center mt-6'>
            <div className='relative group'>
              <Image
                src="/images/user.jpg"
                className='rounded-full border-4 border-gray-100'
                width={150}
                height={150}
                alt="User profile"
                priority
              />
            </div>
            <h1 className='mt-3 text-lg font-semibold text-gray-800 group-hover:text-purple-600 transition-colors'>
              {user?.name || 'User'}
            </h1>
          </div>

          <div className='flex justify-center px-6 py-5'>
            <div className='relative w-full max-w-md'>
              <input
                type="text"
                className={`p-3 pr-10 rounded-3xl border-2 
                        ${isSearchFocused ? 'border-purple-600 shadow-lg' : 'border-gray-200'} 
                        focus:outline-none focus:border-purple-600 
                        w-full bg-white text-gray-700 placeholder-gray-400 
                        transition-all duration-300 hover:shadow-md`}
                placeholder='Search users...'
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onChange={(e) => handleSearchChange(e.target.value)}
                value={searchQuery}
              />
              <Search className={`absolute right-3 top-1/2 -translate-y-1/2 
                                  ${isSearchFocused ? 'text-purple-600' : 'text-gray-400'}
                                  transition-colors duration-300`} size={20} />
            </div>
          </div>

          <div className='px-4 pb-2 space-y-4 max-h-90 overflow-y-auto'>
            <h1 className='text-sm font-medium text-gray-500 uppercase tracking-wide'>Chats</h1>
            {(searchQuery.trim() ? searchContacts : contacts).length > 0 ? (
              (searchQuery.trim() ? searchContacts : contacts).map((contact) => (
                <div
                  onClick={() => handleSelectUser(contact)}
                  key={contact?.id}
                  className='flex items-center justify-between bg-gray-50 p-3 rounded-2xl hover:bg-purple-50 transition-colors duration-200 cursor-pointer shadow-sm hover:shadow-md'
                >
                  <div className='flex items-center'>
                    <div className='h-10 w-10 rounded-full flex items-center justify-center font-extrabold text-white bg-gradient-to-br from-purple-500 to-indigo-500 me-3 transition-transform hover:scale-105'>
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <h1 className='text-gray-800 font-medium'>{contact.name}</h1>
                  </div>
                  {newMessageSenders.has(contact.id) && (
                    <span className='bg-green-500 rounded-full h-3 w-3' />
                  )}
                </div>
              ))
            ) : (
              <h1 className='text-gray-600'>
                {hasSearched && searchQuery.trim() ? 'No users found' : 'Start new conversation'}
              </h1>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}