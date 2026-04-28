import './dark-style.css'

document.addEventListener('DOMContentLoaded', () => {


  // Sticky Navbar & Mobile Tab Menu
  const navbar = document.getElementById('navbar');
  const navLogo = document.getElementById('navLogo');
  const navLinks = document.getElementById('navLinks');
  const mobileTabMenu = document.getElementById('mobileTabMenu');
  const heroSection = document.getElementById('home');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('shadow-md', 'bg-white/95', 'backdrop-blur-sm');
      navbar.classList.remove('bg-transparent', 'py-4');
      navbar.classList.add('py-2');
      if(navLogo) { navLogo.classList.remove('text-white'); navLogo.classList.add('text-dark-gray'); }
      if(navLinks) { navLinks.classList.remove('text-white'); navLinks.classList.add('text-dark-gray'); }
    } else {
      navbar.classList.remove('shadow-md', 'bg-white/95', 'backdrop-blur-sm', 'py-2');
      navbar.classList.add('bg-transparent', 'py-4');
      if(navLogo) { navLogo.classList.add('text-white'); navLogo.classList.remove('text-dark-gray'); }
      if(navLinks) { navLinks.classList.add('text-white'); navLinks.classList.remove('text-dark-gray'); }
    }

    if (mobileTabMenu && heroSection) {
      const heroBottom = heroSection.offsetHeight - 80;
      if (window.scrollY > heroBottom) {
        mobileTabMenu.classList.remove('-translate-y-full');
        mobileTabMenu.classList.add('translate-y-0');
        navbar.classList.add('max-md:-translate-y-full');
      } else {
        mobileTabMenu.classList.add('-translate-y-full');
        mobileTabMenu.classList.remove('translate-y-0');
        navbar.classList.remove('max-md:-translate-y-full');
      }
    }
  });

  // Intersection Observer for Animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });

  // Date Input Constraints
  const checkinInput = document.getElementById('checkin');
  const checkoutInput = document.getElementById('checkout');
  
  if (checkinInput && checkoutInput) {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

    checkinInput.min = todayStr;
    checkoutInput.min = tomorrowStr;
    
    checkinInput.addEventListener('change', (e) => {
      const parts = e.target.value.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        
        const nextDay = new Date(year, month, day + 1);
        const nextDayStr = `${nextDay.getFullYear()}-${String(nextDay.getMonth() + 1).padStart(2, '0')}-${String(nextDay.getDate()).padStart(2, '0')}`;
        
        checkoutInput.min = nextDayStr;
        checkoutInput.value = nextDayStr;
      }
    });
  }

  // Booking Modal Logic
  const modal = document.getElementById('bookingModal');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const addGuestBtn = document.getElementById('addGuestBtn');
  const extraGuestsContainer = document.getElementById('extraGuestsContainer');
  let extraGuestCount = 0;

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      // small delay to allow display flex to apply before opacity transition
      setTimeout(() => {
        modal.querySelector('.modal-content').classList.remove('scale-95', 'opacity-0');
        modal.querySelector('.modal-content').classList.add('scale-100', 'opacity-100');
        modal.classList.remove('opacity-0');
      }, 10);
    });
  });

  const closeModal = () => {
    modal.querySelector('.modal-content').classList.remove('scale-100', 'opacity-100');
    modal.querySelector('.modal-content').classList.add('scale-95', 'opacity-0');
    modal.classList.add('opacity-0');
    setTimeout(() => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }, 300); // match transition duration
  };

  closeModalBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Form Handling & Calculation
  const bookingForm = document.getElementById('bookingForm');
  const submitBtn = document.getElementById('submitBtn');
  const submitText = document.getElementById('submitText');
  const submitLoader = document.getElementById('submitLoader');
  
  // checkinInput and checkoutInput are already declared at the top of the file
  const adultsInput = document.getElementById('adults');
  const kidsInput = document.getElementById('kids');
  const totalAmountDisplay = document.getElementById('totalAmount');
  const calculationDetails = document.getElementById('calculationDetails');
  
  const groupBookingCheckbox = document.getElementById('groupBooking');
  const soloTravellerCheckbox = document.getElementById('soloTraveller');
  const guestCountsContainer = document.getElementById('guestCountsContainer');
  const groupBookingContainer = document.getElementById('groupBookingContainer');
  const soloTravellerContainer = document.getElementById('soloTravellerContainer');

  const updateVisibility = () => {
    const isGroup = groupBookingCheckbox?.checked;
    const isSolo = soloTravellerCheckbox?.checked;

    if (isGroup) {
      guestCountsContainer.classList.add('hidden');
      guestCountsContainer.classList.remove('grid');
      soloTravellerContainer?.classList.add('hidden');
    } else if (isSolo) {
      guestCountsContainer.classList.add('hidden');
      guestCountsContainer.classList.remove('grid');
      groupBookingContainer?.classList.add('hidden');
    } else {
      guestCountsContainer.classList.remove('hidden');
      guestCountsContainer.classList.add('grid');
      soloTravellerContainer?.classList.remove('hidden');
      groupBookingContainer?.classList.remove('hidden');
    }
    calculateTotal();
  };

  groupBookingCheckbox?.addEventListener('change', updateVisibility);
  soloTravellerCheckbox?.addEventListener('change', updateVisibility);

  function calculateTotal() {
    if (!checkinInput || !checkoutInput || !adultsInput || !totalAmountDisplay) return;

    const categoryCheckboxes = document.querySelectorAll('.category-checkbox');
    const checkinDate = new Date(checkinInput.value);
    const checkoutDate = new Date(checkoutInput.value);
    
    let nights = 1;
    if (!isNaN(checkinDate) && !isNaN(checkoutDate) && checkoutDate > checkinDate) {
      const diffTime = Math.abs(checkoutDate - checkinDate);
      nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    const adults = parseInt(adultsInput.value) || 1;
    const kids = parseInt(kidsInput.value) || 0;
    const isGroupBooking = groupBookingCheckbox?.checked;
    const isSolo = soloTravellerCheckbox?.checked;
    
    // Default to 1 head for calculation if group booking or solo is checked
    const totalHeads = (isGroupBooking || isSolo) ? 1 : (adults + kids);

    let total = 0;
    let selectedCategories = 0;

    categoryCheckboxes.forEach(cb => {
      if (cb.checked) {
        selectedCategories++;
        const price = parseInt(cb.getAttribute('data-price')) || 0;
        const type = cb.getAttribute('data-type');
        
        if (type === 'head') {
          total += price * totalHeads * nights;
        } else {
          total += price * nights;
        }
      }
    });

    const totalContainer = document.getElementById('totalContainer');

    if (selectedCategories === 0) {
      if (totalContainer) {
        totalContainer.classList.add('hidden');
        totalContainer.classList.remove('flex');
      }
      totalAmountDisplay.textContent = 'Rs. 0';
      calculationDetails.textContent = 'Select a category to see estimate';
    } else {
      if (totalContainer) {
        totalContainer.classList.remove('hidden');
        totalContainer.classList.add('flex');
      }
      if (isGroupBooking) {
        totalAmountDisplay.textContent = 'Contact Us';
        totalAmountDisplay.classList.remove('text-3xl');
        totalAmountDisplay.classList.add('text-xl');
        calculationDetails.textContent = 'Discuss about the price with Our Reservation Manager';
      } else {
        totalAmountDisplay.textContent = `Rs. ${total.toLocaleString()}`;
        totalAmountDisplay.classList.remove('text-xl');
        totalAmountDisplay.classList.add('text-3xl');
        calculationDetails.textContent = `${nights} night(s) • ${totalHeads} guest(s)`;
      }
    }
  }

  // Attach calculation listeners
  [checkinInput, checkoutInput, adultsInput, kidsInput].forEach(el => {
    if(el) {
      el.addEventListener('change', calculateTotal);
      el.addEventListener('input', calculateTotal);
    }
  });
  
  // Use event delegation for category checkboxes to ensure they work even after DOM updates
  bookingForm?.addEventListener('change', (e) => {
    if (e.target.classList.contains('category-checkbox')) {
      calculateTotal();
    }
  });

  bookingForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate inputs
    const formData = new FormData(bookingForm);
    const data = Object.fromEntries(formData.entries());
    

    
    const categories = Array.from(formData.getAll('category[]'));
    data.categories = categories;

    if (!data.guestName || !data.mobile || !data.checkIn || !data.checkOut || categories.length === 0) {
      showToast('Please fill in all required fields and select at least one category.', 'error');
      return;
    }

    // Format WhatsApp Message
    const phoneNumber = "6281234567890"; // WhatsApp number from footer
    const isGroupBooking = groupBookingCheckbox?.checked;
    const isSolo = soloTravellerCheckbox?.checked;
    
    let message = `*New Booking Request - LuxeStay*\n\n`;
    message += `*Name:* ${data.guestName}\n`;
    message += `*Mobile:* ${data.mobile}\n`;
    message += `*Check-in:* ${data.checkIn}\n`;
    message += `*Check-out:* ${data.checkOut}\n\n`;
    
    if (isGroupBooking) {
      message += `*Booking Type:* Group Booking\n`;
    } else if (isSolo) {
      message += `*Booking Type:* Solo Traveller\n`;
    } else {
      message += `*Adults:* ${data.adults || 1}\n`;
      message += `*Kids:* ${data.kids || 0}\n`;
    }
    
    message += `\n*Selected Categories:*\n`;
    categories.forEach(cat => {
      message += `- ${cat}\n`;
    });
    
    if (!isGroupBooking) {
      message += `\n*Estimated Total:* ${totalAmountDisplay.textContent}`;
    } else {
      message += `\n*Request:* Custom Quote required for Group Booking.`;
    }

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Simulate slight delay for loading state
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      showToast('Redirecting to WhatsApp...', 'success');
      closeModal();
      bookingForm.reset();
      
      submitBtn.disabled = false;
      submitText.classList.remove('hidden');
      submitLoader.classList.add('hidden');
    }, 800);
  });

  // Lightbox Logic
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeLightboxBtn = document.getElementById('closeLightboxBtn');
  const galleryImages = document.querySelectorAll('.gallery-item img');

  galleryImages.forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightbox.classList.remove('hidden');
      lightbox.classList.add('flex');
      setTimeout(() => {
        lightbox.classList.remove('opacity-0');
      }, 10);
    });
  });

  const closeLightbox = () => {
    lightbox.classList.add('opacity-0');
    setTimeout(() => {
      lightbox.classList.add('hidden');
      lightbox.classList.remove('flex');
    }, 300);
  };

  closeLightboxBtn?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Scroll to Top
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollTopBtn.classList.remove('opacity-0', 'translate-y-10');
      scrollTopBtn.classList.add('opacity-100', 'translate-y-0');
    } else {
      scrollTopBtn.classList.add('opacity-0', 'translate-y-10');
      scrollTopBtn.classList.remove('opacity-100', 'translate-y-0');
    }
  });

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Toast System
  const toastContainer = document.getElementById('toast-container');
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-primary' : 'bg-red-500';
    toast.className = `${bgColor} text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-y-full opacity-0 flex items-center gap-3`;
    
    const icon = type === 'success' 
      ? `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`
      : `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`;

    toast.innerHTML = `
      ${icon}
      <span class="font-medium">${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.classList.remove('translate-y-full', 'opacity-0');
    }, 10);

    // Animate out and remove
    setTimeout(() => {
      toast.classList.add('translate-y-full', 'opacity-0');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }
  // Hero Auto Slider
  const heroSlides = document.querySelectorAll('.hero-slide');
  let currentSlide = 0;
  if (heroSlides.length > 0) {
    setInterval(() => {
      heroSlides[currentSlide].classList.remove('opacity-100');
      heroSlides[currentSlide].classList.add('opacity-0');
      
      currentSlide = (currentSlide + 1) % heroSlides.length;
      
      heroSlides[currentSlide].classList.remove('opacity-0');
      heroSlides[currentSlide].classList.add('opacity-100');
    }, 2000);
  }
  // ScrollSpy for Navigation Links
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('#navLinks a, #mobileTabMenu a[href^="#"]');

  const scrollSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(link => {
          // Reset colors
          link.classList.remove('text-yellow-500');
          if (link.closest('#mobileTabMenu')) {
            link.classList.add('text-gray-500');
          }
          
          // Set active color
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('text-yellow-500');
            if (link.closest('#mobileTabMenu')) {
              link.classList.remove('text-gray-500');
            }
          }
        });
      }
    });
  }, {
    rootMargin: '-50% 0px -50% 0px'
  });

  sections.forEach(section => {
    scrollSpyObserver.observe(section);
  });

  // Initialize Gallery Carousel
  if (typeof Swiper !== 'undefined') {
    new Swiper(".gallerySwiper", {
      slidesPerView: 1.2,
      spaceBetween: 16,
      grabCursor: true,
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        640: {
          slidesPerView: 2.2,
          spaceBetween: 24,
        },
        1024: {
          slidesPerView: 3.2,
          spaceBetween: 24,
        },
      }
    });

    // Initialize Events Swiper
    new Swiper(".eventsSwiper", {
      slidesPerView: 1.1,
      spaceBetween: 16,
      grabCursor: true,
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".eventsSwiper .swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        640: {
          slidesPerView: 2.2,
          spaceBetween: 24,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 32,
        },
      }
    });
  }
  // FAQ Accordion Logic
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('button');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('i');
    
    btn.addEventListener('click', () => {
      const isHidden = answer.classList.contains('hidden');
      
      // Close all other FAQs
      faqItems.forEach(otherItem => {
        otherItem.querySelector('.faq-answer').classList.add('hidden');
        otherItem.querySelector('i').classList.remove('rotate-180');
      });

      // Toggle current FAQ
      if (isHidden) {
        answer.classList.remove('hidden');
        icon.classList.add('rotate-180');
      }
    });
  });
});
