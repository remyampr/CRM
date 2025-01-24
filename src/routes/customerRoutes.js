const express = require("express");
const router = express.Router();
const Customer = require("../Model/customer");
const mongoose = require("mongoose");
module.exports = router;

const validateCustomerInput = (req, res, next) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res
      .status(400)
      .json({ message: "Name and email are required fields" });
  }
  next();
};
router.post("/", validateCustomerInput, async (req, res, next) => {
  try {
    const { name, email, phone, location, isActive } = req.body;
    const newCustomer = new Customer({
      name,
      email,
      phone,
      location,
      isActive,
    });
    await newCustomer.save();
    res.status(201).json({ message: "Customer added", customer: newCustomer });
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    let customers;
    const { name, email, location, page = 1, limit = 10 } = req.query;
    const pageNumer = parseInt(page);
    const limitNumer = parseInt(limit);
    const skip = (pageNumer - 1) * limitNumer;
    const filter = [];
    if (name) {
      filter.push({ name: { $regex: name, $options: "i" } });
    }
    if (email) {
      filter.push({ email: { $regex: email, $options: "i" } });
    }
    if (location) {
      filter.push({ location: { $regex: location, $options: "i" } });
    }

    if (filter.length > 0) {
      customers = await Customer.find({ $or: filter })
        .skip(skip)
        .limit(limitNumer);
    } else {
      customers = await Customer.find().skip(skip).limit(limitNumer);
    }
    res.status(200).json({
      customers,
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
      },
    });
  } catch (err) {
    next(err);
  }
});
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ObjectId format" });
    }

    const customer = await Customer.findById(id);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });
    res.status(200).json(customer);
  } catch (err) {
    next(err);
  }
});
router.put("/:id", async (req, res, next) => {
  try {
    const { name, email, phone, location, isActive } = req.body;
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, location, isActive },
      { new: true }
    );
    if (!updatedCustomer)
      return res.status(404).json({ message: "Customer not found" });

    res
      .status(200)
      .json({ message: "customer details updated", customer: updatedCustomer });
  } catch (err) {
    next(err);
  }
});
router.patch("/:id", async (req, res, next) => {
  try {
    const { name, email, phone, location, isActive } = req.body;
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, location, isActive },
      { new: true }
    );

    if (!updatedCustomer)
      return res.status(404).json({ message: "Customer not found" });

    res
      .status(200)
      .json({ message: "customer details updated", customer: updatedCustomer });
  } catch (err) {
    next(err);
  }
});
router.delete("/:id", async (req, res, next) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);

    if (!deletedCustomer)
      return res.status(404).json({ message: "Customer not found" });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
