import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useStudyBlocks() {
  const [studyBlocks, setStudyBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchStudyBlocks();
    }
  }, [user]);

  async function getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      'Authorization': `Bearer ${session?.access_token}`,
      'Content-Type': 'application/json'
    };
  }

  async function fetchStudyBlocks() {
    try {
      setLoading(true);
      const headers = await getAuthHeaders();
      
      const response = await fetch('/api/study-blocks', { headers });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch study blocks');
      }
      
      setStudyBlocks(data.studyBlocks);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function createStudyBlock(blockData) {
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch('/api/study-blocks', {
        method: 'POST',
        headers,
        body: JSON.stringify(blockData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create study block');
      }
      
      setStudyBlocks(prev => [...prev, data.studyBlock]);
      return data.studyBlock;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function updateStudyBlock(id, blockData) {
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(`/api/study-blocks/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(blockData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update study block');
      }
      
      setStudyBlocks(prev => 
        prev.map(block => block._id === id ? data.studyBlock : block)
      );
      return data.studyBlock;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function deleteStudyBlock(id) {
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(`/api/study-blocks/${id}`, {
        method: 'DELETE',
        headers
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete study block');
      }
      
      setStudyBlocks(prev => prev.filter(block => block._id !== id));
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return {
    studyBlocks,
    loading,
    error,
    fetchStudyBlocks,
    createStudyBlock,
    updateStudyBlock,
    deleteStudyBlock
  };
}
