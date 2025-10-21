import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

export default function BidsPlacedByMe({ bids, setBids, fetchBids }) {
  const [deleteBidId, setDeleteBidId] = useState(null);
  const [showDeleteBidModal, setShowDeleteBidModal] = useState(false);

  const token = sessionStorage.getItem("token");
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const handleDeleteBidClick = (bidId) => {
    setDeleteBidId(bidId);
    setShowDeleteBidModal(true);
  };

  const confirmDeleteBid = async () => {
    try {
      await fetch(`http://localhost:8080/api/bids/${deleteBidId}`, {
        method: "DELETE",
        headers,
      });
      alert("Bid deleted successfully!");
      setShowDeleteBidModal(false);
      fetchBids();
    } catch (err) {
      console.error(err);
      alert("Failed to delete bid: " + err.message);
    }
  };

  return (
    <>
      <div className="table-responsive">
        <table className="table table-bordered table-hover text-center">
          <thead>
            <tr>
              <th>Task</th>
              <th>Credits Offered</th>
              <th>Description</th>
              <th>Estimated Days</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bids.map((bid) => (
              <tr key={bid.id}>
                <td style={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {bid.taskTitle || bid.task?.title || "—"}
                </td>
                <td>{bid.credits}</td>
                <td style={{ maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {bid.description}
                </td>
                <td>{bid.estimatedDays || "—"}</td>
                <td>
                  {bid.taskStatus !== "ALLOCATED" ? (
                    <Button variant="danger" size="sm" onClick={() => handleDeleteBidClick(bid.id)}>Delete</Button>
                  ) : (
                    <span>Cannot delete (allocated)</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showDeleteBidModal} onHide={() => setShowDeleteBidModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this bid?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteBidModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDeleteBid}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
