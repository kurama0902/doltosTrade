import { useEffect } from "react";
import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

/** Owns page motion and restores the original DOM when preferences change. */
export function usePageMotion(root: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const select = gsap.utils.selector(root);
        const hero = gsap.timeline({ defaults: { ease: "power3.out" } });
        hero
          .from(
            ".headline-word",
            {
              yPercent: 105,
              opacity: 0,
              rotationX: -35,
              duration: 1.1,
              stagger: 0.13,
            },
            0.15,
          )
          .from(
            ".hero-enter",
            {
              y: 24,
              opacity: 0,
              duration: 0.85,
              stagger: 0.14,
            },
            0.45,
          )
          .from(
            ".hero-visual",
            {
              y: 45,
              opacity: 0,
              scale: 0.96,
              duration: 1.25,
              clearProps: "transform",
            },
            0.35,
          )
          .from(
            ".collaborator-heading, .collaborator-viewport",
            {
              y: 16,
              opacity: 0,
              duration: 0.7,
              stagger: 0.09,
            },
            0.95,
          );

        // Word masks keep the original typography and nested accent colors.
        select("main h2").forEach((heading: HTMLElement) => {
          SplitText.create(heading, {
            type: "words",
            mask: "words",
            wordsClass: "motion-word",
            autoSplit: true,
            onSplit(split) {
              return gsap.from(split.words, {
                yPercent: 110,
                rotation: 3,
                opacity: 0,
                duration: 0.85,
                stagger: 0.07,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: heading,
                  start: "top 90%",
                  once: true,
                },
              });
            },
          });
        });

        select(".reveal").forEach((element: HTMLElement) => {
          gsap.from(element, {
            y: 32,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            clearProps: "transform",
            scrollTrigger: { trigger: element, start: "top 93%", once: true },
          });
        });

        select(".benefit-grid, .learn-grid, .pricing-grid").forEach(
          (group: HTMLElement) => {
            gsap.from(group.children, {
              y: 55,
              opacity: 0,
              scale: 0.96,
              rotationX: 9,
              duration: 0.85,
              stagger: 0.12,
              ease: "power3.out",
              clearProps: "transform",
              scrollTrigger: { trigger: group, start: "top 88%", once: true },
            });
          },
        );
        gsap.from(".platform-stats > div", {
          y: 25,
          opacity: 0,
          duration: 0.75,
          stagger: 0.13,
          scrollTrigger: {
            trigger: ".platform-stats",
            start: "top 90%",
            once: true,
          },
        });

        const parallax = (
          target: string,
          trigger: string,
          from: gsap.TweenVars,
          to: gsap.TweenVars,
        ) => {
          gsap.fromTo(target, from, {
            ...to,
            ease: "none",
            scrollTrigger: {
              trigger,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.3,
            },
          });
        };
        // Separate layers have different travel distances for a sense of depth.
        parallax(
          ".parallax-orbit",
          ".hero",
          { y: 35, rotation: -14 },
          { y: -130, rotation: 18 },
        );
        parallax(".parallax-terminal", ".hero", { y: 15 }, { y: -55 });
        parallax(".hero-grid", ".hero", { y: 0 }, { y: 100 });
        parallax(".orb-cross", ".hero", { rotation: -15 }, { rotation: 90 });
        parallax(
          ".onboard-decoration",
          ".ai-section",
          { y: 35, rotation: -8 },
          { y: -45, rotation: 12 },
        );
        parallax(
          ".assistant-mark",
          ".ai-section",
          { y: 5, rotation: -10 },
          { y: -5, rotation: 10 },
        );
        parallax(
          ".connection-line",
          ".connections-section",
          { opacity: 0.25 },
          { opacity: 1 },
        );
        parallax(
          ".newsletter-orbit",
          ".newsletter",
          { rotation: 10, y: 35 },
          { rotation: 85, y: -40 },
        );
        parallax(
          ".learn-art.orbit > span",
          ".learn-grid",
          { y: 18, rotation: -35 },
          { y: -18, rotation: -10 },
        );
        parallax(".learn-art.orbit > b", ".learn-grid", { y: -18 }, { y: 22 });
        parallax(
          ".security-orbit",
          ".learn-grid",
          { rotation: -40 },
          { rotation: 10 },
        );

        // Ambient motion pauses outside the viewport rather than running forever.
        const ambient = (target: string, vars: gsap.TweenVars) => {
          const tween = gsap.to(target, {
            ...vars,
            repeat: -1,
            yoyo: true,
            paused: true,
            ease: "sine.inOut",
          });
          ScrollTrigger.create({
            trigger: target,
            start: "top bottom",
            end: "bottom top",
            onToggle: ({ isActive }) => {
              if (isActive) tween.play();
              else tween.pause();
            },
          });
        };
        ambient(".orb-core", { y: -12, duration: 3.4 });
        ambient(".learn-art.secure > svg", { y: -8, rotation: 5, duration: 3 });
        ambient(".security-star", { scale: 1.2, opacity: 0.55, duration: 2.2 });
        ambient(".footer-big-star", { rotation: 30, duration: 4 });
        ScrollTrigger.refresh();
      });

      media.add(
        "(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)",
        () => {
          const cleanups: Array<() => void> = [];
          root.current
            ?.querySelectorAll<HTMLElement>(
              ".benefit-card, .learn-card, .pricing-card",
            )
            .forEach((card) => {
              const move = (event: PointerEvent) => {
                if (event.pointerType !== "mouse") return;
                const bounds = card.getBoundingClientRect();
                const x =
                  ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
                const y =
                  ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
                card.style.setProperty("--tilt-x", String(-y));
                card.style.setProperty("--tilt-y", String(x || 0.001));
                card.style.setProperty(
                  "--tilt-angle",
                  `${Math.min(Math.hypot(x, y), 1) * 4}deg`,
                );
              };
              const reset = () =>
                card.style.setProperty("--tilt-angle", "0deg");
              card.addEventListener("pointermove", move);
              card.addEventListener("pointerleave", reset);
              card.addEventListener("blur", reset);
              cleanups.push(() => {
                card.removeEventListener("pointermove", move);
                card.removeEventListener("pointerleave", reset);
                card.removeEventListener("blur", reset);
                ["--tilt-x", "--tilt-y", "--tilt-angle"].forEach((property) =>
                  card.style.removeProperty(property),
                );
              });
            });
          return () => cleanups.forEach((cleanup) => cleanup());
        },
      );
      return () => media.revert();
    }, root);
    return () => ctx.revert();
  }, [root]);
}
