import React, { useState } from 'react';
import './Objectives.css';

const initialObjectives = [
  { id: 1, title: 'rre', managers: 1, keyResults: 1, assignees: 0, duration: '1 Days', description: 'ere', archived: false },
  { id: 2, title: 'improve language', managers: 0, keyResults: 1, assignees: 4, duration: '60 Days', description: 'improve English language', archived: false },
  { id: 3, title: 'Increase the company sales', managers: 1, keyResults: 1, assignees: 6, duration: '30 Days', description: 'Increase the company sales by 30% in the next Quarter', archived: true },
]; 

const Objectives = () => {
  const [objectives, setObjectives] = useState(initialObjectives);
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({ managers: '', assignees: '', keyResults: '', duration: '', archived: '' });
  
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const filteredObjectives = objectives.filter(obj => {
    return (
      (selectedTab === 'all' || obj.archived === (selectedTab === 'self')) &&
      (searchTerm === '' || obj.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filter.managers === '' || obj.managers.toString() === filter.managers) &&
      (filter.assignees === '' || obj.assignees.toString() === filter.assignees) &&
      (filter.keyResults === '' || obj.keyResults.toString() === filter.keyResults) &&
      (filter.duration === '' || obj.duration.includes(filter.duration)) &&
      (filter.archived === '' || obj.archived.toString() === filter.archived)
    );
  });

  const handleDelete = id => {
    setObjectives(objectives.filter(obj => obj.id !== id));
  };

  const handleArchive = id => {
    setObjectives(objectives.map(obj => obj.id === id ? { ...obj, archived: !obj.archived } : obj));
  };

  const handleAdd = () => {
    const newObjective = {
      id: objectives.length + 1,
      title: 'New Objective',
      managers: 0,
      keyResults: 0,
      assignees: 0,
      duration: '0 Days',
      description: 'New objective description',
      archived: false,
    };
    setObjectives([...objectives, newObjective]);
  };

  const handleEdit = id => {
    alert(`Edit objective with id: ${id}`);
  };


  // For the filter functionality 
  const handleFilterChange = (field, value) => {
    setFilter({ ...filter, [field]: value });
  };

  const applyFilter = () => {
    setIsFilterModalOpen(false);
  };

  const resetFilter = () => {
    setFilter({ managers: '', assignees: '', keyResults: '', duration: '', archived: '' });
    setIsFilterModalOpen(false);
  };



  return (
    <div className="objectives">
      <div className="header-row">
        <h2>Objectives</h2>
        <div className="toolbar">
          <input type="text" placeholder="Search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <button onClick={() => setIsFilterModalOpen(true)}>Filter</button>
          <button onClick={handleAdd}>+ Create</button>
        </div>
      </div>
      <div className="tabs">
        <button className={selectedTab === 'self' ? 'active' : ''} onClick={() => setSelectedTab('self')}>Self Objective</button>
        <button className={selectedTab === 'all' ? 'active' : ''} onClick={() => setSelectedTab('all')}>All Objective</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Managers</th>
            <th>Key Results</th>
            <th>Assignees</th>
            <th>Duration</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredObjectives.map(obj => (
            <tr key={obj.id}>
              <td>{obj.title}</td>
              <td>{obj.managers} Managers</td>
              <td>{obj.keyResults} Key results</td>
              <td>{obj.assignees} Assignees</td>
              <td>{obj.duration}</td>
              <td>{obj.description}</td>
              <td>
                <button onClick={() => alert('Add key result')}>+</button>
                <button onClick={() => handleEdit(obj.id)}>✎</button>
                <button onClick={() => handleArchive(obj.id)}>📥</button>
                <button onClick={() => handleDelete(obj.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">Page 1 of 1</div>

          {/*  For filter functionality */}
          {isFilterModalOpen && (
        <div className="filter-modal">
          <div className="filter-modal-content">
            <h3>Filter Objectives</h3>
            <div className='group'>
            <label>
              Managers:
              <input type="text" value={filter.managers} onChange={e => handleFilterChange('managers', e.target.value)} />
            </label>
            <label>
              Assignees:
              <input type="text" value={filter.assignees} onChange={e => handleFilterChange('assignees', e.target.value)} />
            </label>
            </div>
            <div className='group'>
            <label>
              Key Results:
              <input type="number" value={filter.keyResults} onChange={e => handleFilterChange('keyResults', e.target.value)} />
            </label>
            <label>
              Duration:
              <input type="text" value={filter.duration} onChange={e => handleFilterChange('duration', e.target.value)} />
            </label>
            </div>
            <label>
              Archived:
              <select value={filter.archived} onChange={e => handleFilterChange('archived', e.target.value)}>
                <option value="">All</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
            <div style={{display: "flex", marginRight: "20px"}}>
            <button onClick={applyFilter}>Apply</button>
            <button onClick={resetFilter}>Reset</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Objectives;
