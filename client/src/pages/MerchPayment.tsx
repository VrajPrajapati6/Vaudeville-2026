import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import PiratePageLayout from "@/components/layout/PiratePageLayout";
import { useToast } from "@/hooks/use-toast";
import qrCode from "@/assets/images/qrimg.png";

type FormData = {
  name: string;
  transactionId: string;
  mobileNumber: string;
  rollNumber: string;
  year: string;
  branch: string;
  institute: string;
  size: string;
  screenshot: FileList;
};


export default function MerchPayment() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ mode: "onTouched" });

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("transactionId", data.transactionId);
      formData.append("mobileNumber", data.mobileNumber);
      formData.append("rollNumber", data.rollNumber);
      formData.append("year", data.year);
      formData.append("branch", data.branch);
      formData.append("institute", data.institute);
      formData.append("size", data.size);
      formData.append("screenshot", data.screenshot[0]);

      const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";
      const response = await fetch(`${API_URL}/api/merch/order`, {
        method: "POST",
        body: formData, // no Content-Type header — browser sets multipart boundary
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Submission failed. Please try again.");
      }

      toast({
        title: "⚓ Order Submitted!",
        description: "Your payment details have been received. We'll verify and confirm shortly.",
        variant: "success",
        duration: 4000,
      });

      reset();
      setPreviewUrl(null);
      setTimeout(() => setLocation("/merch"), 4000);
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full bg-black/40 border text-white p-2.5 rounded focus:outline-none focus:border-[#d4af37] transition font-cinzel text-sm ${
      hasError ? "border-red-500" : "border-gray-600"
    }`;

  const selectClass = (hasError: boolean) =>
    `w-full bg-[#0a0a0a] border text-white p-2.5 rounded focus:outline-none focus:border-[#d4af37] transition appearance-none cursor-pointer font-cinzel text-sm ${
      hasError ? "border-red-500" : "border-gray-600"
    }`;

  const errMsg = (msg?: string) =>
    msg ? <span className="text-red-500 text-xs block mt-1">⚠ {msg}</span> : null;

  return (
    <PiratePageLayout title="Complete Your Order">
      <div className="max-w-2xl mx-auto mt-6 mb-16">

        {/* ── QR Code Section ─────────────────────────────────────── */}
        <div className="bg-black/60 border border-[#d4af37]/40 rounded-lg p-6 mb-6 text-center shadow-2xl">
          <h2 className="font-pirata text-3xl text-[#d4af37] mb-2">Step 1: Pay via UPI</h2>
          <p className="font-cinzel text-gray-400 text-sm mb-4">
            Scan the QR code below to pay <span className="text-[#d4af37] font-bold">₹599</span> for your Vaudeville T-Shirt.
          </p>
          <div className="flex justify-center">
            <img
              src={qrCode}
              alt="UPI QR Code"
              className="w-52 h-52 object-contain border-2 border-[#d4af37]/60 rounded-lg p-2 bg-white"
            />
          </div>
          <p className="font-cinzel text-gray-500 text-xs mt-3">
            After payment, note your <span className="text-[#d4af37]">Transaction/UTR ID</span> and screenshot the confirmation.
          </p>
        </div>

        {/* ── Form Section ────────────────────────────────────────── */}
        <div className="bg-black/60 border border-[#d4af37]/40 rounded-lg p-8 shadow-2xl">
          <h2 className="font-pirata text-3xl text-[#d4af37] mb-2 text-center">Step 2: Submit Details</h2>
          <p className="font-cinzel text-gray-400 text-sm text-center mb-8">
            Fill in your details and upload the payment screenshot to confirm your order.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Name */}
            <div className="space-y-1">
              <label className="text-gray-300 text-sm font-cinzel">Full Name</label>
              <input
                {...register("name", { required: "Name is required" })}
                className={inputClass(!!errors.name)}
                placeholder="Jack Sparrow"
              />
              {errMsg(errors.name?.message)}
            </div>

            {/* Transaction ID */}
            <div className="space-y-1">
              <label className="text-gray-300 text-sm font-cinzel">Transaction / UTR ID</label>
              <input
                {...register("transactionId", { required: "Transaction ID is required" })}
                className={inputClass(!!errors.transactionId)}
                placeholder="e.g. 425612349876"
              />
              {errMsg(errors.transactionId?.message)}
            </div>

            {/* Screenshot upload */}
            <div className="space-y-1">
              <label className="text-gray-300 text-sm font-cinzel">Payment Screenshot</label>
              <input
                type="file"
                accept="image/*"
                {...register("screenshot", { required: "Screenshot is required" })}
                onChange={(e) => {
                  register("screenshot").onChange(e);
                  handleScreenshotChange(e);
                }}
                className={`w-full bg-black/40 border text-gray-300 p-2.5 rounded cursor-pointer font-cinzel text-xs file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-cinzel file:bg-[#d4af37] file:text-black hover:file:bg-yellow-500 file:cursor-pointer transition ${
                  errors.screenshot ? "border-red-500" : "border-gray-600"
                }`}
              />
              {errMsg(errors.screenshot?.message as string)}
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Screenshot preview"
                  className="mt-2 max-h-36 rounded border border-[#d4af37]/40 object-contain"
                />
              )}
            </div>

            {/* Mobile */}
            <div className="space-y-1">
              <label className="text-gray-300 text-sm font-cinzel">Mobile Number</label>
              <input
                {...register("mobileNumber", {
                  required: "Mobile number is required",
                  pattern: { value: /^\d{10}$/, message: "Mobile number must be exactly 10 digits" },
                })}
                className={inputClass(!!errors.mobileNumber)}
                placeholder="9876543210"
                maxLength={10}
              />
              {errMsg(errors.mobileNumber?.message)}
            </div>

            {/* Size + Roll No — 2 col */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-gray-300 text-sm font-cinzel">T-Shirt Size</label>
                <select
                  {...register("size", { required: "Please select a size" })}
                  className={selectClass(!!errors.size)}
                >
                  <option value="">Select Size</option>
                  {["S", "M", "L", "XL"].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errMsg(errors.size?.message)}
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 text-sm font-cinzel">Roll Number</label>
                <input
                  {...register("rollNumber", { required: "Roll number is required" })}
                  className={inputClass(!!errors.rollNumber)}
                  placeholder="24BCE206"
                />
                {errMsg(errors.rollNumber?.message)}
              </div>
            </div>

            {/* Year + Branch — 2 col */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-gray-300 text-sm font-cinzel">Year</label>
                <select
                  {...register("year", { required: "Please select a year" })}
                  className={selectClass(!!errors.year)}
                >
                  <option value="">Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
                {errMsg(errors.year?.message)}
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 text-sm font-cinzel">Branch</label>
                <input
                  type="text"
                  placeholder="e.g. CSE, Mechanical…"
                  {...register("branch", { required: "Branch is required" })}
                  className={inputClass(!!errors.branch)}
                />
                {errMsg(errors.branch?.message)}
              </div>
            </div>

            {/* Institute */}
            <div className="space-y-1">
              <label className="text-gray-300 text-sm font-cinzel">Institute Name</label>
              <input
                {...register("institute", { required: "Institute name is required" })}
                className={inputClass(!!errors.institute)}
                placeholder="e.g. Institute of Technology"
              />
              {errMsg(errors.institute?.message)}
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-[#d4af37]/20">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-[#d4af37] text-black font-cinzel font-bold py-3 text-base uppercase tracking-widest hover:bg-yellow-500 transition-all ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Submitting..." : "Confirm Order"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </PiratePageLayout>
  );
}
