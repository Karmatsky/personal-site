import { useState } from "react";
import { motion } from "framer-motion";

type FormData = {
  name: string;
  email: string;
  message: string;
};

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const FORMSPREE_ENDPOINT = `https://formspree.io/f/${
    import.meta.env.VITE_FORMSPREE_ID
  }`;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
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
        alert("Message sent — thank you!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        const data = await res.json().catch(() => null);
        console.error("Formspree error response:", data || res.statusText);
        alert(
          "Не удалось отправить сообщение. Попробуйте ещё раз или напишите на почту напрямую."
        );
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Сетевая ошибка. Проверьте соединение и попробуйте снова.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="min-h-screen flex items-center py-16 md:py-24"
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#f2f4f7] rounded-lg border border-transparent focus:bg-white focus:border-black transition-colors outline-none"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#f2f4f7] rounded-lg border border-transparent focus:bg-white focus:border-black transition-colors outline-none"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-[#f2f4f7] rounded-lg border border-transparent focus:bg-white focus:border-black transition-colors outline-none resize-none"
                  placeholder="Tell me about your project..."
                />
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
