import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Icon } from "./Icons";
import "./CollaboratorCarousel.css";

const collaborators = [
  {
    name: "Hugging Face",
    slug: "hugging-face",
    category: "OPEN-SOURCE AI",
    description:
      "Open models, datasets, and tools for the machine-learning community.",
    logo: "/partners/hugging-face.svg",
    url: "https://huggingface.co/",
  },
  {
    name: "Microsoft",
    slug: "microsoft",
    category: "CLOUD & DEVELOPER TOOLS",
    description:
      "Cloud services, AI platforms, and tools for developers and teams.",
    logo: "/partners/microsoft.png",
    url: "https://www.microsoft.com/",
  },
  {
    name: "Modal",
    slug: "modal",
    category: "AI COMPUTE",
    description:
      "Cloud infrastructure for developing, training, and serving AI applications.",
    logo: "/partners/modal-light.svg",
    url: "https://modal.com/",
  },
  {
    name: "Shadeform",
    slug: "shadeform",
    category: "GPU INFRASTRUCTURE",
    description:
      "A marketplace for finding and deploying GPU compute across cloud providers.",
    logo: "/partners/shadeform.svg",
    url: "https://shadeform.com/",
  },
];

/** A seamless logo carousel with a single accessible list and keyboard-hidden visual copies. */
export function CollaboratorCarousel() {
  const section = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const interaction = useRef({
    hovered: false,
    focused: false,
    pointer: -1,
    x: 0,
    y: 0,
    lastX: 0,
    dragged: false,
  });
  const [dragging, setDragging] = useState(false);
  const wrap = (position: number) => {
    const width =
      viewport.current
        ?.querySelector(".collaborator-group")
        ?.getBoundingClientRect().width ?? 0;
    return width ? ((position % width) + width) % width : position;
  };
  const finishDrag = (event: PointerEvent<HTMLDivElement>) => {
    const state = interaction.current;
    if (state.pointer !== event.pointerId) return;
    state.pointer = -1;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(true);
  const [background, setBackground] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduced(preference.matches);
    const updateVisibility = () => setBackground(document.hidden);
    updatePreference();
    updateVisibility();
    preference.addEventListener("change", updatePreference);
    document.addEventListener("visibilitychange", updateVisibility);
    const observer = new IntersectionObserver((entries) =>
      setVisible(entries[0].isIntersecting),
    );
    if (section.current) observer.observe(section.current);
    return () => {
      preference.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", updateVisibility);
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    const element = viewport.current;
    if (!element || reduced || !visible || background) return;
    let frame = 0;
    let previous = 0;
    let position = element.scrollLeft;
    let written = element.scrollLeft;
    const animate = (now: number) => {
      const delta = previous ? Math.min(now - previous, 50) : 0;
      previous = now;
      const state = interaction.current;
      if (state.hovered || state.focused || state.pointer !== -1) {
        position = element.scrollLeft;
      } else {
        // Retain subpixel progress even on browsers that round scrollLeft.
        if (Math.abs(element.scrollLeft - written) > 1)
          position = element.scrollLeft;
        position = wrap(position + delta * 0.032);
        element.scrollLeft = position;
      }
      written = element.scrollLeft;
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [reduced, visible, background]);
  return (
    <section
      ref={section}
      className="container collaborator-carousel"
      id="collaborators"
      aria-labelledby="collaborators-title"
      aria-roledescription="carousel"
      data-paused={reduced || !visible || background}
    >
      <div className="collaborator-heading">
        <div>
          <span className="eyebrow">
            <span className="status-dot" /> BETTER TOGETHER
          </span>
          <h2 id="collaborators-title">
            Companies we collaborate with<span className="blue">.</span>
          </h2>
          <p>An ecosystem of AI, cloud, and compute.</p>
        </div>
      </div>
      <div
        ref={viewport}
        className="collaborator-viewport"
        data-dragging={dragging}
        tabIndex={0}
        role="group"
        aria-label="Company cards. Drag or use the left and right arrow keys to explore."
        onDragStart={(event) => event.preventDefault()}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") interaction.current.hovered = true;
        }}
        onPointerLeave={() => {
          interaction.current.hovered = false;
        }}
        onPointerDown={(event) => {
          if (!event.isPrimary || event.button !== 0) return;
          Object.assign(interaction.current, {
            pointer: event.pointerId,
            x: event.clientX,
            y: event.clientY,
            lastX: event.clientX,
            dragged: false,
          });
        }}
        onPointerMove={(event) => {
          const state = interaction.current;
          if (state.pointer !== event.pointerId) return;
          const dx = event.clientX - state.x;
          const dy = event.clientY - state.y;
          if (
            !state.dragged &&
            Math.abs(dx) > 6 &&
            Math.abs(dx) > Math.abs(dy)
          ) {
            state.dragged = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            setDragging(true);
          }
          if (state.dragged) {
            event.preventDefault();
            event.currentTarget.scrollLeft = wrap(
              event.currentTarget.scrollLeft - (event.clientX - state.lastX),
            );
          }
          state.lastX = event.clientX;
        }}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onLostPointerCapture={(event) => {
          // Touch starts with implicit capture on the nested link. Only finish
          // when this viewport loses its own capture, not when capture transfers.
          if (event.target === event.currentTarget) finishDrag(event);
        }}
        onClickCapture={(event) => {
          if (interaction.current.dragged && event.detail > 0) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
        onFocusCapture={(event) => {
          if ((event.target as HTMLElement).matches(":focus-visible")) {
            interaction.current.focused = true;
            const card = (event.target as HTMLElement).closest("a");
            card?.scrollIntoView({
              block: "nearest",
              inline: "nearest",
              behavior: "instant",
            });
          }
        }}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node))
            interaction.current.focused = false;
        }}
        onKeyDown={(event) => {
          if (
            event.target !== event.currentTarget ||
            !["ArrowLeft", "ArrowRight"].includes(event.key)
          )
            return;
          event.preventDefault();
          const first = event.currentTarget.querySelector("li");
          const step = (first?.getBoundingClientRect().width ?? 292) + 16;
          event.currentTarget.scrollLeft = wrap(
            event.currentTarget.scrollLeft +
              (event.key === "ArrowRight" ? step : -step),
          );
        }}
      >
        <div className="collaborator-track">
          {[0, 1, 2].map((copy) => (
            <ul
              className="collaborator-group"
              key={copy}
              {...(copy > 0
                ? { "aria-hidden": true }
                : { "aria-label": "Collaborating companies" })}
            >
              {collaborators.map((company) => (
                <li key={company.slug}>
                  <a
                    className={`collaborator-card collaborator-${company.slug}`}
                    href={company.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={copy > 0 ? -1 : undefined}
                    aria-label={`${company.name} — ${company.category.toLowerCase()} (opens in a new tab)`}
                  >
                    <div className="collaborator-card-top">
                      <div className={`collaborator-logo logo-${company.slug}`}>
                        <img
                          src={company.logo}
                          alt={copy > 0 ? "" : `${company.name} logo`}
                          draggable={false}
                          width={company.slug === "hugging-face" ? 48 : 160}
                          height={48}
                          loading="eager"
                          decoding="async"
                        />
                      </div>
                      <Icon name="up" size={16} />
                    </div>
                    <h3>{company.name}</h3>
                    <span className="collaborator-category">
                      {company.category}
                    </span>
                    <p>{company.description}</p>
                    <span className="collaborator-card-bottom">
                      Explore company <Icon name="arrow" size={13} />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
      <p className="collaborator-hint">
        <span className="status-dot" /> Moving forward, together.{" "}
        <span>Drag to explore · Tab for links</span>
      </p>
    </section>
  );
}
