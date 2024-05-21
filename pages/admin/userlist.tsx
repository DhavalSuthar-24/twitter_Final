import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal'; // Adjust the path as necessary
import Image from 'next/image';
import useCurrentUser from '@/hooks/useCurrentUser';

interface User {
  id: number;
  profileImage: string;
  username: string;
  name: string;
  email: string;
  isAdmin: boolean;
  // Add more properties if necessary
}

const UserList: React.FC = () => {
  const { data: currentUser, isLoading: isCurrentUserLoading } = useCurrentUser();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isCurrentUserLoading && !currentUser) {
      router.push('/');
    }
  }, [isCurrentUserLoading, currentUser, router]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const openDeleteModal = (userId: number) => {
    setUserIdToDelete(userId);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setUserIdToDelete(null);
  };

  const handleDelete = useCallback(async () => {
    if (userIdToDelete === null) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/user/${userIdToDelete}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      setUsers(users.filter(user => user.id !== userIdToDelete));
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsDeleting(false);
      closeDeleteModal();
    }
  }, [userIdToDelete, users]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!currentUser) return null; // Return null if there is no current user

  return (
    <div className="overflow-x-auto">
      <h1 className="text-white text-xl font-semibold mb-4">Users List</h1>
      <table className="min-w-full divide-y divide-gray-200 border border-gray-600">
        <thead className="bg-gray-800 text-xs">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-s text-white uppercase tracking-wider border border-gray-600">Profile</th>
            <th className="px-6 py-3 text-left text-xs font-s text-white uppercase tracking-wider border border-gray-600">Username</th>
            <th className="px-6 py-3 text-left text-xs font-s text-white uppercase tracking-wider border border-gray-600">Name</th>
            <th className="px-6 py-3 text-left text-xs font-s text-white uppercase tracking-wider border border-gray-600">Email</th>
            <th className="px-4 py-3 text-left text-xs font-s text-white uppercase tracking-wider border border-gray-600">Admin</th>
            <th className="px-6 py-3 text-left text-xs font-s text-white uppercase tracking-wider border border-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-4 py-4 whitespace-nowrap border border-gray-600">
                <Image
                  src={user.profileImage || 'https://as2.ftcdn.net/v2/jpg/00/64/67/63/1000_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg'}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full object-cover max-h-[40px]"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-xs text-white border border-gray-600">{user.username}</td>
              <td className="px-6 py-4 whitespace-nowrap text-xs text-white border border-gray-600">{user.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-xs text-white border border-gray-600">{user.email}</td>
              <td className="px-4 py-4 whitespace-nowrap text-xs text-center text-white border border-gray-600">{user.isAdmin ? '✅' : 'No'}</td>
              <td className="px-6 py-4 text-xs whitespace-nowrap border border-gray-600">
                <button
                  onClick={() => openDeleteModal(user.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default UserList;
