import z from "zod";

const fieldValidators = {
  fullName: z.string().min(1, "Full name is required"),
  workEmail: z.email("Please enter a valid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  companyName: z.string().min(1, "Company name is required"),
  companyAddress: z.string().min(1, "Company address is required"),
  companyWebsite: z.string(),
  organizationType: z.string().min(1, "Organization type is required"),
  gpuType: z.string().min(1, "GPU type is required"),
  serverCount: z.string().min(1, "Server count is required"),
  oem: z.string().min(1, "OEM is required"),
  oemOther: z.string(),
  serverLocation: z.string().min(1, "Server location is required"),
};

export const workEmailValidator = fieldValidators.workEmail;

export const schema = z.object(fieldValidators).refine(
  (data) => {
    if (data.oem === "Other") return data.oemOther && data.oemOther.trim().length > 0;

    return true;
  },
  { path: ["oemOther"], message: "Please specify the OEM name" },
);

export type FormValues = z.infer<typeof schema>;
