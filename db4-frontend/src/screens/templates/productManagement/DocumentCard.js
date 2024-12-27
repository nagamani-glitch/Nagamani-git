import React, { useState } from 'react';
import './DocumentCard.css';
import { Card } from 'react-bootstrap';

const DocumentCard = ({ title, current, total, details }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const toggleExpanded = () => setIsExpanded(!isExpanded);
  const toggleActions = () => setIsActionsOpen(!isActionsOpen);

  return (
    <div className='document-card'>
      <div onClick={toggleExpanded} style={{display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
      <div className="document-info">
        <div style={{ display: "flex", flexDirection:"row", justifyContent:"center", alignItems:"center" }}>
          <button className="plus-icon" >
            {isExpanded ? '−' : '+'}
          </button>
          <input type="checkbox" />
          <span className="title">{title}</span>
          <div className="counter">
            <span>{current}/{total}</span>
          </div>
        </div>
      </div>
      <div className="actions-dropdown">
        <button className="actions-button" onClick={toggleActions}>Actions</button>
        {isActionsOpen && (
          <div className="dropdown-content">
            <button style={{ backgroundColor: "transparent", color: "gray", border: "none" }} >Edit</button>
            <button style={{ backgroundColor: "transparent", color: "red", border: "none" }}>Delete</button>
          </div>
        )}
      </div>
      </div>

      
          {isExpanded && (
            <Card className='mt-2'>
            <Card.Body>
            <div className="details-list">
              {details.map((detail, index) => (
                <div key={index} className="detail-item">
                  <div style={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
                    <input type="checkbox" />
                    <div style={{display:"flex", alignItems:"center"}}>
                    <button className="small-plus-icon">+</button>
                    <div style={{display:"flex", alignItems:"center"}}>
                    <span style={{fontSize:"12px"}}>Upload {title} -- {detail}</span>
                    <span>DES</span>
                    </div>
                    </div>
                  </div>
                  <div className="actions">
                    <button className="approve-button">✔</button>
                    <button className="reject-button">✘</button>
                    <button className="delete-button">🗑</button>
                  </div>
                </div>
              ))}
            </div>
            </Card.Body>
            </Card>
          )}
        
    </div>
  );
};

export default DocumentCard;
