import { supabase } from '../../lib/supabase';
import React, { useState, useEffect } from 'react';
import { Clock, Plus, User } from 'lucide-react';
import StudyBlockForm from '../study-blocks/StudyBlockForm';
import StudyBlockList from '../study-blocks/StudyBlockList';
import StatsCards from './StatsCards';

const api = {
  async getStudyBlocks() {
    const { data: { session } } = await supabase.auth.getSession();
    const response = await fetch('/api/study-blocks', {
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return data.studyBlocks || [];
  },

  async createStudyBlock(blockData) {
    const { data: { session } } = await supabase.auth.getSession();
    const response = await fetch('/api/study-blocks', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(blockData)
    });
    const data = await response.json();
    return data.studyBlock;
  },

  async deleteStudyBlock(blockId) {
    const { data: { session } } = await supabase.auth.getSession();
    await fetch(`/api/study-blocks/${blockId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session?.access_token}`
      }
    });
    return true;
  }
};

const Dashboard = ({ user, onSignOut }) => {
  const [studyBlocks, setStudyBlocks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudyBlocks();
  }, [user]);

  const loadStudyBlocks = async () => {
    if (user) {
      const blocks = await api.getStudyBlocks(user.id);
      setStudyBlocks(blocks);
      setLoading(false);
    }
  };

  const handleCreateBlock = async (blockData) => {
    const newBlock = await api.createStudyBlock(user.id, blockData);
    setStudyBlocks([...studyBlocks, newBlock]);
    setShowForm(false);
  };

  const handleDeleteBlock = async (blockId) => {
    await api.deleteStudyBlock(user.id, blockId);
    setStudyBlocks(studyBlocks.filter(block => block.id !== blockId));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-12 h-12 text-indigo-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading your study blocks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Quiet Hours Scheduler</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <button
                onClick={onSignOut}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <StatsCards studyBlocks={studyBlocks} />

        {/* Add New Block Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2 mb-8"
          >
            <Plus className="w-5 h-5" />
            Create New Study Block
          </button>
        )}

        {/* Create Form */}
        {showForm && (
          <StudyBlockForm
            onSubmit={handleCreateBlock}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Study Blocks List */}
        {studyBlocks.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No study blocks yet</h3>
            <p className="text-gray-600 mb-6">Create your first quiet hours session to get started.</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Create Your First Block
            </button>
          </div>
        ) : (
          <StudyBlockList
            studyBlocks={studyBlocks}
            onDeleteBlock={handleDeleteBlock}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
