
import {Organization} from "../model/organization.js";
import {User }from "../model/user.js";



const createOrganization = async (req, res) => {
  const data = req.body;

  try {
    const user = await User.findById(data.owner);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newOrg = new Organization({
      company_name: data.company_name,
      size: data.size,
      sector: data.sector,
      owner: user._id,
      product: data.product
    });

    const savedOrg = await newOrg.save();

    // ✅ Update phoneNumber & isOrganization flag in User
    await User.findByIdAndUpdate(user._id, {
      phoneNumber:data.phoneNumber,
      isOrganization: 1,
    });

    res.status(201).json({
      msg: "Organization created successfully",
      id: savedOrg._id.toString(),
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};






const getOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find({ isDeleted: false }).populate("owner", "name email");
    res.status(200).json({ organizations });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch organizations", details: err.message });
  }
};


const getOrganizationById = async (req, res) => {
  const { id } = req.params;

  try {
    const organization = await Organization.findOne({ _id: id, isDeleted: false }).populate("owner", "name email");
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.status(200).json({ organization });
  } catch (err) {
    res.status(500).json({ error: "Error fetching organization", details: err.message });
  }
};

const updateOrganization = async (req, res) => {
  const { id } = req.params;
  const { company_name, size, sector } = req.body;
  console.log(req.user.userId)
  try {
    const organization = await Organization.findById(id);

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }
    console.log(organization)
    // Optional: Only allow the owner to update
    if (organization.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Forbidden: Not the owner" });
    }

    // Update fields
    if (company_name) organization.company_name = company_name;
    if (size) organization.size = size;
    if (sector) organization.sector = sector;

    await organization.save();

    res.status(200).json({
      message: "Organization updated successfully",
      organization,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update organization", details: err.message });
  }
};


const softDeleteOrganization = async (req, res) => {
  const { id } = req.params;

  try {
    const org = await Organization.findById(id);

    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

    
    org.isDeleted = true;
    await org.save();

    res.status(200).json({ message: "Organization soft-deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete organization", details: error.message });
  }
};


export { createOrganization ,getOrganizations,getOrganizationById,updateOrganization,softDeleteOrganization };
