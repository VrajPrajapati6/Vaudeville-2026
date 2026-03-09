import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useForm, useFieldArray } from "react-hook-form";
import PiratePageLayout from "@/components/layout/PiratePageLayout";
import { events } from "@/data/eventsData";
import { useToast } from "@/hooks/use-toast";

type MemberData = {
  name: string;
  rollNo: string;
  institute: string;
  ugPg: string;
  gender: string;
  studentFaculty: string;
  mobileNo: string;
};

type FormData = {
  teamName?: string;
  members: MemberData[];
};

export default function EventRegister() {
  const [match, params] = useRoute("/register/:slug");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const event = events.find((e) => e.slug === params?.slug);

  // --- NEW ROBUST TEAM SIZE LOGIC ---
  const teamSizeStr = event?.teamSize || "1";
  const numbers = teamSizeStr.match(/\d+/g)?.map(Number) || [1];
  const maxMembers = Math.max(...numbers);
  const minMembers = teamSizeStr.toLowerCase().includes("solo") ? 1 : Math.min(...numbers);

  // An event is strictly solo ONLY if max size is 1
  const isStrictlySolo = maxMembers === 1;
  // ----------------------------------

  const { register, control, handleSubmit, reset, getValues, formState: { errors } } = useForm<FormData>({
    mode: "onTouched",
    defaultValues: {
      teamName: "",
      members: [{ name: "", rollNo: "", institute: "", ugPg: "", gender: "", studentFaculty: "", mobileNo: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FormData) => {
    if (data.members.length < minMembers) {
      toast({
        title: "Incomplete Crew",
        description: `This event requires at least ${minMembers} members.`,
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event?.slug,
          teamName: isStrictlySolo ? undefined : (data.teamName || `Solo_${data.members[0].name}`),
          members: data.members.map(member => ({
            ...member,
            rollNo: member.rollNo.toLowerCase()
          })),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: "An unknown error occurred." }));
        throw new Error(errData.error || "Registration failed. Please try again.");
      }

      const eventTitle = event?.title ?? "this event";

      toast({
        title: "Registration Successful!",
        description: `You have successfully enlisted for ${eventTitle}!`,
        variant: "default",
        duration: 3000,
      });
      reset();

      setTimeout(() => {
        setLocation(`/events`);
      }, 3000);

    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!event) {
    return (
      <PiratePageLayout title="Event Not Found">
        <div className="flex items-center justify-center h-[30vh] text-[#d4af37] text-2xl font-pirata">Lost at sea... Event not found.</div>
      </PiratePageLayout>
    );
  }

  return (
    <PiratePageLayout title={`Register: ${event.title}`}>

      <div className="relative max-w-3xl mx-auto bg-black/60 border border-[#d4af37]/40 p-8 rounded-lg mt-8 mb-16 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
        <button
          type="button"
          onClick={() => setLocation('/events')}
          className="absolute top-4 right-4 text-[#d4af37]/70 hover:text-white transition-colors z-10"
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="font-pirata text-4xl text-[#d4af37] mb-6 text-center tracking-wider">Register Now</h2>
        <p className="font-cinzel text-gray-300 mb-8 text-center text-sm md:text-base">
          Fill in the details below to secure your spot in {event.title}.
          {!isStrictlySolo && (
            <span className="block mt-2 text-yellow-500/80">
              {minMembers === maxMembers
                ? `Required: ${maxMembers} members.`
                : `Allowed: ${minMembers} to ${maxMembers} members.`}
            </span>
          )}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 font-cinzel">

          {/* Team Details Block */}
          {!isStrictlySolo && (
            <div className="space-y-2">
              <label className="text-[#d4af37] block font-bold tracking-wider text-sm">
                Team Name {fields.length === 1 && minMembers === 1 ? "(Optional for Solo)" : ""}
              </label>
              <input
                {...register("teamName", {
                  required: fields.length > 1 || minMembers > 1 ? "Team name is required" : false
                })}
                className={`w-full bg-black/40 border text-white p-3 rounded-sm focus:outline-none focus:border-[#d4af37] transition-colors ${errors.teamName ? "border-red-500" : "border-[#d4af37]/50"
                  }`}
                placeholder="The Black Pearl"
              />
              {errors.teamName && <span className="text-red-500 text-xs mt-1 block tracking-widest">{errors.teamName.message}</span>}
            </div>
          )}

          {/* Members Mapping */}
          <div className="space-y-6">
            {fields.map((item, index) => (
              <div key={item.id} className="p-6 border border-[#d4af37]/20 rounded-sm bg-black/30 relative shadow-inner">

                <div className="flex justify-between items-center mb-6 border-b border-[#d4af37]/20 pb-2">
                  <h3 className="text-[#d4af37] font-pirata text-2xl tracking-wide">
                    {isStrictlySolo ? "Player Details" : index === 0 ? "Captain (Team Leader)" : `Crew Member ${index + 1}`}
                  </h3>

                  {!isStrictlySolo && index > 0 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-400 text-xs font-bold uppercase tracking-widest transition"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-gray-300 text-xs uppercase tracking-wider font-bold">Name</label>
                    <input
                      {...register(`members.${index}.name` as const, { required: "Name is required" })}
                      className={`w-full bg-black/40 border text-white p-2.5 rounded-sm focus:outline-none focus:border-[#d4af37] transition ${errors.members?.[index]?.name ? "border-red-500" : "border-gray-600"
                        }`}
                      placeholder="Jack Sparrow"
                    />
                    {errors.members?.[index]?.name && (
                      <span className="text-red-500 text-xs block mt-1">{errors.members[index]?.name?.message}</span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-300 text-xs uppercase tracking-wider font-bold">Institute</label>
                    <input
                      {...register(`members.${index}.institute` as const, { required: "Institute is required" })}
                      className={`w-full bg-black/40 border text-white p-2.5 rounded-sm focus:outline-none focus:border-[#d4af37] transition ${errors.members?.[index]?.institute ? "border-red-500" : "border-gray-600"
                        }`}
                      placeholder="School of Navigation..."
                    />
                    {errors.members?.[index]?.institute && (
                      <span className="text-red-500 text-xs block mt-1">{errors.members[index]?.institute?.message}</span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-300 text-xs uppercase tracking-wider font-bold">UG/PG</label>
                    <select
                      {...register(`members.${index}.ugPg` as const, { required: "Please select UG/PG" })}
                      className={`w-full bg-[#0a0a0a] border text-[#d4af37] p-2.5 rounded-sm focus:outline-none focus:border-[#d4af37] transition appearance-none cursor-pointer ${errors.members?.[index]?.ugPg ? "border-red-500" : "border-gray-600"
                        }`}
                    >
                      <option value="">Select Level</option>
                      <option value="UG">Undergraduate (UG)</option>
                      <option value="PG">Postgraduate (PG)</option>
                    </select>
                    {errors.members?.[index]?.ugPg && (
                      <span className="text-red-500 text-xs block mt-1">{errors.members[index]?.ugPg?.message}</span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-300 text-xs uppercase tracking-wider font-bold">Gender</label>
                    <select
                      {...register(`members.${index}.gender` as const, { required: "Please select Gender" })}
                      className={`w-full bg-[#0a0a0a] border text-[#d4af37] p-2.5 rounded-sm focus:outline-none focus:border-[#d4af37] transition appearance-none cursor-pointer ${errors.members?.[index]?.gender ? "border-red-500" : "border-gray-600"
                        }`}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                    {errors.members?.[index]?.gender && (
                      <span className="text-red-500 text-xs block mt-1">{errors.members[index]?.gender?.message}</span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-300 text-xs uppercase tracking-wider font-bold">Student / Faculty</label>
                    <select
                      {...register(`members.${index}.studentFaculty` as const, { required: "Please select Role" })}
                      className={`w-full bg-[#0a0a0a] border text-[#d4af37] p-2.5 rounded-sm focus:outline-none focus:border-[#d4af37] transition appearance-none cursor-pointer ${errors.members?.[index]?.studentFaculty ? "border-red-500" : "border-gray-600"
                        }`}
                    >
                      <option value="">Select Role</option>
                      <option value="Student">Student</option>
                      <option value="Faculty">Faculty</option>
                    </select>
                    {errors.members?.[index]?.studentFaculty && (
                      <span className="text-red-500 text-xs block mt-1">{errors.members[index]?.studentFaculty?.message}</span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-300 text-xs uppercase tracking-wider font-bold">Mobile No.</label>
                    <input
                      {...register(`members.${index}.mobileNo` as const, {
                        required: "Mobile number is required",
                        pattern: {
                          value: /^\d{10}$/,
                          message: "Please enter a valid 10-digit mobile number"
                        }
                      })}
                      className={`w-full bg-black/40 border text-white p-2.5 rounded-sm focus:outline-none focus:border-[#d4af37] transition ${errors.members?.[index]?.mobileNo ? "border-red-500" : "border-gray-600"
                        }`}
                      placeholder="9876543210"
                    />
                    {errors.members?.[index]?.mobileNo && (
                      <span className="text-red-500 text-xs block mt-1">{errors.members[index]?.mobileNo?.message}</span>
                    )}
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-gray-300 text-xs uppercase tracking-wider font-bold">Roll No (Unique Flag)</label>
                    <input
                      {...register(`members.${index}.rollNo` as const, {
                        required: "Roll number is required",
                        validate: (value) => {
                          const allMembers = getValues("members");
                          const normalized = value.toLowerCase().trim();
                          const duplicates = allMembers.filter(
                            (m, i) => i !== index && m.rollNo.toLowerCase().trim() === normalized
                          );
                          return duplicates.length === 0 ? true : "Roll number must be unique across all crew members";
                        },
                      })}
                      className={`w-full bg-black/40 border text-white p-2.5 rounded-sm focus:outline-none focus:border-[#d4af37] transition ${errors.members?.[index]?.rollNo ? "border-red-500" : "border-gray-600"
                        }`}
                      placeholder="24BCE..."
                    />
                    {errors.members?.[index]?.rollNo && (
                      <span className="text-red-500 text-xs block mt-1">{errors.members[index]?.rollNo?.message}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-10 pt-6 border-t border-[#d4af37]/20">
            {!isStrictlySolo && fields.length < maxMembers ? (
              <button
                type="button"
                onClick={() => append({ name: "", rollNo: "", institute: "", ugPg: "", gender: "", studentFaculty: "", mobileNo: "" })}
                className="border border-[#d4af37] text-[#d4af37] px-6 py-2.5 hover:bg-[#d4af37] hover:text-black transition-all flex-1 sm:flex-none uppercase tracking-widest text-xs font-bold w-full sm:w-auto text-center"
              >
                + Add Member
              </button>
            ) : (
              <div className="flex-1 sm:flex-none hidden sm:block"></div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-[#d4af37] border border-[#d4af37] text-black px-10 py-3 uppercase tracking-widest font-bold text-sm hover:bg-transparent hover:text-[#d4af37] transition-all w-full sm:w-auto text-center shadow-[0_0_15px_rgba(212,175,55,0.2)] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? "Enlisting..." : "Confirm Registration"}
            </button>
          </div>

        </form>
      </div>

    </PiratePageLayout>
  );
}
