import ContactMessage from "../models/ContactMessage.js";

export async function createContactMessage(req, res, next) {
  try {
    const message = await ContactMessage.create(req.body);
    res.status(201).json({ message: "Contact message saved", data: message });
  } catch (error) {
    next(error);
  }
}

export async function getContactMessages(req, res, next) {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    next(error);
  }
}

export async function updateContactMessageStatus(req, res, next) {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      res.status(404);
      throw new Error("Contact message not found");
    }

    message.status = req.body.status;
    const updated = await message.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

export async function deleteContactMessage(req, res, next) {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      res.status(404);
      throw new Error("Contact message not found");
    }

    await message.deleteOne();
    res.json({ message: "Contact message deleted" });
  } catch (error) {
    next(error);
  }
}