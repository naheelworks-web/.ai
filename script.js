/**
 * JARVIS AI — High-Performance Interaction Suite
 * Developer: Naheel (Lahore, Pakistan)
 * Features: Interactive Voice Command Simulator, FAQ Accordion, Sticky Header, Mobile Drawer
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navigation Header Blur on Scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // 2. Mobile Drawer Navigation
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
      const isOpen = mobileDrawer.classList.contains('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. Interactive Command Simulator Data
  const commandScenarios = {
    music: {
      prompt: '"Jarvis, play Interstellar soundtrack on YouTube."',
      response: '"Initiating Hans Zimmer\'s Interstellar OST on YouTube immediately, Sir. Volume normalized."',
      latency: '142ms',
      actions: [
        {
          type: 'success',
          icon: '▶',
          text: 'AUTO_PLAY: Launched YouTube in background (First Match)'
        },
        {
          type: 'code',
          text: 'subprocess.Popen(["chrome.exe", "https://youtu.be/..."])'
        }
      ]
    },
    news: {
      prompt: '"Jarvis, what are the top headlines right now?"',
      response: '"Here is your 60-second briefing: Global tech stocks rally following AI infrastructure investments, and local weather forecasts in Lahore anticipate clear skies."',
      latency: '188ms',
      actions: [
        {
          type: 'success',
          icon: '📡',
          text: 'FEED_FETCHED: Google News RSS XML parsed in 38ms'
        },
        {
          type: 'code',
          text: 'groq.chat.completions.create(model="llama-3-70b-versatile")'
        }
      ]
    },
    apps: {
      prompt: '"Jarvis, open Notepad and launch the calculator."',
      response: '"Launching Notepad and Windows Calculator in parallel background threads. Desktop remains unblocked."',
      latency: '95ms',
      actions: [
        {
          type: 'success',
          icon: '⚡',
          text: 'PROCESS_SPAWNED: notepad.exe (PID 6140) & calc.exe (PID 6144)'
        },
        {
          type: 'code',
          text: 'threading.Thread(target=launch_app, daemon=True).start()'
        }
      ]
    },
    math: {
      prompt: '"Jarvis, solve for x in 4x squared minus 16 equals zero and explain."',
      response: '"Factoring the equation: 4(x² - 4) = 0. Therefore (x - 2)(x + 2) = 0. The roots are x = 2 and x = -2."',
      latency: '210ms',
      actions: [
        {
          type: 'success',
          icon: '🧠',
          text: 'REASONING_COMPLETE: Step-by-step mathematical breakdown'
        },
        {
          type: 'code',
          text: 'inference_tokens: 42 | time_to_first_token: 180ms'
        }
      ]
    }
  };

  const tabs = document.querySelectorAll('.sim-tab');
  const userPromptEl = document.getElementById('simUserPrompt');
  const jarvisResponseEl = document.getElementById('simJarvisResponse');
  const latencyEl = document.getElementById('simLatency');
  const actionBadgesEl = document.getElementById('simActionBadges');
  const waveformEl = document.getElementById('audioWaveform');

  // Trigger audio wave animation refresh
  function triggerAudioPulse() {
    if (!waveformEl) return;
    const bars = waveformEl.querySelectorAll('.wave-bar');
    bars.forEach(bar => {
      bar.style.animation = 'none';
      void bar.offsetWidth; // trigger reflow
      bar.style.animation = '';
    });
  }

  // Typewriter effect simulation for realistic AI feel
  let typingTimer = null;
  function streamJarvisText(targetEl, fullText) {
    if (typingTimer) clearInterval(typingTimer);
    targetEl.textContent = '';
    let index = 0;
    const speed = 12; // ms per char

    typingTimer = setInterval(() => {
      if (index < fullText.length) {
        targetEl.textContent += fullText.charAt(index);
        index++;
      } else {
        clearInterval(typingTimer);
      }
    }, speed);
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const commandKey = tab.getAttribute('data-command');
      const data = commandScenarios[commandKey];
      if (!data) return;

      // Update Tab States
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Update User Speech Prompt
      if (userPromptEl) {
        userPromptEl.textContent = data.prompt;
      }

      // Update Latency
      if (latencyEl) {
        latencyEl.innerHTML = `<span class="live-dot"></span><span>LATENCY: ${data.latency}</span>`;
      }

      // Trigger Audio Waves
      triggerAudioPulse();

      // Stream JARVIS response
      if (jarvisResponseEl) {
        streamJarvisText(jarvisResponseEl, data.response);
      }

      // Update Action Badges
      if (actionBadgesEl) {
        actionBadgesEl.innerHTML = '';
        data.actions.forEach(act => {
          const badge = document.createElement('div');
          badge.className = `action-tag ${act.type}`;
          if (act.type === 'success') {
            badge.innerHTML = `<span class="tag-icon">${act.icon}</span><span class="tag-text">${act.text}</span>`;
          } else {
            badge.innerHTML = `<span class="mono-code">${act.text}</span>`;
          }
          actionBadgesEl.appendChild(badge);
        });
      }
    });
  });

  // 4. FAQ Accordion Mechanism
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = item.querySelector('.accordion-body');
      const isExpanded = header.getAttribute('aria-expanded') === 'true';

      // Close all other open items for clean accordion UX
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherHeader = otherItem.querySelector('.accordion-header');
          const otherBody = otherItem.querySelector('.accordion-body');
          if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
          if (otherBody) otherBody.style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isExpanded) {
        item.classList.remove('active');
        header.setAttribute('aria-expanded', 'false');
        body.style.maxHeight = null;
      } else {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  // 5. Smooth Scroll Offset Correction for Fixed Navbar
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || !href.startsWith('#')) return;
      const targetElement = document.querySelector(href);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});