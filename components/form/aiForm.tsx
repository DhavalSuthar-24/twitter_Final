import React, { useState } from 'react';
import styles from './AIForm.module.css';
import toast from 'react-hot-toast';

const AIForm = () => {
  const [isAIFormVisible, setAIFormVisible] = useState(false);
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleToggle = () => {
    setAIFormVisible(!isAIFormVisible);
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleAskAI = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generateTweet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: question }),
      });

      const data = await res.json();
      setResponse(data.result);
    } catch (error) {
      console.error('Error asking AI:', error);
      setResponse('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    // alert('Copied to clipboard!');
    toast.success('Copied to Clipboard!⚡');
  };

  return (
    <div className={styles.container}>
      <button className={styles.toggleButton} onClick={handleToggle}>
        {isAIFormVisible ? 'Close ✖️'  : 'Ask AI✨'}
      </button>
      <div className={`${styles.aiForm} ${!isAIFormVisible && styles.hidden}`}>
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={question}
            onChange={handleQuestionChange}
            placeholder="Ask the AI"
            className={styles.inputField}
          />
          <button onClick={handleAskAI} className={styles.askButton} disabled={loading}>
            {loading ? 'generating...' : 'Ask'}
          </button>
        </div>
        {response && (
          <div className={styles.response}>
            <p>{response}</p>
            <button onClick={handleCopy} className={styles.copyButton}>
              Copy
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIForm;
