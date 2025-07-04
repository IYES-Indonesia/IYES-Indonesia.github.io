document.addEventListener("DOMContentLoaded", () => {
  console.log("IYES Indonesia - Main script loaded successfully.");

  // =============================================
  // BAGIAN 1: FUNGSI GLOBAL (Berjalan di Setiap Halaman)
  // =============================================

  /**
   * Mengatur semua fungsionalitas yang berhubungan dengan header:
   * 1. Efek 'scrolled' saat halaman digulir.
   * 2. Menyorot link navigasi yang aktif berdasarkan halaman saat ini.
   */

  function handleHeader() {
    // --- Efek Header On-Scroll (Tetap sama) ---
    const header = document.getElementById("header");
    if (header) {
      window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }
      });
    }

    // --- Active Link Highlighting (VERSI BARU & LEBIH BAIK) ---
    const currentPath = window.location.pathname; // Contoh: "/tentang-iyes/tentang-kami.html"
    const navLinks = document.querySelectorAll(
      ".nav-links > .nav-item > .nav-link"
    );

    // Hapus semua class aktif terlebih dahulu untuk reset
    navLinks.forEach((link) => {
      link.classList.remove("active-link");
    });

    let activeFound = false;

    // Logika baru untuk mendeteksi berdasarkan folder
    navLinks.forEach((link) => {
      const category = link.dataset.category; // Mengambil nilai dari data-category
      if (category && currentPath.includes(`/${category}/`)) {
        link.classList.add("active-link");
        activeFound = true;
      }
    });

    // Jika tidak ada kategori yang cocok (misal: di halaman root seperti index.html, alumni.html)
    // Jalankan logika lama yang berbasis nama file
    if (!activeFound) {
      const pageName = currentPath.split("/").pop() || "index.html";
      navLinks.forEach((link) => {
        const linkHref = link.getAttribute("href");
        if (linkHref) {
          const linkPath = linkHref.split("/").pop();
          if (linkPath === pageName) {
            link.classList.add("active-link");
          }
        }
      });
    }
  }

  /**
   * Mengatur fungsionalitas tombol menu mobile (hamburger).
   */
  function handleMobileMenu() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    if (menuToggle && navLinks) {
      menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        menuToggle.classList.toggle("active");
      });
    }
  }

  /**
   * Mengatur fungsionalitas umum seperti tombol "Scroll ke Atas"
   * dan update tahun di footer.
   */
  function handleUtilities() {
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    if (scrollToTopBtn) {
      window.addEventListener("scroll", () => {
        if (window.pageYOffset > 300) {
          scrollToTopBtn.style.display = "flex";
        } else {
          scrollToTopBtn.style.display = "none";
        }
      });
      scrollToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    const currentYearSpan = document.getElementById("current-year");
    if (currentYearSpan) {
      currentYearSpan.textContent = new Date().getFullYear();
    }
  }

  // =============================================
  // BAGIAN 2: FUNGSI SPESIFIK HALAMAN
  // =============================================

  /**
   * Mengatur galeri testimoni dengan filter dan tombol "load more".
   */
  function handleTestimonialGallery() {
    const grid = document.querySelector(".testimonial-grid");
    if (!grid) return; // Keluar jika grid tidak ada

    // Tunggu gambar dimuat untuk layout yang akurat
    imagesLoaded(grid, function () {
      const iso = new Isotope(grid, {
        itemSelector: ".testimonial-item",
        layoutMode: "fitRows",
        // Atur agar item yang tampil (visible) yang di-layout
        visibleStyle: { display: "block", opacity: 1 },
        hiddenStyle: { display: "none", opacity: 0 },
      });

      const filterButtons = document.querySelector(".testimonial-filters");
      const loadMoreBtn = document.getElementById("load-more-btn");
      const showLessBtn = document.getElementById("show-less-btn");

      const allItems = Array.from(grid.querySelectorAll(".testimonial-item"));
      const initialCount = 8;
      const loadCount = 4;
      let shownCount = initialCount;

      // Fungsi untuk mengupdate tampilan berdasarkan jumlah item yang harus tampil
      function updateVisibleItems() {
        // Tampilkan item sampai batas `shownCount`
        allItems.forEach((item, index) => {
          item.style.display = index < shownCount ? "block" : "none";
        });
        iso.layout(); // Perintahkan Isotope untuk mengatur ulang layout
      }

      // Terapkan kondisi awal
      updateVisibleItems();

      // Cek visibilitas tombol
      function checkButtonVisibility() {
        const currentFilter = filterButtons
          .querySelector(".active")
          .getAttribute("data-filter");
        if (currentFilter !== "*") {
          loadMoreBtn.style.display = "none";
          showLessBtn.style.display = "none";
          return;
        }

        // Tombol "Load More"
        if (shownCount >= allItems.length) {
          loadMoreBtn.style.display = "none";
        } else {
          loadMoreBtn.style.display = "inline-block";
        }

        // Tombol "Show Less"
        if (shownCount > initialCount) {
          showLessBtn.style.display = "inline-block";
        } else {
          showLessBtn.style.display = "none";
        }
      }

      checkButtonVisibility();

      // Logika Tombol Filter
      filterButtons.addEventListener("click", function (event) {
        if (!event.target.matches("button")) return;

        filterButtons.querySelector(".active").classList.remove("active");
        event.target.classList.add("active");

        const filterValue = event.target.getAttribute("data-filter");

        // Saat filter, tampilkan semua item yang cocok (abaikan "load more")
        if (filterValue !== "*") {
          allItems.forEach((item) => (item.style.display = "block"));
        } else {
          // Jika kembali ke "Semua", reset ke tampilan awal
          shownCount = initialCount;
          updateVisibleItems();
        }

        iso.arrange({ filter: filterValue });
        checkButtonVisibility();
      });

      // Logika Tombol "Load More"
      loadMoreBtn.addEventListener("click", function () {
        shownCount += loadCount;
        updateVisibleItems();
        checkButtonVisibility();
      });

      // Logika Tombol "Show Less"
      showLessBtn.addEventListener("click", function () {
        shownCount = initialCount;
        updateVisibleItems();
        checkButtonVisibility();
        grid.parentElement.scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  /**
   * Mengatur animasi angka yang berjalan saat discroll ke section-nya.
   */
  function handleAnimatedCounters() {
    const section = document.querySelector(".impact-numbers-section");
    if (section) {
      const counters = section.querySelectorAll(".counter");

      const animate = () => {
        counters.forEach((counter) => {
          const target = +counter.getAttribute("data-target");
          const updateCount = () => {
            const count = +counter.innerText;
            const speed = 200;
            const increment = target / speed;
            if (count < target) {
              counter.innerText = Math.ceil(count + increment);
              setTimeout(updateCount, 5);
            } else {
              counter.innerText = target;
            }
          };
          updateCount();
        });
      };

      const observer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animate();
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.25 }
      );

      observer.observe(section);
    }
  }

  /**
   * Mengatur slider horizontal dengan tombol prev/next.
   */
  function handleArchiveSlider() {
    const slider = document.getElementById("archiveSlider");
    const prevButton = document.getElementById("slidePrevBtn");
    const nextButton = document.getElementById("slideNextBtn");

    if (slider && prevButton && nextButton) {
      const scrollAmount = 300;
      nextButton.addEventListener("click", () =>
        slider.scrollBy({ left: scrollAmount, behavior: "smooth" })
      );
      prevButton.addEventListener("click", () =>
        slider.scrollBy({ left: -scrollAmount, behavior: "smooth" })
      );
    }
  }

  /**
   * Mengatur filter program sederhana (tanpa Isotope).
   */
  function handleProgramFilter() {
    const filterContainer = document.querySelector(".program-filters");
    const programItems = document.querySelectorAll(
      "#program-grid .program-item"
    );

    if (filterContainer && programItems.length > 0) {
      filterContainer.addEventListener("click", function (e) {
        if (e.target.tagName !== "BUTTON") return;

        const filterButtons = filterContainer.querySelectorAll("button");
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        e.target.classList.add("active");

        const filterValue = e.target.getAttribute("data-filter");

        programItems.forEach((item) => {
          const itemCategory = item.getAttribute("data-category");
          if (
            filterValue === "*" ||
            (itemCategory && itemCategory.includes(filterValue))
          ) {
            item.style.display = "block";
          } else {
            item.style.display = "none";
          }
        });
      });
    }
  }

  function handleScaleUpFilter() {
    const filterContainer = document.querySelector(".scale-filters");
    const scaleUpItems = document.querySelectorAll(".scaleup-item");

    if (filterContainer && scaleUpItems.length > 0) {
      // Tampilkan hanya item pertama saat halaman dimuat
      scaleUpItems.forEach((item, index) => {
        if (index > 0) {
          item.style.display = "none";
        }
      });

      filterContainer.addEventListener("click", function (e) {
        if (!e.target.matches("button")) {
          return;
        }

        const filterButtons = filterContainer.querySelectorAll("button");
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        e.target.classList.add("active");

        const filterValue = e.target.getAttribute("data-filter");

        scaleUpItems.forEach((item) => {
          const itemCategory = item.getAttribute("data-category");
          if (itemCategory === filterValue) {
            item.style.display = "block";
          } else {
            item.style.display = "none";
          }
        });
      });
    }
  }

  // =============================================
  // BAGIAN 3: EKSEKUSI SEMUA FUNGSI
  // =============================================
  handleHeader();
  handleMobileMenu();
  handleUtilities();
  handleAnimatedCounters();
  handleScaleUpFilter();
  handleTestimonialGallery();
  handleArchiveSlider();
  handleProgramFilter();
});

// ===================================================================
// [BARU] Fungsionalitas Halaman Detail Chapter 1 YVC
// ===================================================================
document.addEventListener("DOMContentLoaded", function () {
  // Hanya jalankan kode ini jika kita berada di halaman detail chapter V2
  if (document.body.classList.contains("chapter-detail-v2-page")) {
    // 1. Animasi saat scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".fade-in-section").forEach((section) => {
      observer.observe(section);
    });

    // 2. Statistik Angka Bergerak
    const statsObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll(".stat-number");
            counters.forEach((counter) => {
              counter.innerText = "0";
              const target = +counter.getAttribute("data-target");
              const updateCounter = () => {
                const value = +counter.innerText;
                const increment = target / 100; // Kecepatan animasi
                if (value < target) {
                  counter.innerText = `${Math.ceil(value + increment)}`;
                  setTimeout(updateCounter, 15);
                } else {
                  counter.innerText = target;
                }
              };
              updateCounter();
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.8 }
    );

    const statsGrid = document.querySelector(".stats-grid");
    if (statsGrid) {
      statsObserver.observe(statsGrid);
    }

    // 3. Galeri Lightbox
    const lightbox = document.getElementById("lightbox");
    if (lightbox) {
      const lightboxImg = document.getElementById("lightbox-img");
      const galleryItems = document.querySelectorAll(".gallery-item");
      const closeBtn = lightbox.querySelector(".lightbox-close");

      galleryItems.forEach((item) => {
        item.addEventListener("click", (e) => {
          e.preventDefault();
          lightbox.style.display = "block";
          lightboxImg.src = item.getAttribute("data-src");
        });
      });

      const closeLightbox = () => {
        lightbox.style.display = "none";
      };

      closeBtn.addEventListener("click", closeLightbox);
      lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
          closeLightbox();
        }
      });
    }
  }
});

// ===================================================================
// [BARU] Fungsionalitas Slider Tim Relawan (VERSI PERBAIKAN)
// ===================================================================
document.addEventListener("DOMContentLoaded", function () {
  // Hanya jalankan jika elemen slider ada di halaman
  const slider = document.getElementById("team-slider");
  if (slider) {
    const prevButton = document.getElementById("slider-prev-btn");
    const nextButton = document.getElementById("slider-next-btn");

    // Logika baru untuk menghitung jarak scroll secara dinamis
    const updateScrollAmount = () => {
      const profileCard = slider.querySelector(".profile-card");
      if (profileCard) {
        const cardWidth = profileCard.offsetWidth;
        const cardGap = parseFloat(getComputedStyle(slider).gap);
        return cardWidth + cardGap;
      }
      return 224; // Nilai default jika kartu tidak ditemukan
    };

    nextButton.addEventListener("click", () => {
      const scrollAmount = updateScrollAmount();
      slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });

    prevButton.addEventListener("click", () => {
      const scrollAmount = updateScrollAmount();
      slider.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });
  }
});

// ===================================================================
// [BARU] fitur ubah bahasa indonesia dan inggris
// ===================================================================
function handleLanguageSwitcher() {
  const langIdButton = document.getElementById("lang-id");
  const langEnButton = document.getElementById("lang-en");

  // Fungsi untuk mendapatkan bahasa saat ini dari URL atau penyimpanan lokal
  const getCurrentLanguage = () => {
    const savedLang = localStorage.getItem("selectedLanguage");
    // Jika URL mengandung .en.html, prioritaskan itu
    if (window.location.pathname.endsWith(".en.html")) {
      return "en";
    }
    // Jika tidak, gunakan bahasa yang tersimpan, atau default ke 'id'
    return savedLang || "id";
  };

  // Fungsi untuk mengganti bahasa
  const switchLanguage = (targetLang) => {
    const currentLang = getCurrentLanguage();
    if (currentLang === targetLang) return; // Tidak melakukan apa-apa jika bahasa sudah sama

    localStorage.setItem("selectedLanguage", targetLang);
    const currentPath = window.location.pathname;
    let newPath;

    if (targetLang === "en") {
      // Mengubah dari ID ke EN: tambahkan .en sebelum .html
      newPath = currentPath.replace(".html", ".en.html");
    } else {
      // Mengubah dari EN ke ID: hapus .en dari sebelum .html
      newPath = currentPath.replace(".en.html", ".html");
    }

    // Atasi kasus khusus untuk halaman utama (index.html)
    if (newPath.endsWith("/.en.html")) {
      newPath = "/index.en.html";
    } else if (currentPath.endsWith("/index.en.html") && targetLang === "id") {
      newPath = "/index.html";
    }

    // Arahkan ke halaman baru
    window.location.href = newPath;
  };

  // Fungsi untuk mengatur tampilan tombol ID/EN
  const updateButtonState = () => {
    const currentLang = getCurrentLanguage();
    if (currentLang === "en") {
      langEnButton.classList.add("active-lang");
      langIdButton.classList.remove("active-lang");
    } else {
      langIdButton.classList.add("active-lang");
      langEnButton.classList.remove("active-lang");
    }
  };

  // Tambahkan event listener ke tombol
  if (langIdButton && langEnButton) {
    langIdButton.addEventListener("click", () => switchLanguage("id"));
    langEnButton.addEventListener("click", () => switchLanguage("en"));
  }

  // Inisialisasi saat halaman dimuat
  updateButtonState();
}

// Panggil fungsi baru ini di dalam blok eksekusi utama
document.addEventListener("DOMContentLoaded", () => {
  // ... (semua fungsi handle... Anda yang sudah ada) ...
  handleLanguageSwitcher(); // <-- Tambahkan baris ini
});
