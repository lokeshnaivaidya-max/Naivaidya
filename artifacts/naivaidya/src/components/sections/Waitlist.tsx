import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().min(10, "Valid mobile number is required"),
  city: z.string().min(2, "City is required"),
  message: z.string().optional(),
  agree: z.boolean().refine((v) => v === true, "You must agree to receive updates"),
});

export default function Waitlist() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { fullName: "", email: "", mobile: "", city: "", message: "", agree: false },
  });

  function onSubmit() {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast({ title: "Welcome to the future.", description: "You've successfully joined the NAIVAIDYA waitlist." });
      form.reset();
    }, 1200);
  }

  return (
    <section id="waitlist" className="py-32 relative bg-white overflow-hidden">
      {/* Purple glow blobs */}
      <div className="absolute left-0 bottom-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)" }} />
      <div className="absolute right-0 top-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)" }} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-sm font-bold text-[#7C3AED] uppercase tracking-widest mb-4"
            >
              Join the Waitlist
            </motion.p>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-gray-900"
            >
              Be the first to{" "}
              <span className="text-gradient">experience it.</span>
            </motion.h3>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid md:grid-cols-2 gap-12 bg-white rounded-[3rem] p-8 md:p-14 border border-purple-100 shadow-[0_16px_80px_rgba(124,58,237,0.12)] relative overflow-hidden"
          >
            {/* Decorative corner glow */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />

            {/* Left: steps */}
            <div className="relative z-10">
              <p className="text-gray-500 mb-10 text-lg leading-relaxed">
                Join our exclusive waitlist for early access to the NAIVAIDYA ecosystem. Rolling out to select cities and partners soon.
              </p>
              <div className="space-y-8">
                {[
                  { n: "1", title: "Sign Up", desc: "Provide your details to secure your place." },
                  { n: "2", title: "Get Verified", desc: "Prioritised by region and medical need." },
                  { n: "3", title: "Early Access", desc: "Experience healthcare transformed." },
                ].map((step) => (
                  <div key={step.n} className="flex items-start gap-5">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shrink-0 text-sm"
                      style={{ background: "linear-gradient(135deg, #7C3AED, #9F67F7)" }}
                    >
                      {step.n}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{step.title}</h4>
                      <p className="text-sm text-gray-500">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: form */}
            <div className="relative z-10">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center gap-4 py-10"
                >
                  <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
                    style={{ background: "linear-gradient(135deg, #7C3AED, #9F67F7)" }}>
                    ✓
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900">You're on the list!</h4>
                  <p className="text-gray-500">We'll reach out when NAIVAIDYA launches near you.</p>
                </motion.div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField control={form.control} name="fullName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-semibold">Full Name</FormLabel>
                        <FormControl>
                          <Input
                            data-testid="input-fullname"
                            placeholder="Your full name"
                            className="border-purple-200 focus:border-[#7C3AED] focus:ring-[#7C3AED]/20 rounded-xl bg-purple-50/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-semibold">Email</FormLabel>
                          <FormControl>
                            <Input data-testid="input-email" placeholder="you@email.com" type="email"
                              className="border-purple-200 focus:border-[#7C3AED] rounded-xl bg-purple-50/50" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="mobile" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-semibold">Mobile</FormLabel>
                          <FormControl>
                            <Input data-testid="input-mobile" placeholder="+91 XXXXX"
                              className="border-purple-200 focus:border-[#7C3AED] rounded-xl bg-purple-50/50" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="city" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-semibold">City</FormLabel>
                        <FormControl>
                          <Input data-testid="input-city" placeholder="Mumbai, Delhi, Bangalore…"
                            className="border-purple-200 focus:border-[#7C3AED] rounded-xl bg-purple-50/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="message" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-semibold">Message <span className="text-gray-400 font-normal">(optional)</span></FormLabel>
                        <FormControl>
                          <Textarea data-testid="input-message" placeholder="Tell us about your needs…"
                            className="border-purple-200 focus:border-[#7C3AED] rounded-xl bg-purple-50/50 resize-none" rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="agree" render={({ field }) => (
                      <FormItem className="flex flex-row items-start gap-3 p-4 border border-purple-100 rounded-xl bg-purple-50/50">
                        <FormControl>
                          <Checkbox
                            data-testid="checkbox-agree"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-purple-300 data-[state=checked]:bg-[#7C3AED] data-[state=checked]:border-[#7C3AED]"
                          />
                        </FormControl>
                        <FormLabel className="text-sm text-gray-600 font-normal leading-relaxed cursor-pointer">
                          I agree to receive updates from NAIVAIDYA.
                        </FormLabel>
                      </FormItem>
                    )} />

                    <motion.button
                      type="submit"
                      data-testid="button-submit-waitlist"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02, boxShadow: "0 12px 40px rgba(124,58,237,0.4)" }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full h-12 rounded-xl font-bold text-white relative overflow-hidden btn-shimmer disabled:opacity-70 disabled:cursor-not-allowed"
                      style={{ background: "linear-gradient(135deg, #7C3AED, #9F67F7)" }}
                    >
                      {isSubmitting ? "Processing…" : "Join Waitlist"}
                    </motion.button>
                  </form>
                </Form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
