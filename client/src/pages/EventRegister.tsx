import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useForm, useFieldArray } from "react-hook-form";
import PiratePageLayout from "@/components/layout/PiratePageLayout";
import { events } from "@/data/eventsData";
import { useToast } from "@/hooks/use-toast";

type MemberData = {
  name: string;
  rollNo: string;
  year: string;
  branch: string;
  institute: string;
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
  const isSolo = event?.teamSize.toLowerCase() === "solo";

  const { register, control, handleSubmit, reset, getValues, formState: { errors } } = useForm<FormData>({
    mode: "onTouched",
    defaultValues: {
      teamName: "",
      members: [{ name: "", rollNo: "", year: "", branch: "", institute: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set initial max team size based on data
  let maxMembers = 1;
  if (!isSolo && event?.teamSize) {
    const parts = event.teamSize.match(/\d+/g);
    if (parts && parts.length > 0) {
      maxMembers = parseInt(parts[parts.length - 1], 10);
    }
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event?.slug,
          teamName: isSolo ? undefined : data.teamName,
          members: data.members.map(member => ({
            ...member,
            rollNo: member.rollNo.toLowerCase() // Always convert to lowercase
          })),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: "An unknown error occurred." }));
        throw new Error(errData.error || "Registration failed. Please try again.");
      }

      // Capture before reset() clears any reactive state
      const eventTitle = event?.title ?? "this event";
      const eventSlug  = event?.slug;

      toast({
        title: "⚓ Registration Successful!",
        description: `You have successfully registered for ${eventTitle}!`,
        variant: "success",
        duration: 3000,
      });
      reset();

      // Wait long enough for the user to read the toast
      setTimeout(() => {
        setLocation(`/events/${eventSlug}`);
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
    return <div className="text-white p-20">Event not found</div>;
  }

  return (
    <PiratePageLayout title={`Register: ${event.title}`}>
      <div className="max-w-3xl mx-auto bg-black/60 border border-[#d4af37]/40 p-8 rounded-lg mt-8 mb-16 shadow-2xl">
        <h2 className="font-pirata text-4xl text-[#d4af37] mb-6 text-center">Join the Crew</h2>
        <p className="font-cinzel text-gray-300 mb-8 text-center text-sm md:text-base">
          Fill in the details below to secure your spot in {event.title}.
          {!isSolo && <span className="block mt-2 text-yellow-500/80">Maximum {maxMembers} members allowed.</span>}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 font-cinzel">
          
          {/* Team Name - Only for Team Events */}
          {!isSolo && (
            <div className="space-y-2">
              <label className="text-[#d4af37] block">Team Name</label>
              <input
                {...register("teamName", { required: "Team name is required for team events" })}
                className={`w-full bg-black/40 border text-white p-3 rounded focus:outline-none focus:border-[#d4af37] transition-colors ${
                  errors.teamName ? "border-red-500" : "border-[#d4af37]/60"
                }`}
                placeholder="Enter your team name"
              />
              {errors.teamName && <span className="text-red-500 text-sm mt-1 block">⚠ {errors.teamName.message}</span>}
            </div>
          )}

          {/* Members Mapping */}
          <div className="space-y-6">
            {fields.map((item, index) => (
              <div key={item.id} className="p-6 border border-gray-700/50 rounded-lg bg-black/20 relative">
                <div className="flex justify-between items-center mb-4 border-b border-gray-700/50 pb-2">
                  <h3 className="text-[#d4af37] font-pirata text-2xl tracking-wide">
                    {isSolo ? "Participant Info" : `Crew Member ${index + 1}`}
                  </h3>
                  {!isSolo && index > 0 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-400 text-sm font-bold uppercase transition"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-gray-300 text-sm">Full Name</label>
                    <input
                      {...register(`members.${index}.name` as const, { required: "Name is required" })}
                      className={`w-full bg-black/40 border text-white p-2.5 rounded focus:outline-none focus:border-[#d4af37] transition ${
                        errors.members?.[index]?.name ? "border-red-500" : "border-gray-600"
                      }`}
                      placeholder="Jack Sparrow"
                    />
                    {errors.members?.[index]?.name && (
                      <span className="text-red-500 text-xs block mt-1">⚠ {errors.members[index]?.name?.message}</span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-300 text-sm">Roll No</label>
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
                      className={`w-full bg-black/40 border text-white p-2.5 rounded focus:outline-none focus:border-[#d4af37] transition ${
                        errors.members?.[index]?.rollNo ? "border-red-500" : "border-gray-600"
                      }`}
                      placeholder="24BCE206"
                    />
                    {errors.members?.[index]?.rollNo && (
                      <span className="text-red-500 text-xs block mt-1">⚠ {errors.members[index]?.rollNo?.message}</span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-300 text-sm">Year</label>
                    <select
                      {...register(`members.${index}.year` as const, { required: "Please select a year" })}
                      className={`w-full bg-[#0a0a0a] border text-white p-2.5 rounded focus:outline-none focus:border-[#d4af37] transition appearance-none cursor-pointer ${
                        errors.members?.[index]?.year ? "border-red-500" : "border-gray-600"
                      }`}
                    >
                      <option value="">Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                    {errors.members?.[index]?.year && (
                      <span className="text-red-500 text-xs block mt-1">⚠ {errors.members[index]?.year?.message}</span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-300 text-sm">Branch</label>
                    <input
                      {...register(`members.${index}.branch` as const, { required: "Branch is required" })}
                      className={`w-full bg-black/40 border text-white p-2.5 rounded focus:outline-none focus:border-[#d4af37] transition ${
                        errors.members?.[index]?.branch ? "border-red-500" : "border-gray-600"
                      }`}
                      placeholder="e.g. CSE, ECE"
                    />
                    {errors.members?.[index]?.branch && (
                      <span className="text-red-500 text-xs block mt-1">⚠ {errors.members[index]?.branch?.message}</span>
                    )}
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-gray-300 text-sm">Institute</label>
                    <input
                      {...register(`members.${index}.institute` as const, { required: "Institute is required" })}
                      className={`w-full bg-black/40 border text-white p-2.5 rounded focus:outline-none focus:border-[#d4af37] transition ${
                        errors.members?.[index]?.institute ? "border-red-500" : "border-gray-600"
                      }`}
                      placeholder="e.g. Technology, Commerce, Law"
                    />
                    {errors.members?.[index]?.institute && (
                      <span className="text-red-500 text-xs block mt-1">⚠ {errors.members[index]?.institute?.message}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-8 pt-4 border-t border-[#d4af37]/20">
            {!isSolo && fields.length < maxMembers ? (
              <button
                type="button"
                onClick={() => append({ name: "", rollNo: "", year: "", branch: "", institute: "" })}
                className="border border-[#d4af37] text-[#d4af37] px-6 py-2.5 hover:bg-[#d4af37] hover:text-black transition-all flex-1 sm:flex-none uppercase tracking-wider text-sm font-bold"
              >
                + Add Crew Member
              </button>
            ) : (
                <div className="flex-1 sm:flex-none"></div> 
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-[#d4af37] text-black px-10 py-3 uppercase tracking-wider font-bold text-lg hover:bg-yellow-500 transition-all flex-1 sm:flex-none ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? "Enlisting..." : "Register Now"}
            </button>
          </div>

        </form>
      </div>
    </PiratePageLayout>
  );
}
