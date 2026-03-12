import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, useFieldArray } from "react-hook-form";
import PiratePageLayout from "@/components/layout/PiratePageLayout";
import { events } from "@/data/eventsData";
import { useToast } from "@/hooks/use-toast";

type MemberData = {
  name: string;
  rollNo: string;
  institute: string;
  branch: string;
  ugPg: string;
  gender: string;
  studentFaculty: string;
  mobileNo: string;
  preference?: string;
  habit?: string;
  rank?: string;
};

type FormData = {
  game?: string;
  ingredients?: string;
  teamName?: string;
  members: MemberData[];
};

export default function EventRegister() {
  const [match, params] = useRoute("/register/:slug");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  const event = events.find((e) => e.slug === params?.slug);

  const { register, control, handleSubmit, reset, getValues, watch, setValue, formState: { errors } } = useForm<FormData>({
    mode: "onTouched",
    defaultValues: {
      game: "",
      ingredients: "",
      teamName: "",
      members: [{
        name: "",
        rollNo: "",
        institute: "",
        branch: "",
        ugPg: "",
        gender: "",
        studentFaculty: "",
        mobileNo: "",
        preference: "",
        habit: "",
        rank: ""
      }],
    },
  });

  const selectedGame = watch("game");

  // --- NEW ROBUST TEAM SIZE LOGIC ---
  const teamSizeStr = event?.teamSize || "1";
  const numbers = teamSizeStr.match(/\d+/g)?.map(Number) || [1];
  let maxMembers = Math.max(...numbers);
  let minMembers = teamSizeStr.toLowerCase().includes("solo") ? 1 : Math.min(...numbers);
  let isFixedSize = minMembers === maxMembers && maxMembers > 1;

  // E-Sports Dynamic Logic
  if (event?.slug === "e-sports" && selectedGame) {
    if (selectedGame === "Fifa" || selectedGame === "Clash Royale") {
      minMembers = 1;
      maxMembers = 1;
      isFixedSize = true;
    } else if (selectedGame === "Bgmi") {
      minMembers = 4;
      maxMembers = 5;
      isFixedSize = true; // Still fixed-ish in UI but 5th optional
    } else if (selectedGame === "Valorant") {
      minMembers = 5;
      maxMembers = 6;
      isFixedSize = true;
    } else if (selectedGame === "Bgmi-Solo" || selectedGame === "Valorant-Solo") {
      minMembers = 1;
      maxMembers = 1;
      isFixedSize = true;
    }
  }

  // Dance Dynamic Logic
  if (event?.slug === "dance" && selectedGame) {
    if (selectedGame.startsWith("Solo")) {
      minMembers = 1;
      maxMembers = 1;
      isFixedSize = true;
    } else if (selectedGame === "Duet") {
      minMembers = 2;
      maxMembers = 2;
      isFixedSize = true;
    } else if (selectedGame === "Group") {
      minMembers = 5;
      maxMembers = 10;
      isFixedSize = false;
    }
  }

  // Music Dynamic Logic
  if (event?.slug === "music" && selectedGame) {
    if (selectedGame.startsWith("Solo")) {
      minMembers = 1;
      maxMembers = 1;
      isFixedSize = true;
    } else if (selectedGame === "Duet") {
      minMembers = 2;
      maxMembers = 2;
      isFixedSize = true;
    } else if (selectedGame === "Group") {
      minMembers = 4;
      maxMembers = 10;
      isFixedSize = false;
    }
  }

  // Fine Arts Dynamic Logic
  if (event?.slug === "fine-arts") {
    minMembers = 1;
    maxMembers = 1;
    isFixedSize = true;
  }

  // Literary Dynamic Logic (Pirate's Parliament)
  if (event?.slug === "literary" && selectedGame) {
    if (selectedGame === "Elocution" || selectedGame === "Debate") {
      minMembers = 1;
      maxMembers = 1;
      isFixedSize = true;
    }
  }

  // An event is strictly solo ONLY if max size is 1
  const isStrictlySolo = maxMembers === 1;
  // ----------------------------------

  const emptyMember: MemberData = {
    name: "",
    rollNo: "",
    institute: "",
    branch: "",
    ugPg: "",
    gender: "",
    studentFaculty: "",
    mobileNo: "",
    preference: "",
    habit: "",
    rank: ""
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  useEffect(() => {
    if ((event?.slug === "e-sports" || event?.slug === "dance" || event?.slug === "music" || event?.slug === "literary") && selectedGame) {
      const currentMembers = getValues("members");
      // For fixed size or minimum initial setup
      const targetCount = isFixedSize ? maxMembers : Math.max(currentMembers.length, minMembers);

      if (currentMembers.length !== targetCount) {
        const newMembers = Array(targetCount).fill(null).map((_, i) => currentMembers[i] || { ...emptyMember });
        setValue("members", newMembers);
      }
    } else if (isFixedSize && fields.length !== maxMembers) {
      setValue("members", Array(maxMembers).fill(null).map(() => ({ ...emptyMember })));
    } else if (fields.length < minMembers) {
      // Force minimum fields for all events
      const currentMembers = getValues("members");
      const newMembers = Array(minMembers).fill(null).map((_, i) => currentMembers[i] || { ...emptyMember });
      setValue("members", newMembers);
    }
  }, [selectedGame, maxMembers, minMembers, isFixedSize, event?.slug]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FormData) => {
    // Every member box present on the form must now be fully filled. 
    // If a box is added, validation will catch empty fields before reach here.
    const submittedMembers = data.members;

    if (submittedMembers.length < minMembers) {
      toast({
        title: "Incomplete Crew",
        description: `This event requires at least ${minMembers} members.`,
        variant: "destructive"
      });
      return;
    }

    // Dance Group same branch validation (ITNU only)
    if (event?.slug === "dance" && data.game === "Group") {
      const itnuMembers = submittedMembers.filter(m => m.institute === "ITNU" && m.branch);
      if (itnuMembers.length > 1) {
        const firstBranch = itnuMembers[0].branch.toLowerCase().trim();
        const mismatch = itnuMembers.some(m => m.branch.toLowerCase().trim() !== firstBranch);
        if (mismatch) {
          toast({
            title: "Branch Mismatch",
            description: "For group dance, all ITNU members must be from the same branch.",
            variant: "destructive"
          });
          return;
        }
      }
    }

    setIsSubmitting(true);
    try {
      const teamLeaderInstitute = data.members[0].institute;
      const API_URL = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event?.slug,
          game: data.game,
          ingredients: data.ingredients,
          teamName: isStrictlySolo ? undefined : (data.teamName || `Solo_${data.members[0].name}`),
          members: submittedMembers.map((member, idx) => ({
            ...member,
            institute: (event?.slug === 'gully-cricket' || idx === 0) ? member.institute : teamLeaderInstitute,
            branch: member.institute === 'ITNU' ? member.branch : 'N/A',
            rollNo: member.rollNo.toLowerCase()
          })),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: "An unknown error occurred." }));
        throw new Error(errData.error || "Registration failed. Please try again.");
      }

      const eventTitle = event?.title ?? "this event";

      // Hide form elements and show success overlay
      setShowSuccessOverlay(true);
      
      reset(); // Reset the form to default values
      
      setTimeout(() => {
        setLocation(`/events`);
      }, 4000);

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Mutiny!",
        description: error.message || "Registration failed. Try again or check your scrolls.",
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
        <div className="font-cinzel text-gray-300 mb-8 text-center text-sm md:text-base whitespace-pre-line">
          {event.slug === 'gully-cricket' && (
            <p className="mb-4">This event is exclusively for Nirma University students from all institutes. Team names and team members cannot be changed after registration. Any changes will lead to direct disqualification. All participants are informed to bring their id cards during registration process.</p>
          )}
          {event.slug === 'fashion-walk' && (
            <p className="mb-4">Strut the runway in spectacular fashion.</p>
          )}
          {event.slug === 'dance' && (
            <p className="mb-4">Unleash your rhythm and grace on the grand stage. Note: For group dance, all members must be from the same branch (Applicable for ITNU students only).</p>
          )}

          {event.contacts && event.contacts.length > 0 && (
            <div className="text-[#d4af37] font-bold mt-4">
              Contact: {event.contacts.map((c: any, i: number) => (
                <span key={i}>
                  {c.name}: {c.phone}
                  {i < event.contacts.length - 1 ? <br /> : ""}
                </span>
              ))}
            </div>
          )}

          {(event.slug !== 'gully-cricket' && event.slug !== 'fashion-walk' && event.slug !== 'dance' && !event.contacts) && (
            `Fill in the details below to secure your spot in ${event.title}.`
          )}
          {!isStrictlySolo && (
            <span className="block mt-2 text-yellow-500/80">
              {minMembers === maxMembers
                ? `Required: ${maxMembers} members.`
                : `Allowed: ${minMembers} to ${maxMembers} members.`}
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 font-cinzel">

          {/* Category/Game Selection */}
          {(event.slug === "e-sports" || event.slug === "dance" || event.slug === "music" || event.slug === "fine-arts" || event.slug === "instrumental-solo" || event.slug === "literary") && (
            <div className="space-y-2">
              <label className="text-[#d4af37] block font-bold tracking-wider text-sm">
                {event.slug === "dance" || event.slug === "music" || event.slug === "fine-arts" || event.slug === "instrumental-solo" || event.slug === "literary" ? "Select Category" : "Select Game"}
              </label>
              <select
                {...register("game", { required: "Please select a category" })}
                className={`w-full bg-[#0a0a0a] border text-[#d4af37] p-3 rounded-sm focus:outline-none focus:border-[#d4af37] transition appearance-none cursor-pointer ${errors.game ? "border-red-500" : "border-[#d4af37]/50"
                  }`}
              >
                <option value="">Select Category</option>
                {event.slug === "e-sports" ? (
                  <>
                    <option value="Fifa">Fifa</option>
                    <option value="Bgmi">Bgmi (Team)</option>
                    <option value="Bgmi-Solo">Bgmi (Solo)</option>
                    <option value="Valorant">Valorant (Team)</option>
                    <option value="Valorant-Solo">Valorant (Solo)</option>
                    <option value="Clash Royale">Clash Royale</option>
                  </>
                ) : event.slug === "music" ? (
                  <>
                    <option value="Solo-Indian">Solo-Indian</option>
                    <option value="Solo-Western">Solo-Western</option>
                    <option value="Duet">Duet</option>
                    <option value="Group">Group</option>
                  </>
                ) : event.slug === "fine-arts" ? (
                  <>
                    <option value="Tote-bag">Tote-bag (Solo - ITNU only)</option>
                    <option value="Mehendi">Mehendi (Solo)</option>
                    <option value="Rangoli">Rangoli (Solo)</option>
                  </>
                ) : event.slug === "instrumental-solo" ? (
                  <>
                    <option value="Solo Classical">Solo Classical</option>
                    <option value="Solo Non-Classical">Solo Non-Classical</option>
                  </>
                ) : event.slug === "literary" ? (
                  <>
                    <option value="Debate">Debate</option>
                    <option value="Elocution">Elocution</option>
                  </>
                ) : (
                  <>
                    <option value="Solo-Classical">Solo-Classical</option>
                    <option value="Solo-Western">Solo-Western</option>
                    <option value="Duet">Duet</option>
                    <option value="Group">Group (5-10 members)</option>
                  </>
                )}
              </select>
              {errors.game && <span className="text-red-500 text-xs mt-1 block tracking-widest">{errors.game.message}</span>}
            </div>
          )}

          {/* Ingredients for Captain's Kitchen */}
          {event.slug === "fireless-cooking" && (
            <div className="space-y-2">
              <label className="text-[#d4af37] block font-bold tracking-wider text-sm">
                What ingridiants are you thinking to use in your dish(ex : bread , butter , etc)  ?
              </label>
              <textarea
                {...register("ingredients", { required: "Please list your ingredients" })}
                className={`w-full bg-black/40 border text-white p-3 rounded-sm focus:outline-none focus:border-[#d4af37] transition-colors ${errors.ingredients ? "border-red-500" : "border-[#d4af37]/50"
                  }`}
                placeholder="Bread, butter, jam, etc."
                rows={3}
              />
              {errors.ingredients && <span className="text-red-500 text-xs mt-1 block tracking-widest">{errors.ingredients.message}</span>}
            </div>
          )}

          {/* Team Details Block */}
          {!isStrictlySolo && (event.slug !== "music" || selectedGame === "Group") && (
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
              />
              {errors.teamName && <span className="text-red-500 text-xs mt-1 block tracking-widest">{errors.teamName.message}</span>}
            </div>
          )}

          {/* Members Mapping */}
          <div className="space-y-6">
            {fields.map((item, index) => {
              // Generalized requirement for optional members
              const isOptional = index >= minMembers;

              return (
                <div key={item.id} className="p-6 border border-[#d4af37]/20 rounded-sm bg-black/30 relative shadow-inner">

                  <div className="flex justify-between items-center mb-6 border-b border-[#d4af37]/20 pb-2">
                    <h3 className="text-[#d4af37] font-pirata text-2xl tracking-wide">
                      {isStrictlySolo ? "Player Details" : index === 0 ? "Captain (Team Leader)" : `Crew Member ${index + 1}`}
                      {isOptional && <span className="text-yellow-500/60 text-sm ml-2">(Optional)</span>}
                    </h3>

                    {!isStrictlySolo && !isFixedSize && index >= minMembers && (
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
                      />
                      {errors.members?.[index]?.name && (
                        <span className="text-red-500 text-xs block mt-1">{errors.members[index]?.name?.message}</span>
                      )}
                    </div>

                    {(event.slug === 'gully-cricket' || index === 0) && (
                      <div className="space-y-1">
                        <label className="text-gray-300 text-xs uppercase tracking-wider font-bold">Institute</label>
                        <select
                          {...register(`members.${index}.institute` as const, {
                            required: "Please select Institute",
                            validate: (val) => {
                              if (event.slug === 'fine-arts' && selectedGame === 'Tote-bag' && val !== 'ITNU') {
                                return "Tote-bag event is only for ITNU Participants";
                              }
                              return true;
                            }
                          })}
                          className={`w-full bg-[#0a0a0a] border text-[#d4af37] p-2.5 rounded-sm focus:outline-none focus:border-[#d4af37] transition appearance-none cursor-pointer ${errors.members?.[index]?.institute ? "border-red-500" : "border-gray-600"
                            }`}
                        >
                          <option value="">Select Institute</option>
                          <option value="ITNU">ITNU</option>
                          <option value="ILNU">ILNU</option>
                          <option value="IPNU">IPNU</option>
                          <option value="ICNU">ICNU</option>
                          <option value="IMNU">IMNU</option>
                          <option value="ISNU">ISNU</option>
                          <option value="IDNU">IDNU</option>
                          <option value="IAPNU">IAPNU</option>
                        </select>
                        {errors.members?.[index]?.institute && (
                          <span className="text-red-500 text-xs block mt-1">{errors.members[index]?.institute?.message}</span>
                        )}
                      </div>
                    )}

                    {(event.slug === 'gully-cricket' || index === 0 ? watch(`members.${index}.institute`) === 'ITNU' : watch(`members.0.institute`) === 'ITNU') && (
                      <div className="space-y-1">
                        <label className="text-gray-300 text-xs uppercase tracking-wider font-bold">Branch</label>
                        <input
                          {...register(`members.${index}.branch` as const, { required: "Branch is required" })}
                          className={`w-full bg-black/40 border text-white p-2.5 rounded-sm focus:outline-none focus:border-[#d4af37] transition ${errors.members?.[index]?.branch ? "border-red-500" : "border-gray-600"
                            }`}
                          placeholder="CSE / ECE / Mechanical..."
                        />
                        {errors.members?.[index]?.branch && (
                          <span className="text-red-500 text-xs block mt-1">{errors.members[index]?.branch?.message}</span>
                        )}
                      </div>
                    )}


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
                            const normalized = (value || "").toLowerCase().trim();
                            const duplicates = allMembers.filter(
                              (m, i) => i !== index && (m.rollNo || "").toLowerCase().trim() === normalized && m.rollNo
                            );
                            return duplicates.length === 0 ? true : "Roll number must be unique across all crew members";
                          },
                        })}
                        className={`w-full bg-black/40 border text-white p-2.5 rounded-sm focus:outline-none focus:border-[#d4af37] transition ${errors.members?.[index]?.rollNo ? "border-red-500" : "border-gray-600"
                          }`}
                      />
                      {errors.members?.[index]?.rollNo && (
                        <span className="text-red-500 text-xs block mt-1">{errors.members[index]?.rollNo?.message}</span>
                      )}
                    </div>

                    {event.slug === 'fashion-walk' && (
                      <div className="space-y-4 md:col-span-2">
                        <div className="space-y-1">
                          <label className="text-gray-300 text-xs uppercase tracking-wider font-bold">Your Preference</label>
                          <select
                            {...register(`members.${index}.preference` as const, { required: "Please select preference" })}
                            className={`w-full bg-[#0a0a0a] border text-[#d4af37] p-2.5 rounded-sm focus:outline-none focus:border-[#d4af37] transition appearance-none cursor-pointer ${errors.members?.[index]?.preference ? "border-red-500" : "border-gray-600"
                              }`}
                          >
                            <option value="">Select Preference</option>
                            <option value="traditional">Traditional</option>
                            <option value="western">Western</option>
                          </select>
                          {errors.members?.[index]?.preference && (
                            <span className="text-red-500 text-xs block mt-1">{errors.members[index]?.preference?.message}</span>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label className="text-gray-300 text-xs uppercase tracking-wider font-bold">One habit of yours proud of :</label>
                          <textarea
                            {...register(`members.${index}.habit` as const, { required: "This field is required" })}
                            className={`w-full bg-black/40 border text-white p-2.5 rounded-sm focus:outline-none focus:border-[#d4af37] transition ${errors.members?.[index]?.habit ? "border-red-500" : "border-gray-600"
                              }`}
                            placeholder="Tell us about a habit you are proud of..."
                            rows={2}
                          />
                          {errors.members?.[index]?.habit && (
                            <span className="text-red-500 text-xs block mt-1">{errors.members[index]?.habit?.message}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedGame === 'Valorant-Solo' && (
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-gray-300 text-xs uppercase tracking-wider font-bold">Your Rank (Valorant)</label>
                        <input
                          {...register(`members.${index}.rank` as const, { required: "Rank is required for Valorant Solo" })}
                          className={`w-full bg-black/40 border text-white p-2.5 rounded-sm focus:outline-none focus:border-[#d4af37] transition ${errors.members?.[index]?.rank ? "border-red-500" : "border-gray-600"
                            }`}
                          placeholder="e.g. Iron, Bronze, Silver, Gold, Platinum, Diamond, Ascendant, Immortal, Radiant"
                        />
                        {errors.members?.[index]?.rank && (
                          <span className="text-red-500 text-xs block mt-1">{errors.members[index]?.rank?.message}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-10 pt-6 border-t border-[#d4af37]/20">
            {!isStrictlySolo && !isFixedSize && fields.length < maxMembers ? (
              <button
                type="button"
                onClick={() => append({ ...emptyMember })}
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

      <AnimatePresence>
        {showSuccessOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.1 
              }}
              className="max-w-md w-full bg-[#0a0a0a] border-2 border-[#d4af37] p-8 rounded-lg text-center shadow-[0_0_50px_rgba(212,175,55,0.3)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-[#d4af37]/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#d4af37]/40"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>

              <h3 className="font-pirata text-4xl text-[#d4af37] mb-4 tracking-widest whitespace-nowrap">AHoy! registered successfully!</h3>
              <p className="font-cinzel text-gray-300 text-lg mb-8 leading-relaxed">
                Your crew is now listed on the legendary scrolls of Vaudeville 2026.
              </p>
              
              <div className="flex items-center justify-center gap-2 text-[#d4af37]/60 text-sm font-cinzel">
                <span className="w-2 h-2 bg-[#d4af37] rounded-full animate-pulse" />
                Redirecting to the harbor...
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </PiratePageLayout>
  );
}
