{showFilterModal && (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
  }}>
    <div style={{
      background: "white",
      width: "90%",
      padding: "20px",
      borderRadius: "8px",
      position: "relative",
      maxHeight: "calc(90vh - 100px)",
      overflowY: "auto"
    }}>
      <h3>Specific Employees</h3>
      <button style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        background: "transparent",
        border: "none",
        fontSize: "1.5em",
        cursor: "pointer"
      }} onClick={() => setShowFilterModal(false)}>
        ×
      </button>

      <input
        type="text"
        placeholder="Search....."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
          border: "1px solid #e80505",
          borderRadius: "5px"
        }}
      />

      <div style={{
        maxHeight: "200px",
        overflowY: "auto",
        padding: "5px"
      }}>
        {filteredEmployees.map((employee) => (
          <div key={employee.id} style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px",
            borderBottom: "1px solid #eee"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center"
            }}>
              <span style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "30px",
                height: "30px",
                backgroundColor: "#b5b0b0",
                borderRadius: "50%",
                fontSize: "13px",
                fontWeight: "bold",
                color: "#ffffff",
                textTransform: "uppercase",
                border: "2px solid #ccc"
              }}>
                {getInitials(employee.name)}
              </span>
              <span style={{
                marginLeft: "10px",
                fontSize: "15px"
              }}>
                {employee.name} - {employee.role}
              </span>
            </div>

            <button style={{
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer"
            }} onClick={() => handleEmployeeSelect(employee.name)}>
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
)}
