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

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 64 64"
                    aria-labelledby="title"
                    aria-describedby="desc"
                    role="img"
                  >
                    <title>Github</title>
                    <desc>A solid styled icon from Orion Icon Library.</desc>
                    <path
                      data-name="layer2"
                      d="M32 0a32.021 32.021 0 0 0-10.1 62.4c1.6.3 2.2-.7 2.2-1.5v-6c-8.9 1.9-10.8-3.8-10.8-3.8-1.5-3.7-3.6-4.7-3.6-4.7-2.9-2 .2-1.9.2-1.9 3.2.2 4.9 3.3 4.9 3.3 2.9 4.9 7.5 3.5 9.3 2.7a6.93 6.93 0 0 1 2-4.3c-7.1-.8-14.6-3.6-14.6-15.8a12.27 12.27 0 0 1 3.3-8.6 11.965 11.965 0 0 1 .3-8.5s2.7-.9 8.8 3.3a30.873 30.873 0 0 1 8-1.1 30.292 30.292 0 0 1 8 1.1c6.1-4.1 8.8-3.3 8.8-3.3a11.965 11.965 0 0 1 .3 8.5 12.1 12.1 0 0 1 3.3 8.6c0 12.3-7.5 15-14.6 15.8a7.746 7.746 0 0 1 2.2 5.9v8.8c0 .9.6 1.8 2.2 1.5A32.021 32.021 0 0 0 32 0z"
                      fill="#202020"
                    ></path>
                    <path
                      data-name="layer1"
                      d="M12.1 45.9c-.1.2-.3.2-.5.1s-.4-.3-.3-.5.3-.2.6-.1c.2.2.3.4.2.5zm1.3 1.5a.589.589 0 0 1-.8-.8.631.631 0 0 1 .7.1.494.494 0 0 1 .1.7zm1.3 1.8a.585.585 0 0 1-.7-.3.6.6 0 0 1 0-.8.585.585 0 0 1 .7.3c.2.3.2.7 0 .8zm1.7 1.8c-.2.2-.5.1-.8-.1-.3-.3-.4-.6-.2-.8a.619.619 0 0 1 .8.1.554.554 0 0 1 .2.8zm2.4 1c-.1.3-.4.4-.8.3s-.6-.4-.5-.7.4-.4.8-.3c.3.2.6.5.5.7zm2.6.2c0 .3-.3.5-.7.5s-.7-.2-.7-.5.3-.5.7-.5c.4.1.7.3.7.5zm2.4-.4q0 .45-.6.6a.691.691 0 0 1-.8-.3q0-.45.6-.6c.5-.1.8.1.8.3z"
                      fill="#202020"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">GitHub</p>
                  <a
                    href="https://github.com/Karmatsky"
                    className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                    target="blanck"
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
                    href="mailto:savely@example.com"
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
                    <g />
                    <path d="M15 2H9C6.8 2 5 3.8 5 6v12c0 2.2 1.8 4 4 4h6c2.2 0 4-1.8 4-4V6c0-2.2-1.8-4-4-4m2 16c0 1.1-.9 2-2 2H9c-1.1 0-2-.9-2-2V6c0-.9.6-1.7 1.4-1.9l.4.8c.4.7 1.1 1.1 1.8 1.1h2.8c.8 0 1.4-.4 1.8-1.1l.4-.8c.8.2 1.4 1 1.4 1.9z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Phone</p>
                  <a
                    href="tel:+1234567890"
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
