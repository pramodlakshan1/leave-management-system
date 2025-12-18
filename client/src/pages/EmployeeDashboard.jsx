import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Table, Badge, Modal, Form, Spinner } from 'react-bootstrap';

const EmployeeDashboard = ({ token }) => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Form State matching your Schema
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    totalDays: 0
  });

  // 1. Fetch Leaves from Backend
  const fetchLeaves = async () => {
    try {
      const res = await axios.get('http://localhost:5001/leaves/my-leaves', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaves(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching leaves", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // 2. Submit New Leave
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/leaves', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      fetchLeaves(); // Refresh the list
    } catch (err) {
      alert("Failed to apply for leave");
    }
  };

  const getStatusBadge = (status) => {
    const colors = { pending: 'warning', approved: 'success', rejected: 'danger' };
    return <Badge bg={colors[status] || 'secondary'} className="text-capitalize">{status}</Badge>;
  };

  return (
    <div className="min-vh-100 bg-light py-5">
      <Container>
        <Row className="mb-4 align-items-center">
          <Col>
            <h2 className="fw-bold">My Leave Requests</h2>
          </Col>
          <Col className="text-end">
            <Button variant="primary" onClick={() => setShowModal(true)}>+ Apply Leave</Button>
          </Col>
        </Row>

        <Card className="shadow-sm border-0">
          <Card.Body className="p-0"> {/* Flush table look */}
            <Table responsive hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-5"><Spinner animation="border" /></td></tr>
                ) : (
                  leaves.map((leave) => (
                    <tr key={leave._id}>
                      <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                      <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                      <td>{leave.totalDays}</td>
                      <td>{leave.reason}</td>
                      <td>{getStatusBadge(leave.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>

      {/* Leave Application Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Apply for Leave</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control 
                    type="date" 
                    required 
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control 
                    type="date" 
                    required 
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Total Days</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="e.g. 3" 
                required
                onChange={(e) => setFormData({...formData, totalDays: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Reason</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                required
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Submit Application</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default EmployeeDashboard;