import NewsletterSubscriber from "../models/NewsletterSubscriber.js";

export async function subscribeNewsletter(req, res, next) {
  try {
    const subscriber = await NewsletterSubscriber.findOneAndUpdate(
      { email: req.body.email },
      { email: req.body.email, source: req.body.source || "website", isActive: true },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ message: "Newsletter subscription saved", data: subscriber });
  } catch (error) {
    next(error);
  }
}

export async function getNewsletterSubscribers(req, res, next) {
  try {
    const subscribers = await NewsletterSubscriber.find().sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (error) {
    next(error);
  }
}

export async function unsubscribeNewsletter(req, res, next) {
  try {
    const subscriber = await NewsletterSubscriber.findOne({ email: req.params.email.toLowerCase() });
    if (!subscriber) {
      res.status(404);
      throw new Error("Subscriber not found");
    }

    subscriber.isActive = false;
    await subscriber.save();
    res.json({ message: "Newsletter subscription disabled" });
  } catch (error) {
    next(error);
  }
}