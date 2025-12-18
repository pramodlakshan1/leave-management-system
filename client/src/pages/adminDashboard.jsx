import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Table, Button, Badge, Spinner, Alert } from 'react-bootstrap';

const AdminDashboard = ({ token }) => {
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 1. Fetch only pending leaves
  const fetchPendingRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5001/leaves/admin/pending', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingLeaves(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching requests", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  // 2. Handle Approve/Reject Actions
  const handleAction = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5001/leaves/admin/update/${id}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Show success message and refresh list
      setMessage({ type: 'success', text: `Request successfully ${newStatus}!` });
      fetchPendingRequests();
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'danger', text: 'Failed to update request.' });
    }
  };

  return (
    <div className="min-vh-100 bg-light py-5">
      <Container>
        <Row className="mb-4">
          <Col>
            <h2 className="fw-bold">Admin Management</h2>
            <p className="text-muted">Review and manage employee leave requests</p>
          </Col>
        </Row>

        {message.text && (
          <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
            {message.text}
          </Alert>
        )}

        <Card className="shadow-sm border-0">
          <Card.Header className="bg-white py-3">
            <h5 className="mb-0 text-primary">Pending Approvals</h5>
          </Card.Header>
          <Card.Body className="p-0">
            <Table responsive hover className="mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>Employee ID</th>
                  <th>Dates</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      <Spinner animation="border" variant="primary" />
                    </td>
                  </tr>
                ) : pendingLeaves.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      No pending requests at this time.
                    </td>
                  </tr>
                ) : (
                  pendingLeaves.map((leave) => (
                    <tr key={leave._id}>
                      <td>
                        <span className="fw-bold text-dark">{leave.user?.name || "User ID: " + leave.user}</span>
                      </td>
                      <td>
                        <small className="text-muted">
                          {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                        </small>
                      </td>
                      <td><Badge bg="info" text="dark">{leave.totalDays} Days</Badge></td>
                      <td><div className="text-truncate" style={{maxWidth: '200px'}}>{leave.reason}</div></td>
                      <td className="text-center">
                        <Button 
                          variant="success" 
                          size="sm" 
                          className="me-2 px-3"
                          onClick={() => handleAction(leave._id, 'approved')}
                        >
                          Approve
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm" 
                          className="px-3"
                          onClick={() => handleAction(leave._id, 'rejected')}
                        >
                          Reject
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default AdminDashboard;