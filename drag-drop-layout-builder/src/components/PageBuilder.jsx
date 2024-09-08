// src/components/PageBuilder.jsx
import React, { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import DraggableComponent from './DraggableComponent';
import { db, collection, addDoc, getDocs } from '../firebase';

const PageBuilder = () => {
  const [layout, setLayout] = useState([]);
  const [layoutName, setLayoutName] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    isWorking: false,
  });

  const handleDragEnd = (event) => {
    const { active } = event;
    setLayout((prevLayout) => [...prevLayout, active.id]);
  };

  const saveLayout = async () => {
    if (!layoutName) {
      alert('Please enter a layout name before saving.');
      return;
    }
    try {
      await addDoc(collection(db, 'layouts'), {
        layout,
        name: layoutName,
        formData,
      });
      alert('Layout and form data saved successfully!');
    } catch (error) {
      console.error('Error saving layout: ', error);
    }
  };

  const loadLayout = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'layouts'));
      const savedLayout = querySnapshot.docs.map((doc) => ({
        layout: doc.data().layout,
        name: doc.data().name,
        formData: doc.data().formData || { name: '', age: '', isWorking: false },
      }));
      setLayout(savedLayout[0]?.layout || []);
      setLayoutName(savedLayout[0]?.name || '');
      setFormData(savedLayout[0]?.formData || { name: '', age: '', isWorking: false });
    } catch (error) {
      console.error('Error loading layout: ', error);
    }
  };

  const publishLayout = () => {
    if (!layoutName) {
      alert('Please enter a layout name before publishing.');
      return;
    }
    const newTab = window.open('', '_blank');
    if (!newTab) {
      alert('Unable to open a new tab. Please check your browser settings.');
      return;
    }
    const layoutHTML = layout
      .map(
        (item) =>
          `<div style="border: 1px solid #ccc; padding: 10px; margin: 5px;">${item}</div>`
      )
      .join('');
    newTab.document.write(
      `<html>
        <head>
          <title>${layoutName}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .form-input { margin-bottom: 10px; display: flex; flex-direction: column; }
            .form-input label { margin-bottom: 5px; font-size: 14px; font-weight: bold; }
            .form-input input { padding: 8px; font-size: 14px; border: 1px solid #ddd; border-radius: 4px; }
            .form-input button { padding: 10px; background-color: #4CAF50; color: white; border: none; cursor: pointer; }
            .form-input button:hover { background-color: #45a049; }
          </style>
        </head>
        <body>
          <h2>${layoutName}</h2>
          ${layoutHTML}
          <div class="form-container">
            <div class="form-input">
              <label>Enter Your Name:</label>
              <input type="text" value="${formData.name}" readonly />
            </div>
            <div class="form-input">
              <label>Age:</label>
              <input type="number" value="${formData.age}" readonly />
            </div>
            <div class="form-input">
              <label>Is Working?</label>
              <input type="checkbox" ${formData.isWorking ? 'checked' : ''} disabled />
            </div>
            <div class="form-input">
              <button type="button" onclick="alert('Form data saved!')">Save</button>
            </div>
          </div>
        </body>
      </html>`
    );
    newTab.document.close();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dynamic Page Builder</h1>
      <div style={{ display: 'flex' }}>
        {/* Left Sidebar for draggable components */}
        <div style={{ flex: '0 0 200px', borderRight: '1px solid #ddd', padding: '10px' }}>
          <DndContext onDragEnd={handleDragEnd}>
            <div
              className="toolbox"
              style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
            >
              <h3 style={{ color: 'red', textAlign: 'center' }}>Controls to Drag n Drop</h3>
              <DraggableComponent id="Label">Label</DraggableComponent>
              <DraggableComponent id="Input Box">Input Box</DraggableComponent>
              <DraggableComponent id="Check Box">Check Box</DraggableComponent>
              <DraggableComponent id="Button">Button</DraggableComponent>
              <DraggableComponent id="Table">Table</DraggableComponent>
            </div>
          </DndContext>
        </div>
        {/* Main Canvas Section */}
        <div style={{ flex: '1', padding: '10px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Enter Layout Name"
              value={layoutName}
              onChange={(e) => setLayoutName(e.target.value)}
              style={{ flex: '1', padding: '5px' }}
            />
            <button onClick={saveLayout}>Save Layout</button>
            <button onClick={loadLayout}>Load Layout</button>
            <button onClick={publishLayout}>Publish</button>
          </div>
          <div
            className="canvas"
            style={{
              border: '2px solid #eee',
              minHeight: '300px',
              padding: '20px',
            }}
          >
            {layout.map((item, index) => (
              <div
                key={index}
                style={{ padding: '10px', margin: '5px', border: '1px dashed #ddd' }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
        {/* Right Sidebar for form input fields */}
        <div style={{ flex: '0 0 200px', borderLeft: '1px solid #ddd', padding: '10px' }}>
          <div className="form-input" style={{ marginBottom: '15px' }}>
            <label>Enter Your Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <div className="form-input" style={{ marginBottom: '15px' }}>
            <label>Age:</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              placeholder="Enter your age"
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <div className="form-input" style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
            <label style={{ marginRight: '10px' }}>Is Working?</label>
            <input
              type="checkbox"
              name="isWorking"
              checked={formData.isWorking}
              onChange={handleInputChange}
            />
          </div>
          <button
            onClick={saveLayout}
            style={{
              padding: '10px 20px',
              border: '1px solid #000',
              borderRadius: '4px',
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageBuilder;
