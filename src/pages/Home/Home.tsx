import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { getGlobal, setGlobal } from "../../utils/storage"; // for data storage
import { useAppContext } from "../../context/AppContext"; // for events updates
import MyModal from '../../utils/Modal';
import '../../utils/Modal.css';

const Home: React.FC = () => {
  const { user, setUser } = useAppContext();
  const [global, setGlobalstate] = useState<string>(getGlobal);
  const [isVisible, setIsVisible] = useState(false);
  const [i, setI] = useState(parseInt(user?.split(" ").pop() || "0") || 0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  type MyData = { foo: string; };
  const { data, setData } = useAppContext<MyData>();

  interface ApiResponse {
    message: string;
  }
  // update one time on load
  useEffect(() => {
    if (data) {
      console.log('data read from context:', data.foo);
    }
    const initialData = { foo: "bar" };
    setData(initialData);
    console.log('data set to context:', initialData.foo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // run every time global changes
  useEffect(() => {
    try {
      setGlobal(global); // update the global variable
      console.log('global set:', global);
    } catch (error) {
      console.error('Error saving todos to global Storage:', error);
    }
  }, [global]);

  const toggleDiv = () => {
    setIsVisible(prev => !prev);
  };

  const updateI = () => {
    setUser("AppContext Alice " + (i+1))
    setI(i+1);
  }

  const fetchData = async () => {
    try {
      const { data } = await axios.get<ApiResponse>('/api/data');
      alert(data.message);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{width: '400px', margin: '0 auto', backgroundColor: '#eee', padding: '16px', borderRadius: '8px'}}>
        <div>
          <h2>User: {user ?? "No user logged in"}</h2>
          <button onClick={() => updateI()}>Set AppContext User to Alice</button>
        </div>
  
        <div>
          <h2>User: {global ?? "No user logged in"}</h2>
          <button onClick={() => setGlobalstate("global Alice")}>Set global User to Alice</button>
        </div>
  
        <h2>Toggle Div Example</h2>
        <div className="p-4">
          <button onClick={toggleDiv} className="bg-blue-500 text-white px-4 py-2 rounded">
            {isVisible ? 'Hide' : 'Show'} Content
          </button>
  
          {isVisible && (
            <div className="mt-4 p-4 bg-gray-100 rounded shadow">
              This is the content inside the div.
            </div>
          )}
        </div><br></br>
        <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
        
        <br></br><br></br>
        <button onClick={fetchData}>Fetch Data</button>

        <br></br><br></br>
        <button onClick={() => navigate('todo')} className="bg-blue-500 text-white px-4 py-2 rounded">
          Load Todo List
        </button>
        
      </div>

      {/* Modal window - the contant of MyModal will be project in children prop */}
      <div>
        <MyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          {/* The content wrapped inside will be strongly typed */}
          <h2>Welcome to the Modal!</h2>
          <p>This is some flexible content for the modal body.</p>
          <ul>
            <li>You can put anything here</li>
            <li>Forms, lists, images, and more</li>
            <h2>User: {user ?? "No user logged in"}</h2>
            <button onClick={() => updateI()}>Set AppContext User to Alice</button>
          </ul>
        </MyModal>
    </div>
          <Outlet />
    </div>
  );
};

export default Home;
