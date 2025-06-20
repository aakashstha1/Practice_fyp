import Request from "../models/request.model.js";
import User from "../models/user.model.js";

export const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("user", "name email role isVerified")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      total: requests.length,
      requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch instructor requests",
      error: error.message,
    });
  }
};

export const getReqById = async (req, res) => {
  try {
    const { reqId } = req.params;
    const request = await Request.findById(reqId);
    if (!request) return res.status(404).json({ message: "Request not found" });
    res.status(200).json({ request });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch request!", error: error.message });
  }
};

export const approveInstructorRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await InstructorRequest.findById(requestId).populate(
      "user"
    );
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    const user = request.user;
    user.role = "instructor";
    user.isVerified = true;

    request.status = "approved";

    await user.save();
    await request.save();

    res.status(200).json({ message: "Request approved", user });
  } catch (error) {
    res.status(500).json({ message: "Approval failed", error: error.message });
  }
};

// 3. Reject Instructor Request
export const rejectInstructorRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await InstructorRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    // Remove document URLs (if stored in cloud, add deletion logic here)
    request.documents = {};
    request.status = "rejected";
    request.rejectionDate = new Date();

    await request.save();

    res
      .status(200)
      .json({ message: "Request rejected. User may reapply in 24 hours." });
  } catch (error) {
    res.status(500).json({ message: "Rejection failed", error: error.message });
  }
};

// 4. Admin fetch all requests
export const getAllInstructorRequests = async (req, res) => {
  try {
    const requests = await InstructorRequest.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({ requests });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch requests", error: error.message });
  }
};
