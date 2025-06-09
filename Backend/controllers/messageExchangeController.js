const asyncHandler = require('express-async-handler');
const Message = require('../models/Message');
const Exchange = require('../models/Exchange');
const User = require('../models/Users'); // Use correct filename
const Offer = require('../models/Offer');
const Request = require('../models/Request');
const { createNotification } = require('./notificationController'); // Import notification helper

// --- Message Controllers ---

// @desc    Send a new message
// @route   POST /api/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { recipientId, content, relatedOfferId, relatedRequestId } = req.body;

  if (!recipientId || !content) {
    res.status(400);
    throw new Error('Recipient and message content are required');
  }

  const recipient = await User.findById(recipientId);
  if (!recipient) {
    res.status(404);
    throw new Error('Recipient user not found');
  }

  // Ensure user is not sending message to themselves (unless intended for self-notes, etc.)
  if (req.user._id.toString() === recipientId.toString()) {
    res.status(400);
    throw new Error('Cannot send message to yourself directly for a skill swap context.');
  }

  const message = new Message({
    sender: req.user._id, // Comes from protect middleware
    recipient: recipientId,
    content,
    relatedOffer: relatedOfferId || null,
    relatedRequest: relatedRequestId || null,
  });

  const createdMessage = await message.save();

  // Create notification for the recipient
  const senderUser = await User.findById(req.user._id).select('name');
  const notificationMessage = `New message from ${senderUser.name}`;
  const notificationLink = `/messages/${req.user._id}`; // Link back to the conversation
  await createNotification(recipientId, notificationMessage, 'new_message', notificationLink);

  // Populate sender and recipient details for immediate response
  const populatedMessage = await Message.findById(createdMessage._id)
    .populate('sender', 'name profilePicture')
    .populate('recipient', 'name profilePicture')
    .populate('relatedOffer', 'title') // Populate title of related offer
    .populate('relatedRequest', 'title'); // Populate title of related request


  res.status(201).json(populatedMessage);
});

// @desc    Get messages for the logged-in user
// @route   GET /api/messages
// @access  Private
const getMyMessages = asyncHandler(async (req, res) => {
  // Find messages where the logged-in user is either sender or recipient
  const messages = await Message.find({
    $or: [{ sender: req.user._id }, { recipient: req.user._id }],
  })
    .populate('sender', 'name profilePicture')
    .populate('recipient', 'name profilePicture')
    .populate('relatedOffer', 'title')
    .populate('relatedRequest', 'title')
    .sort({ createdAt: 1 }); // Sort by creation date ascending

  res.json(messages);
});

// @desc    Get conversation between logged-in user and another user
// @route   GET /api/messages/conversation/:otherUserId
// @access  Private
const getConversation = asyncHandler(async (req, res) => {
  const { otherUserId } = req.params;

  const conversationMessages = await Message.find({
    $or: [
      { sender: req.user._id, recipient: otherUserId },
      { sender: otherUserId, recipient: req.user._id },
    ],
  })
    .populate('sender', 'name profilePicture')
    .populate('recipient', 'name profilePicture')
    .populate('relatedOffer', 'title')
    .populate('relatedRequest', 'title')
    .sort({ createdAt: 1 }); // Sort by creation date ascending

  // Mark messages received by the current user in this conversation as read
  await Message.updateMany(
    { recipient: req.user._id, sender: otherUserId, read: false },
    { $set: { read: true } }
  );

  res.json(conversationMessages);
});


// --- Exchange Controllers ---

// @desc    Propose a new exchange
// @route   POST /api/exchanges
// @access  Private
const createExchangeProposal = asyncHandler(async (req, res) => {
  const { accepterId, offeredSkillRefId, requestedSkillRefId, proposedTerms } = req.body;

  if (!accepterId || !proposedTerms) {
    res.status(400);
    throw new Error('Accepter and proposed terms are required');
  }

  if (!offeredSkillRefId && !requestedSkillRefId) {
    res.status(400);
    throw new Error('Either an offered skill or a requested skill reference is required for the proposal');
  }

  const accepter = await User.findById(accepterId);
  if (!accepter) {
    res.status(404);
    throw new Error('Accepter user not found');
  }

  if (req.user._id.toString() === accepterId.toString()) {
    res.status(400);
    throw new Error('Cannot propose an exchange to yourself.');
  }

  let offeredSkill = null;
  if (offeredSkillRefId) {
    offeredSkill = await Offer.findById(offeredSkillRefId);
    if (!offeredSkill || offeredSkill.user.toString() !== req.user._id.toString()) {
      res.status(400);
      throw new Error('Invalid or unauthorized offered skill reference.');
    }
  }

  let requestedSkill = null;
  if (requestedSkillRefId) {
    requestedSkill = await Request.findById(requestedSkillRefId);
    if (!requestedSkill || requestedSkill.user.toString() !== accepterId.toString()) {
      res.status(400);
      throw new Error('Invalid or unauthorized requested skill reference.');
    }
  }

  const exchange = new Exchange({
    proposer: req.user._id,
    accepter: accepterId,
    offeredSkillRef: offeredSkill ? offeredSkill._id : null,
    requestedSkillRef: requestedSkill ? requestedSkill._id : null,
    proposedTerms,
  });

  const createdExchange = await exchange.save();

  // Send a message and notification to the accepter about the new proposal
  const proposerUser = await User.findById(req.user._id).select('name');
  const messageContent = `New Exchange Proposal from ${proposerUser.name}:\n\n"${proposedTerms}"\n\nView proposal in "My Exchanges".`;
  const notificationMessage = `New exchange proposal from ${proposerUser.name}`;
  const notificationLink = `/exchanges`; // Link to the exchanges list

  // Create a message for the conversation
  const notificationMessageForChat = new Message({
    sender: req.user._id,
    recipient: accepterId,
    content: messageContent,
    relatedOffer: offeredSkill ? offeredSkill._id : null,
    relatedRequest: requestedSkill ? requestedSkill._id : null,
  });
  await notificationMessageForChat.save();

  // Create a formal notification for the bell icon
  await createNotification(accepterId, notificationMessage, 'exchange_proposal', notificationLink);

  res.status(201).json(createdExchange);
});

// @desc    Get exchanges where user is proposer or accepter
// @route   GET /api/exchanges
// @access  Private
const getMyExchanges = asyncHandler(async (req, res) => {
  const exchanges = await Exchange.find({
    $or: [{ proposer: req.user._id }, { accepter: req.user._id }],
  })
    .populate('proposer', 'name profilePicture')
    .populate('accepter', 'name profilePicture')
    .populate('offeredSkillRef', 'title description')
    .populate('requestedSkillRef', 'title description')
    .sort({ createdAt: -1 }); // Latest first

  res.json(exchanges);
});

// @desc    Update exchange status (accept/reject/complete/cancel)
// @route   PUT /api/exchanges/:id
// @access  Private
const updateExchangeStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; // Only status can be updated via this route for now

  if (!status || !['accepted', 'rejected', 'completed', 'cancelled'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status update provided.');
  }

  const exchange = await Exchange.findById(req.params.id);

  if (!exchange) {
    res.status(404);
    throw new Error('Exchange not found');
  }

  // Only the accepter can accept/reject
  if (status === 'accepted' || status === 'rejected') {
    if (exchange.accepter.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to accept/reject this exchange.');
    }
    if (exchange.status !== 'pending') {
      res.status(400);
      throw new Error(`Cannot change status from ${exchange.status} to ${status}.`);
    }
  }
  // Both proposer and accepter can complete/cancel their own exchanges
  else if (status === 'completed' || status === 'cancelled') {
    if (exchange.proposer.toString() !== req.user._id.toString() && exchange.accepter.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to complete/cancel this exchange.');
    }
    if (exchange.status === 'completed' || exchange.status === 'cancelled') {
        res.status(400);
        throw new Error(`Exchange is already ${exchange.status}.`);
    }
  }

  exchange.status = status;
  const updatedExchange = await exchange.save();

  // Create notification for the other party involved in the exchange
  const otherPartyId = (exchange.proposer.toString() === req.user._id.toString())
    ? exchange.accepter
    : exchange.proposer;

  const currentUser = await User.findById(req.user._id).select('name');
  const notificationMessage = `Exchange with ${currentUser.name} updated to: ${status.toUpperCase()}`;
  const notificationLink = `/exchanges`;

  await createNotification(otherPartyId, notificationMessage, 'exchange_status_update', notificationLink);

  res.json(updatedExchange);
});


module.exports = {
  sendMessage,
  getMyMessages,
  getConversation,
  createExchangeProposal,
  getMyExchanges,
  updateExchangeStatus,
};