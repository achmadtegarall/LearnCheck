import React from "react";
import logoLight from "../images/logo-light-mode.png";
import logoDark from "../images/logo-dark-mode.png";
import sadIcon from "../images/sad-emoticon.png";
import neutralIcon from "../images/neutral-emoticon.png";
import happyIcon from "../images/happy-emoticon.png";

export default function SelfReflectionPage({ rating, setRating, onSubmit, onSkip ,userPrefs }) {
  const isDark = userPrefs.theme === "dark";
  const logoSrc = isDark ? logoDark : logoLight;
  const titleColor = isDark
    ? "text-[var(--text-primary)]"
    : "text-[var(--blue-primary)]";

  return (
    <div
      className="
        min-h-screen w-full
        flex items-center justify-center
        bg-[var(--bg-primary)] text-[var(--text-primary)]
        transition-colors duration-300
        opacity-0 animate-fadeIn
      "
    >
      <div className="w-[var(--max-width-card)]">

        <header
          className="
            px-4 sm:px-6 py-3 sm:py-4
            flex items-center
            bg-[var(--bg-secondary)]
            border-b border-[var(--text-primary)]/20
            rounded-t-2xl shadow
          "
        >
          <img
            src={logoSrc}
            alt="LearnCheck Logo"
            className="w-14 h-14 sm:w-16 sm:h-16"
          />

          <div className="leading-tight ml-2">
            <h1 className={`font-subtitle font-bold ${titleColor}`}>
              LearnCheck!
            </h1>
            <p className={`font-mini ${titleColor}`}>
              Formative Assessment <br /> Powered with AI
            </p>
          </div>
        </header>

        <div
          className="
            px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12
            rounded-b-2xl shadow
            bg-[var(--bg-secondary)]
            transition
          "
        >
          <div className="mb-6 text-center">
            <h1 className="font-heading font-bold text-[var(--text-primary)]">
              Yuk, nilai pemahamanmu!
            </h1>
          </div>

          <div
            className="
              p-6 sm:p-8 rounded-2xl border-1 shadow-sm mb-8
              bg-[var(--text-primary)]/3
              border-[var(--text-primary)]/20
            "
          >
            <p className="font-body text-center mb-6">
              Seberapa baik pemahamanmu terhadap materi ini?
            </p>

<div className="flex justify-center gap-12 mb-6">

  <button
    onClick={() => setRating(rating === 1 ? null : 1)}
    className="transition-transform duration-300 hover:scale-110"
  >
    <img
      src={sadIcon}
      alt="Kurang memahami"
      className={`
        w-16 aspect-square object-contain
        transition-all duration-300
        ${rating === 1 
          ? "scale-[1.25] brightness-125 -translate-y-1" 
          : "scale-100"
        }
      `}
      style={{
        filter:
          rating === 1
            ? "drop-shadow(0 0 14px var(--red-primary))"
            : "none"
      }}
    />
  </button>

  <button
    onClick={() => setRating(rating === 2 ? null : 2)}
    className="transition-transform duration-300 hover:scale-110"
  >
    <img
      src={neutralIcon}
      alt="Cukup memahami"
      className={`
        w-16 aspect-square object-contain
        transition-all duration-300
        ${rating === 2 
          ? "scale-[1.25] brightness-125 -translate-y-1" 
          : "scale-100"
        }
      `}
      style={{
        filter:
          rating === 2
            ? "drop-shadow(0 0 14px var(--yellow-primary))"
            : "none"
      }}
    />
  </button>

  <button
    onClick={() => setRating(rating === 3 ? null : 3)}
    className="transition-transform duration-300 hover:scale-110"
  >
    <img
      src={happyIcon}
      alt="Memahami dengan baik"
      className={`
        w-16 aspect-square object-contain
        transition-all duration-300
        ${rating === 3
          ? "scale-[1.25] brightness-125 -translate-y-1"
          : "scale-100"
        }
      `}
      style={{
        filter:
          rating === 3
            ? "drop-shadow(0 0 14px var(--green-primary))"
            : "none"
      }}
    />
  </button>

</div>
          </div>
          <button
            disabled={!rating}
            onClick={onSubmit}
            className="
              w-full py-3 sm:py-4 rounded-2xl font-bold
              bg-[var(--blue-primary)] text-white
              hover:brightness-110 active:brightness-95
              disabled:opacity-50 disabled:cursor-not-allowed
              transition
            "
          >
            Beri Rating
          </button>

            <button
                onClick={onSkip}
                className="
                w-full py-3 sm:py-4 rounded-2xl font-semibold
                bg-[var(--bg-secondary)]
                text-[var(--text-primary)]
                border border-[var(--text-primary)]/30
                hover:bg-[var(--bg-primary)]/20
                transition mt-2 sm:mt-3
                "
            >
                Lewati
            </button>
        </div>
      </div>
    </div>
  );
}
