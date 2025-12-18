import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Table, Button, Badge, Spinner, Alert } from 'react-bootstrap';

const AdminDashboard = ({ token }) => {
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchPendingRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5001/leaves/admin/pending', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingLeaves(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching requests", err);
      setMessage({ type: 'danger', text: 'Failed to load pending requests' });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const handleAction = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5001/leaves/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessage({ 
        type: 'success', 
        text: `Request successfully ${newStatus}!` 
      });
      fetchPendingRequests();
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ 
        type: 'danger', 
        text: 'Failed to update request. Please try again.' 
      });
    }
  };

  return (
    <div className="min-vh-100 bg-light py-5">
      <Container>
        <Row className="mb-4">
          <Col>
            <h2 className="fw-bold">Admin Dashboard</h2>
            <p className="text-muted">Review and manage employee leave requests</p>
          </Col>
          <Col className="text-end">
            <Button 
              variant="outline-primary" 
              onClick={fetchPendingRequests}
              disabled={loading}
            >
              Refresh
            </Button>
          </Col>
        </Row>

        {message.text && (
          <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
            {message.text}
          </Alert>
        )}

        <Card className="shadow-sm border-0">
          <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
            <h5 className="mb-0 text-primary">Pending Approvals</h5>
            <Badge bg="warning" pill>
              {pendingLeaves.length} Request{pendingLeaves.length !== 1 ? 's' : ''}
            </Badge>
          </Card.Header>
          <Card.Body className="p-0">
            <Table responsive hover className="mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>Employee</th>
                  <th>Dates</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Submitted</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <Spinner animation="border" variant="primary" />
                      <p className="mt-2 text-muted">Loading pending requests...</p>
                    </td>
                  </tr>
                ) : pendingLeaves.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      <i className="bi bi-check-circle-fill fs-4 text-success"></i>
                      <p className="mt-2">No pending requests. All caught up!</p>
                    </td>
                  </tr>
                ) : (
                  pendingLeaves.map((leave) => (
                    <tr key={leave._id}>
                      <td>
                        <div>
                          <strong>{leave.user?.name || 'Unknown User'}</strong>
                          <br />
                          <small className="text-muted">{leave.user?.email || 'No email'}</small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <strong>{new Date(leave.startDate).toLocaleDateString()}</strong>
                          <br />
                          <small>to</small>
                          <br />
                          <strong>{new Date(leave.endDate).toLocaleDateString()}</strong>
                        </div>
                      </td>
                      <td>
                        <Badge bg="info" className="fs-6">{leave.totalDays}</Badge>
                        <br />
                        <small>day{leave.totalDays !== 1 ? 's' : ''}</small>
                      </td>
                      <td>
                        <div className="reason-cell" style={{ maxWidth: '250px' }}>
                          {leave.reason}
                        </div>
                      </td>
                      <td>
                        <small className="text-muted">
                          {new Date(leave.createdAt).toLocaleDateString()}
                        </small>
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <Button 
                            variant="success" 
                            size="sm"
                            onClick={() => handleAction(leave._id, 'approved')}
                            className="px-3"
                          >
                            <i className="bi bi-check-circle me-1"></i> Approve
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleAction(leave._id, 'rejected')}
                            className="px-3"
                          >
                            <i className="bi bi-x-circle me-1"></i> Reject
                          </Button>
                        </div>
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