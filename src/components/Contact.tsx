import { motion } from "framer-motion";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";

type FormData = {
  name: string;
  email: string;
  message: string;
};

export default function Contact() {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<FormData>({
    defaultValues: { name: "", email: "", message: "" },
    mode: "onBlur",
  });

  const FORMSPREE_ENDPOINT = `https://formspree.io/f/${
    import.meta.env.VITE_FORMSPREE_ID
  }`;

  const messageLength = watch("message", "").length;

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success(t("success.title"), {
          description: t("success.description"),
        });
        reset();
      } else {
        toast.error(t("errors.submit-failed.title"), {
          description: t("errors.submit-failed.description"),
        });
      }
    } catch (err) {
      console.error("Network error:", err);
      toast.error(t("errors.network.title"), {
        description: t("errors.network.description"),
      });
    }
  };

  const inputBaseClass =
    "w-full px-4 py-3 rounded-lg border transition-colors outline-none bg-[#f2f4f7] focus:bg-white focus:border-black border-transparent";

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
              {t("contact.section-label")}
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-6">
              {t("contact.title")}
            </h2>
            <p className="text-slate-700 leading-relaxed mb-8">
              {t("contact.description")}
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
                    rel="noopener noreferrer"
                  >
                    Karmatsky
                  </a>
                </div>
              </div>

              {/* <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Telegram</p>
                  <a
                    href="https://t.me/SKarmatsky"
                    target="_blanck"
                    className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    SKarmatsky
                  </a>
                </div>
              </div> */}

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

              {/* <div className="flex items-center gap-3">
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
                  <p className="text-sm font-medium text-slate-900">
                    {t("contact.labels.phone")}
                  </p>
                  <a
                    href="tel:+79122121176"
                    className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    +7 (912) 212-11-76
                  </a>
                </div>
              </div> */}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-3"
              noValidate
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  {t("contact.labels.name")}
                </label>
                <input
                  id="name"
                  type="text"
                  {...register("name", {
                    required: t("validation.name.required"),
                    minLength: {
                      value: 2,
                      message: t("validation.name.short"),
                    },
                    maxLength: {
                      value: 60,
                      message: t("validation.name.long"),
                    },
                  })}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className={`${inputBaseClass} ${
                    errors.name
                      ? "bg-[#fee0e0] border-red-500 focus:border-red-600"
                      : ""
                  }`}
                  placeholder={t("contact.placeholders.name")}
                />
                <p id="name-error" className="text-xs text-red-600 mt-2 h-5">
                  {errors.name?.message || ""}
                </p>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  {t("contact.labels.email")}
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: t("validation.email.required"),
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: t("validation.email.invalid"),
                    },
                  })}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={`${inputBaseClass} ${
                    errors.email
                      ? "bg-[#fee0e0] border-red-500 focus:border-red-600"
                      : ""
                  }`}
                  placeholder={t("contact.placeholders.email")}
                />
                <p id="email-error" className="text-xs text-red-600 mt-2 h-5">
                  {errors.email?.message || ""}
                </p>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  {t("contact.labels.message")}
                </label>
                <textarea
                  id="message"
                  rows={6}
                  {...register("message", {
                    required: t("validation.message.required"),
                    minLength: {
                      value: 10,
                      message: t("validation.message.short"),
                    },
                    maxLength: {
                      value: 2000,
                      message: t("validation.message.long"),
                    },
                  })}
                  aria-invalid={!!errors.message}
                  aria-describedby={
                    errors.message ? "message-error" : undefined
                  }
                  className={`${inputBaseClass} resize-none ${
                    errors.message
                      ? "bg-[#fee0e0] border-red-500 focus:border-red-600"
                      : ""
                  }`}
                  placeholder={t("contact.placeholders.message")}
                />
                <div className="flex justify-between items-center mt-2">
                  <p id="message-error" className="text-xs text-red-600 h-5">
                    {errors.message?.message || ""}
                  </p>
                  <p className="text-xs text-slate-500">{messageLength}/2000</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`cursor-pointer w-full bg-[#ffdd2d] text-black py-3 px-6 rounded-lg font-normal hover:bg-[#f2d22b] transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 ${
                  isSubmitting ? "opacity-60 pointer-events-none" : ""
                }`}
              >
                {isSubmitting
                  ? t("contact.buttons.sending")
                  : t("contact.buttons.submit")}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
