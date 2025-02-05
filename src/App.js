import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';
import Navabar from './Pages/HomePage';
import Rooms from './Pages/Rooms';
import EditorPage from "./Pages/EditorPage"

const App = () => {
  return (
    <>
    <div>
      <Toaster  position = 'top-right' toastOptions={{style: {color : '#4aee88', background : '#fff'
      }}}/>
    </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navabar/>}></Route>
          <Route path="/rooms" element={<Rooms/>}></Route>
          <Route path="/editor/:roomid" element={<EditorPage />}></Route>
        </Routes>
      </BrowserRouter>
      
    </>
  );
};

export default App;
