import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

type FormData = {
  name: string;
  email: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const messageRef = useRef<HTMLTextAreaElement | null>(null);

  const FORMSPREE_ENDPOINT = `https://formspree.io/f/${
    import.meta.env.VITE_FORMSPREE_ID
  }`;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (
    name: keyof FormData,
    value: string
  ): string | null => {
    switch (name) {
      case "name": {
        const trimmed = value.trim();
        if (!trimmed) return "Enter name";
        if (trimmed.length < 2)
          return "Name must contain at least 2 characters";
        if (trimmed.length > 60) return "The name is too long";
        return null;
      }

      case "email": {
        const trimmed = value.trim();
        if (!trimmed) return "Enter email";
        if (!emailRegex.test(trimmed)) return "Invalid email format";
        return null;
      }

      case "message": {
        const trimmed = value.trim();
        if (!trimmed) return "Enter message";
        if (trimmed.length < 10)
          return "The message must be at least 10 characters long";
        if (trimmed.length > 2000) return "The message is too long";
        return null;
      }

      default:
        return null;
    }
  };

  const validateAll = (data: FormData) => {
    const newErrors: FormErrors = {};
    (Object.keys(data) as (keyof FormData)[]).forEach((key) => {
      const err = validateField(key, data[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name as keyof FormData, value) || undefined,
    }));
  };

  const focusFirstError = (errs: FormErrors) => {
    if (!errs) return;
    if (errs.name) nameRef.current?.focus();
    else if (errs.email) emailRef.current?.focus();
    else if (errs.message) messageRef.current?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const found = validateAll(formData);
    const hasErrors = Object.keys(found).length > 0;
    if (hasErrors) {
      toast.error("Please check the form — there are some errors", {
        description: Object.values(found)[0],
      });
      focusFirstError(found);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Message sent — thank you!", {
          description: "I will contact you shortly.",
        });
        setFormData({ name: "", email: "", message: "" });
        setErrors({});
      } else {
        const data = await res.json().catch(() => null);
        console.error("Formspree error response:", data || res.statusText);
        toast.error("Failed to send message", {
          description: "Please try again or send an email directly",
        });
      }
    } catch (err) {
      console.error("Network error:", err);
      toast.error("Network error", {
        description: "Check the connection and try again",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const inputBaseClass =
    "w-full px-4 py-3 rounded-lg border transition-colors outline-none";

  return (
    <section
      id="contact"
      className="min-h-screen flex items-center py-16 md:py-24 scroll-mt-10"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-3">
              Contact
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-6">
              Let's work together
            </h2>
            <p className="text-slate-700 leading-relaxed mb-8">
              I'm always interested in new opportunities and exciting projects.
              Whether you have a question or just want to say hi, I'll try my
              best to get back to you!
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 64 64"
                    role="img"
                  >
                    <path
                      d="M32 0a32.021 32.021 0 0 0-10.1 62.4c1.6.3 2.2-.7 2.2-1.5v-6c-8.9 1.9-10.8-3.8-10.8-3.8-1.5-3.7-3.6-4.7-3.6-4.7-2.9-2 .2-1.9.2-1.9 3.2.2 4.9 3.3 4.9 3.3 2.9 4.9 7.5 3.5 9.3 2.7a6.93 6.93 0 0 1 2-4.3c-7.1-.8-14.6-3.6-14.6-15.8a12.27 12.27 0 0 1 3.3-8.6 11.965 11.965 0 0 1 .3-8.5s2.7-.9 8.8 3.3a30.873 30.873 0 0 1 8-1.1 30.292 30.292 0 0 1 8 1.1c6.1-4.1 8.8-3.3 8.8-3.3a11.965 11.965 0 0 1 .3 8.5 12.1 12.1 0 0 1 3.3 8.6c0 12.3-7.5 15-14.6 15.8a7.746 7.746 0 0 1 2.2 5.9v8.8c0 .9.6 1.8 2.2 1.5A32.021 32.021 0 0 0 32 0z"
                      fill="#202020"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">GitHub</p>
                  <a
                    href="https://github.com/Karmatsky"
                    className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                    target="_blank"
                  >
                    Karmatsky
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.5 6.25L10 10.625L17.5 6.25"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <rect
                      x="2.5"
                      y="4.375"
                      width="15"
                      height="10"
                      rx="1.25"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Email</p>
                  <a
                    href="mailto:s.karmatsky@gmail.com"
                    className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    s.karmatsky@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M15 2H9C6.8 2 5 3.8 5 6v12c0 2.2 1.8 4 4 4h6c2.2 0 4-1.8 4-4V6c0-2.2-1.8-4-4-4m2 16c0 1.1-.9 2-2 2H9c-1.1 0-2-.9-2-2V6c0-.9.6-1.7 1.4-1.9l.4.8c.4.7 1.1 1.1 1.8 1.1h2.8c.8 0 1.4-.4 1.8-1.1l.4-.8c.8.2 1.4 1 1.4 1.9z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Phone</p>
                  <a
                    href="tel:+79122121176"
                    className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    +7 (912) 212-11-76
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Name
                </label>
                <input
                  ref={nameRef}
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={(e) =>
                    setErrors((prev) => ({
                      ...prev,
                      name: validateField("name", e.target.value) || undefined,
                    }))
                  }
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className={`${inputBaseClass} bg-[#f2f4f7] focus:bg-white focus:border-black border-transparent ${
                    errors.name
                      ? "bg-[#fee0e0] border-red-500 focus:border-red-600"
                      : ""
                  }`}
                  placeholder="Your name"
                />
                {errors.name && (
                  <p id="name-error" className="text-xs text-red-600 mt-2">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Email
                </label>
                <input
                  ref={emailRef}
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={(e) =>
                    setErrors((prev) => ({
                      ...prev,
                      email:
                        validateField("email", e.target.value) || undefined,
                    }))
                  }
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={`${inputBaseClass} bg-[#f2f4f7] focus:bg-white focus:border-black border-transparent ${
                    errors.email
                      ? "bg-[#fee0e0] border-red-500 focus:border-red-600"
                      : ""
                  }`}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p id="email-error" className="text-xs text-red-600 mt-2">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Message
                </label>
                <textarea
                  ref={messageRef}
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={(e) =>
                    setErrors((prev) => ({
                      ...prev,
                      message:
                        validateField("message", e.target.value) || undefined,
                    }))
                  }
                  aria-invalid={!!errors.message}
                  aria-describedby={
                    errors.message ? "message-error" : undefined
                  }
                  rows={6}
                  className={`${inputBaseClass} bg-[#f2f4f7] focus:bg-white focus:border-black border-transparent resize-none ${
                    errors.message
                      ? "bg-[#fee0e0] border-red-500 focus:border-red-600"
                      : ""
                  }`}
                  placeholder="Tell me about your project..."
                />
                <div className="flex justify-between items-center mt-2">
                  {errors.message ? (
                    <p id="message-error" className="text-xs text-red-600">
                      {errors.message}
                    </p>
                  ) : (
                    <div />
                  )}
                  <p className="text-xs text-slate-500">
                    {formData.message.length}/2000
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`cursor-pointer w-full bg-[#ffdd2d] text-black py-3 px-6 rounded-lg font-normal hover:bg-[#f2d22b] transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 ${
                  submitting ? "opacity-60 pointer-events-none" : ""
                }`}
              >
                {submitting ? "Sending..." : "Submit"}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
