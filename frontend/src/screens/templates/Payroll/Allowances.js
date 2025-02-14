import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useDebounce } from "use-debounce";
import CreateAllowance from "./CreateAllowance";
import "./Allowances.css";
import {
  FaList,
  FaTh,
  FaFilter,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

const Allowances = () => {
  const [allowancesData, setAllowancesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("card");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [editFormData, setEditFormData] = useState({
    code: "",
    name: "",
    amount: "",
    oneTime: "No",
    taxable: "No",
    fixed: false,
  });

  const [filterOptions, setFilterOptions] = useState({
    taxable: "",
    fixed: "",
    oneTime: "",
    amount: ""
  });

  const [filtersApplied, setFiltersApplied] = useState(false);

  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterVisible(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
  
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  useEffect(() => {
    if (debouncedSearchTerm === "") {
      setFilteredData(allowancesData);
    } else {
      const filtered = allowancesData.filter((allowance) =>
        allowance.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [debouncedSearchTerm, allowancesData]);

  useEffect(() => {
    const fetchAllowances = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/allowances");
        setAllowancesData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Error fetching allowances:", error);
      }
    };
    fetchAllowances();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term === "") {
      setFilteredData(allowancesData);
    } else {
      const filtered = allowancesData.filter((allowance) =>
        allowance.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const handleEdit = async (id) => {
    const allowanceToEdit = allowancesData.find(allowance => allowance._id === id);
    if (!allowanceToEdit) return;
    setEditFormData(allowanceToEdit);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/allowances/${editFormData._id}`,
        editFormData
      );
      setAllowancesData(prev =>
        prev.map(allowance => allowance._id === editFormData._id ? response.data : allowance)
      );
      setFilteredData(prev =>
        prev.map(allowance => allowance._id === editFormData._id ? response.data : allowance)
      );
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating allowance:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!id || !window.confirm("Are you sure you want to delete this allowance?")) {
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/allowances/${id}`);
      const updatedData = allowancesData.filter(allowance => allowance._id !== id);
      setAllowancesData(updatedData);
      setFilteredData(updatedData);
    } catch (error) {
      console.error("Error details:", error.response?.data);
    }
  };

  // const toggleFilterVisibility = () => {
  //   setIsFilterVisible(!isFilterVisible);
  // };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilter = () => {
    let filtered = [...allowancesData];

    if (filterOptions.taxable) {
      filtered = filtered.filter(item => item.taxable === filterOptions.taxable);
    }
    if (filterOptions.fixed) {
      filtered = filtered.filter(item =>
        filterOptions.fixed === "Yes" ? item.fixed : !item.fixed
      );
    }
    if (filterOptions.oneTime) {
      filtered = filtered.filter(item => item.oneTime === filterOptions.oneTime);
    }
    if (filterOptions.amount) {
      filtered = filtered.filter(item => {
        switch (filterOptions.amount) {
          case "lessThan1000":
            return item.amount < 1000;
          case "1000to5000":
            return item.amount >= 1000 && item.amount <= 5000;
          case "moreThan5000":
            return item.amount > 5000;
          default:
            return true;
        }
      });
    }

    setFilteredData(filtered);
    setIsFilterVisible(false);
    setFiltersApplied(true);
  };

  const resetFilters = () => {
    setFilterOptions({
      taxable: "",
      fixed: "",
      oneTime: "",
      amount: ""
    });
    setFilteredData(allowancesData);
    setFiltersApplied(false);
    setIsFilterVisible(false);
  };

  return (
    <div className="allowances-container">
      <header className="allowances-header">
        <h1>Allowances</h1>
        {/* <div className="controls">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearch}
            //  className="allowance-search"
            style={{
              maxWidth: "200px",
              // height: "30px",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              marginRight: "10px",
            }}
          />
          <button 
            className={`view-toggle ${view === "list" ? "active" : ""}`}
            onClick={() => setView("list")}
          >
            <FaList />
          </button>
          <button 
            className={`view-toggle ${view === "card" ? "active" : ""}`}
            onClick={() => setView("card")}
          >
            <FaTh />
          </button>
          <button
            className="filter-btn"
            onClick={() => filtersApplied ? resetFilters() : toggleFilterVisibility()}
          >
            <FaFilter /> {filtersApplied ? "Reset" : "Filter"}
          </button>
          <button 
            className="create-btn" 
            onClick={() => setIsCreateModalOpen(true)}
          >
             Create
          </button>
        </div> */}




<div style={{
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '16px'
}}>
  <input
    type="text"
    placeholder="Search"
    value={searchTerm}
    onChange={handleSearch}
    style={{
      maxWidth: "200px",
      padding: "8px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      marginRight: "10px",
    }}
  />
  <button 
    className={`view-toggle ${view === "list" ? "active" : ""}`}
    onClick={() => setView("list")}
    style={{
      background: 'none',
      border: 'none',
      fontSize: '18px',
      cursor: 'pointer'
    }}
  >
    <FaList />
  </button>
  <button 
    className={`view-toggle ${view === "card" ? "active" : ""}`}
    onClick={() => setView("card")}
    style={{
      background: 'none',
      border: 'none',
      fontSize: '18px',
      cursor: 'pointer'
    }}
  >
    <FaTh />
  </button>
  
  <div style={{ position: 'relative' }} ref={filterRef}> 
    <button
      onClick={() => filtersApplied ? resetFilters() : setIsFilterVisible(!isFilterVisible)}
      style={{
        padding: '8px 16px',
        background: 'linear-gradient(45deg, #3498db, #2980b9)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 8px rgba(52, 152, 219, 0.2)'
      }}
    >
      <FaFilter /> {filtersApplied ? "Reset" : "Filter"}
    </button>

    {isFilterVisible && (
      <div style={{
        position: 'absolute',
        top: 'calc(100% + 10px)',
        right: '0',
        background: 'linear-gradient(to bottom, #ffffff, #f8fafc)',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        width: '300px',
        zIndex: 1000,
        border: '1px solid rgba(255,255,255,0.8)',
        animation: 'fadeIn 0.3s ease'
      }}>
        <div style={{
          padding: '20px'
        }}>
          <div style={{
            marginBottom: '15px'
          }}>
            <label style={{
              display: 'block',
              color: '#2c3e50',
              fontWeight: 600,
              fontSize: '0.95rem',
              marginBottom: '8px'
            }}>Taxable</label>
            <select 
              name="taxable" 
              value={filterOptions.taxable} 
              onChange={handleFilterChange}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '2px solid #e0e7ff',
                fontSize: '0.95rem',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="">All</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div style={{
            marginBottom: '15px'
          }}>
            <label style={{
              display: 'block',
              color: '#2c3e50',
              fontWeight: 600,
              fontSize: '0.95rem',
              marginBottom: '8px'
            }}>Fixed/Variable</label>
            <select 
              name="fixed" 
              value={filterOptions.fixed} 
              onChange={handleFilterChange}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '2px solid #e0e7ff',
                fontSize: '0.95rem',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="">All</option>
              <option value="Yes">Fixed</option>
              <option value="No">Variable</option>
            </select>
          </div>

          <div style={{
            marginBottom: '15px'
          }}>
            <label style={{
              display: 'block',
              color: '#2c3e50',
              fontWeight: 600,
              fontSize: '0.95rem',
              marginBottom: '8px'
            }}>One Time</label>
            <select 
              name="oneTime" 
              value={filterOptions.oneTime} 
              onChange={handleFilterChange}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '2px solid #e0e7ff',
                fontSize: '0.95rem',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="">All</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div style={{
            marginBottom: '20px'
          }}>
            <label style={{
              display: 'block',
              color: '#2c3e50',
              fontWeight: 600,
              fontSize: '0.95rem',
              marginBottom: '8px'
            }}>Amount Range</label>
            <select 
              name="amount" 
              value={filterOptions.amount} 
              onChange={handleFilterChange}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '2px solid #e0e7ff',
                fontSize: '0.95rem',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="">All</option>
              <option value="lessThan1000">Less than 1000</option>
              <option value="1000to5000">1000 to 5000</option>
              <option value="moreThan5000">More than 5000</option>
            </select>
          </div>

          <button
            onClick={applyFilter}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(45deg, #3498db, #2980b9)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)'
            }}
          >
            Apply Filter
          </button>
        </div>
      </div>
    )}
  </div>

  <button 
    className="create-btn" 
    onClick={() => setIsCreateModalOpen(true)}
    style={{
      padding: '8px 16px',
      background: 'linear-gradient(45deg, #ff5722, #f4511e)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(244, 81, 30, 0.2)'
    }}
  >
    Create
  </button>
</div>

      </header>

      {view === "card" ? (
        <div className="card-view">
          {filteredData.length > 0 ? (
            filteredData.map((allowance) => (
              <div className="allowance-card" key={allowance._id}>
                <div className="card-icon">
                  {allowance.name.charAt(0).toUpperCase()}
                </div>
                <div className="card-content">
                  <h3>{allowance.name}</h3>
                  <p>Amount: {allowance.amount}</p>
                  <p>One Time: {allowance.oneTime}</p>
                  <p>Taxable: {allowance.taxable}</p>
                </div>
                <div className="card-actions">
                  <button
                    className="allowance-card-edit-button"
                    onClick={() => handleEdit(allowance._id)}
                  >
                    <FaEdit size={20} />
                  </button>
                  <button
                    className="allowance-card-delete-button"
                    onClick={() => handleDelete(allowance._id)}
                  >
                    <FaTrash size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No Allowances Found</p>
          )}
        </div>
      ) : (
        <div className="list-view">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th className="sticky-column">Allowance</th>
                  <th className="scrollable-column">Specific Employees</th>
                  <th className="scrollable-column">Excluded Employees</th>
                  <th className="scrollable-column">Is Taxable</th>
                  <th className="scrollable-column">Is Condition Based</th>
                  <th className="scrollable-column">Condition</th>
                  <th className="scrollable-column">Is Fixed</th>
                  <th className="scrollable-column">Amount</th>
                  <th className="scrollable-column">Based On</th>
                  <th className="scrollable-column">Rate</th>
                  <th className="sticky-column">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((allowance) => (
                  <tr key={allowance._id}>
                    <td className="sticky-column">{allowance.name}</td>
                    <td>-</td>
                    <td>-</td>
                    <td>{allowance.taxable}</td>
                    <td>No</td>
                    <td>-</td>
                    <td>{allowance.fixed ? "Yes" : "No"}</td>
                    <td>{allowance.amount}</td>
                    <td>-</td>
                    <td>-</td>
                    <td className="sticky-column">
                      <button
                        className="all-list-edit-btn"
                        onClick={() => handleEdit(allowance._id)}
                      >
                        <FaEdit size={20}/>
                      </button>
                      <button
                        className="all-list-delete-btn"
                        onClick={() => handleDelete(allowance._id)}
                      >
                        <FaTrash size={18}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isCreateModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setIsCreateModalOpen(false)}>×</button>
            <CreateAllowance
              addAllowance={(newAllowance) => {
                setAllowancesData(prev => [...prev, newAllowance]);
                setFilteredData(prev => [...prev, newAllowance]);
                setIsCreateModalOpen(false);
              }}
            />
          </div>
        </div>
      )}




{isEditModalOpen && (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  }}>
    <div style={{
      background: 'linear-gradient(to bottom, #ffffff, #f8fafc)',
      padding: '25px',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      width: '90%',
      maxWidth: '800px',
      position: 'relative'
    }}>

      <h3 style={{
        background: 'linear-gradient(45deg, #3498db, #2980b9)',
        padding: '15px',
        borderRadius: '8px',
        border: '2px solid #2980b9',
        color: 'white',
        fontWeight: 700,
        marginBottom: '25px',
        fontSize: '1.5rem',
        textAlign: 'center',
        boxShadow: '0 4px 15px rgba(52, 152, 219, 0.2)'
      }}>
        Edit Allowance
      </h3>

      <form onSubmit={handleEditSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '15px'
        }}>
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <label style={{
              color: '#2c3e50',
              fontWeight: 600,
              fontSize: '0.95rem'
            }}>Code</label>
            <input
              type="text"
              value={editFormData.code}
              onChange={(e) => setEditFormData({ ...editFormData, code: e.target.value })}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #e0e7ff',
                fontSize: '0.95rem',
                transition: 'all 0.3s ease',
                background: 'linear-gradient(to bottom, #ffffff, #f8fafc)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
            />
          </div>
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <label style={{
              color: '#2c3e50',
              fontWeight: 600,
              fontSize: '0.95rem'
            }}>Name</label>
            <input
              type="text"
              value={editFormData.name}
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #e0e7ff',
                fontSize: '0.95rem',
                transition: 'all 0.3s ease',
                background: 'linear-gradient(to bottom, #ffffff, #f8fafc)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
            />
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '15px'
        }}>
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <label style={{
              color: '#2c3e50',
              fontWeight: 600,
              fontSize: '0.95rem'
            }}>Amount</label>
            <input
              type="number"
              value={editFormData.amount}
              onChange={(e) => setEditFormData({ ...editFormData, amount: Number(e.target.value) })}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #e0e7ff',
                fontSize: '0.95rem',
                transition: 'all 0.3s ease',
                background: 'linear-gradient(to bottom, #ffffff, #f8fafc)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
            />
          </div>
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <label style={{
              color: '#2c3e50',
              fontWeight: 600,
              fontSize: '0.95rem'
            }}>One Time</label>
            <select
              value={editFormData.oneTime}
              onChange={(e) => setEditFormData({ ...editFormData, oneTime: e.target.value })}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #e0e7ff',
                fontSize: '0.95rem',
                background: 'linear-gradient(to bottom, #ffffff, #f8fafc)',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '15px'
        }}>
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <label style={{
              color: '#2c3e50',
              fontWeight: 600,
              fontSize: '0.95rem'
            }}>Taxable</label>
            <select
              value={editFormData.taxable}
              onChange={(e) => setEditFormData({ ...editFormData, taxable: e.target.value })}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #e0e7ff',
                fontSize: '0.95rem',
                background: 'linear-gradient(to bottom, #ffffff, #f8fafc)',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <label style={{
              color: '#2c3e50',
              fontWeight: 600,
              fontSize: '0.95rem'
            }}>Fixed</label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginTop: '8px',
              background: 'linear-gradient(to right, #f8fafc, #ffffff)',
              padding: '10px',
              borderRadius: '8px',
              border: '2px solid #e0e7ff'
            }}>
              <input
                type="checkbox"
                checked={editFormData.fixed}
                onChange={(e) => setEditFormData({ ...editFormData, fixed: e.target.checked })}
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer'
                }}
              />
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end',
          marginTop: '20px'
        }}>
          <button
            type="submit"
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(45deg, #3498db, #2980b9)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)'
            }}
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => setIsEditModalOpen(false)}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(45deg, #e74c3c, #c0392b)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(231, 76, 60, 0.3)'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}



    </div>
  );
};

export default Allowances;



