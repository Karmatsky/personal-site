import { Github, LoaderCircle, Mail, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormData = {
  name: string;
  email: string;
  message: string;
  company: string;
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
    defaultValues: { name: "", email: "", message: "", company: "" },
    mode: "onBlur",
  });

  const messageLength = watch("message", "").length;

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(t("success.title"), {
          description: t("success.description"),
        });
        reset();
        return;
      }

      if (response.status === 429) {
        toast.error(t("errors.rate-limited.title"), {
          description: t("errors.rate-limited.description"),
        });
        return;
      }

      toast.error(t("errors.submit-failed.title"), {
        description: t("errors.submit-failed.description"),
      });
    } catch {
      toast.error(t("errors.network.title"), {
        description: t("errors.network.description"),
      });
    }
  };

  return (
    <section id="contact" className="section">
      <div className="site-container">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div data-reveal>
            <p className="section-eyebrow">{t("contact.section-label")}</p>
            <h2 className="section-title section-title--compact mb-5">
              {t("contact.title")}
            </h2>
            <p className="body-copy max-w-xl">{t("contact.description")}</p>

            <div className="mt-8 grid gap-3">
              <a
                href="https://github.com/Karmatsky"
                className="contact-card contact-card--link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="contact-icon">
                  <Github aria-hidden className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-950">GitHub</p>
                  <span className="text-sm text-slate-600 transition-colors">
                    Karmatsky
                  </span>
                </div>
              </a>

              <a
                href="mailto:s.karmatsky@gmail.com"
                className="contact-card contact-card--link"
              >
                <span className="contact-icon">
                  <Mail aria-hidden className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-950">Email</p>
                  <span className="break-all text-sm text-slate-600 transition-colors">
                    s.karmatsky@gmail.com
                  </span>
                </div>
              </a>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="form-panel space-y-4"
            noValidate
            data-reveal
          >
            <div className="honeypot-field" aria-hidden="true">
              <label htmlFor="company">Company</label>
              <input
                id="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...register("company")}
              />
            </div>

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-slate-700"
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
                className={`form-control ${errors.name ? "form-control--error" : ""}`}
                placeholder={t("contact.placeholders.name")}
                autoComplete="name"
              />
              <p id="name-error" className="mt-2 min-h-5 text-xs text-red-600">
                {errors.name?.message || ""}
              </p>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
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
                className={`form-control ${errors.email ? "form-control--error" : ""}`}
                placeholder={t("contact.placeholders.email")}
                autoComplete="email"
              />
              <p id="email-error" className="mt-2 min-h-5 text-xs text-red-600">
                {errors.email?.message || ""}
              </p>
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-semibold text-slate-700"
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
                  errors.message ? "message-error" : "message-counter"
                }
                className={`form-control resize-none ${
                  errors.message ? "form-control--error" : ""
                }`}
                placeholder={t("contact.placeholders.message")}
              />
              <div className="mt-2 flex items-center justify-between gap-3">
                <p
                  id="message-error"
                  className="min-h-5 text-xs text-red-600"
                  aria-live="polite"
                >
                  {errors.message?.message || ""}
                </p>
                <p id="message-counter" className="text-xs text-slate-500">
                  {messageLength}/2000
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full disabled:pointer-events-none disabled:opacity-60"
            >
              {isSubmitting ? (
                <LoaderCircle
                  aria-hidden
                  className="size-4 animate-spin motion-reduce:animate-none"
                />
              ) : (
                <Send aria-hidden className="size-4" />
              )}
              {isSubmitting
                ? t("contact.buttons.sending")
                : t("contact.buttons.submit")}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
