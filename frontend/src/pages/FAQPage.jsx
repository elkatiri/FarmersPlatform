import { useEffect, useState } from 'react';
import { api, authHeaders } from '../services/api';
import { useAuth } from '../context/AuthContext';

const FAQPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [editingId, setEditingId] = useState('');
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  const [error, setError] = useState('');
  const { isAdminAuthenticated, token } = useAuth();

  const fetchFaqs = async () => {
    const { data } = await api.get('/faqs');
    setFaqs(data);
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const addFAQ = async (e) => {
    e.preventDefault();
    setError('');
    if (!question || !answer) {
      setError('Question and answer are required.');
      return;
    }

    try {
      await api.post('/faqs', { question, answer }, authHeaders(token));
      setQuestion('');
      setAnswer('');
      fetchFaqs();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save FAQ');
    }
  };

  const startEdit = (faq) => {
    setEditingId(faq._id);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
  };

  const saveEdit = async () => {
    if (!editQuestion || !editAnswer) {
      setError('Question and answer are required.');
      return;
    }

    try {
      await api.patch(`/faqs/${editingId}`, { question: editQuestion, answer: editAnswer }, authHeaders(token));
      setEditingId('');
      setEditQuestion('');
      setEditAnswer('');
      setError('');
      fetchFaqs();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update FAQ');
    }
  };

  const removeFAQ = async (id) => {
    try {
      await api.delete(`/faqs/${id}`, authHeaders(token));
      fetchFaqs();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete FAQ');
    }
  };

  return (
    <div>
      <div className="card">
        <h2>FAQ</h2>
        {faqs.map((faq) => (
          <div key={faq._id} style={{ marginBottom: '0.9rem' }}>
            {editingId === faq._id ? (
              <div className="grid">
                <input value={editQuestion} onChange={(e) => setEditQuestion(e.target.value)} />
                <textarea rows="3" value={editAnswer} onChange={(e) => setEditAnswer(e.target.value)} />
                <div className="grid grid-2">
                  <button onClick={saveEdit}>Save</button>
                  <button className="secondary" onClick={() => setEditingId('')}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <p><strong>Q:</strong> {faq.question}</p>
                <p><strong>A:</strong> {faq.answer}</p>
                {isAdminAuthenticated && (
                  <div className="grid grid-2">
                    <button onClick={() => startEdit(faq)}>Edit</button>
                    <button className="secondary" onClick={() => removeFAQ(faq._id)}>Delete</button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {isAdminAuthenticated && (
        <div className="card">
          <h3>Edit FAQ (Admin)</h3>
          {error && <p className="error">{error}</p>}
          <form onSubmit={addFAQ} className="grid">
            <div>
              <label>Question</label>
              <input value={question} onChange={(e) => setQuestion(e.target.value)} />
            </div>
            <div>
              <label>Answer</label>
              <textarea rows="4" value={answer} onChange={(e) => setAnswer(e.target.value)} />
            </div>
            <button type="submit">Add FAQ</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default FAQPage;
