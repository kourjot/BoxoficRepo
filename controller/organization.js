
import {Organization} from "../model/organization.js";
import {User }from "../model/user.js";

import * as ERROR from "../common/error_message.js";

const createOrganization = async (req, res, next) => {
  const data = req.body;

  try {
    //  Get owner from JWT
    const ownerId = req.user?.userId;
    if (!ownerId) throw new Error(ERROR.USER_NOT_FOUND);

    //  Required field validations
    if (!data.company_name) throw new Error(ERROR.NAME);
    if (!data.size) throw new Error("200::422::Organization size is required.");
    if (!data.sector) throw new Error("200::422::Organization sector is required.");

    const user = await User.findById(ownerId);
    if (!user) throw new Error(ERROR.USER_NOT_FOUND);

    //  Create Organization
    const newOrg = new Organization({
      company_name: data.company_name,
      size: data.size,
      sector: data.sector,
      owner: user._id,
      productInfo: data.product || "",
    });

    const savedOrg = await newOrg.save();

    // ✅ Update user org status
    await User.findByIdAndUpdate(user._id, {
      phoneNumber: data.phoneNumber || user.phoneNumber,
      isOrganization: 1,
      organization: savedOrg._id
      
    });

    return res.status(201).json({
      status: true,
      message: "Organization created successfully"
    });
  } catch (err) {
    next(err);
  }
};







const getOrganizations = async (req, res, next) => {
  try {
    const organizations = await Organization.find({ isDeleted: false }).populate("owner", "name email");
    res.status(200).json({ organizations });
  } catch (err) {
    next(new Error(ERROR.INTERNAL_ERROR));
  }
};


const getOrganizationById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const organization = await Organization.findOne({ _id: id, isDeleted: false }).populate("owner", "name email");
    if (!organization) throw new Error(ERROR.DATA_NOT_FOUND);

    res.status(200).json({ organization });
  } catch (err) {
    next(err);
  }
};

const updateOrganization = async (req, res, next) => {
  const { id } = req.params;
  const { company_name, size, sector } = req.body;


  try {
    const organization = await Organization.findById(id);
    console.log(organization)
    if (!organization) throw new Error(ERROR.DATA_NOT_FOUND);

    if (organization.owner.toString() !== req.user.userId) {
      throw new Error("200::403::Forbidden: Not the owner");
    }
    console.log(req.user.userId)

    if (company_name) organization.company_name = company_name;
    if (size) organization.size = size;
    if (sector) organization.sector = sector;

    await organization.save();

    res.status(200).json({
      message: "Organization updated successfully",
      organization,
    });
  } catch (err) {
    next(err);
  }
};

const softDeleteOrganization = async (req, res, next) => {
  const { id } = req.params;

  try {
    const org = await Organization.findById(id);
    if (!org) throw new Error(ERROR.DATA_NOT_FOUND);

    org.isDeleted = true;
    await org.save();

    res.status(200).json({ message: "Organization soft-deleted successfully" });
  } catch (error) {
    next(new Error(ERROR.INTERNAL_ERROR));
  }
};


export { createOrganization ,getOrganizations,getOrganizationById,updateOrganization,softDeleteOrganization };
