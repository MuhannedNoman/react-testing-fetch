import React, { useEffect, useState } from 'react';
import config from './config.json';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const promise = await fetch(config.API_ENDPOINT);
      const result = await promise.json();
      setPosts(result);
    };
    fetchData();
  }, []);

  const handleAdd = async () => {
    const obj = { title: 'a', body: 'b' };
    const response = await fetch(config.API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(obj),
    });
    const result = await response.json();
    setPosts((prevState) => [result, ...prevState]);
  };

  const handleUpdate = async (post) => {
    post.title = 'Update';
    const response = await fetch(`${config.API_ENDPOINT}/${post.id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(post),
    });
    const result = await response.json();
    setPosts((prevState) =>
      prevState.map((p) => {
        if (p.id === post.id) p = result;
        return p;
      })
    );
  };

  const handleDelete = async (post) => {
    const originalState = posts;
    setPosts((prevState) => prevState.filter((p) => p.id !== post.id));

    try {
      const response = await fetch(`${config.API_ENDPOINT}/${post.id}`, {
        method: 'DELETE',
      });
      await response.json();
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error('This post had already been deleted');
      else {
        console.log('Logging error', ex);
        toast.error('An unexpected error occurred.');
      }

      setPosts(originalState);
    }
  };

  return (
    <div>
      <ToastContainer />
      <button onClick={handleAdd}>Add</button>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>{post.title}</td>
              <td>
                <button onClick={() => handleUpdate(post)}>Update</button>
              </td>
              <td>
                <button onClick={() => handleDelete(post)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
